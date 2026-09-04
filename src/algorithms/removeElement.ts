import type { Algorithm, AlgorithmInput, VisualizationStep, ArrayElementState, Complexity, Language } from '@/types';

function makeArrayState(
  array: number[],
  slow: number,
  fast: number,
  extras: { found?: number[]; resultLen?: number; targetVal?: number } = {}
): ArrayElementState[] {
  return array.map((value, index) => {
    let state: ArrayElementState['state'] = 'default';
    if (extras.found?.includes(index)) {
      state = 'found';
    } else if (index === slow && index === fast) {
      state = 'comparing';
    } else if (index === slow) {
      state = 'slow';
    } else if (index === fast) {
      state = 'fast';
    } else if (extras.resultLen !== undefined && index < extras.resultLen) {
      state = 'active';
    } else if (extras.targetVal !== undefined && value === extras.targetVal) {
      state = 'eliminated';
    } else {
      state = 'default';
    }
    return { value, index, state };
  });
}

export const removeElement: Algorithm = {
  id: 'remove-element',
  name: 'Remove Element',
  description: 'Given an array and a value, remove all instances of that value in-place and return the new length.',
  pattern: 'Fast & Slow',
  visualizationType: 'fast-slow',
  dataStructure: 'Array',

  generateSteps(input: AlgorithmInput): VisualizationStep[] {
    const array = [...input.array];
    const target = input.target;
    const steps: VisualizationStep[] = [];
    let slow = 0;
    let comparisons = 0;

    steps.push({
      array: makeArrayState(array, slow, 0, { targetVal: target }),
      left: -1, right: -1, slow, fast: 0, i: -1, target,
      activeLine: 1,
      explanation: `Initialize slow = 0. slow tracks where the next non-target element should be written. fast scans the array looking for values != ${target}.`,
      condition: `slow = 0, fast = 0`,
      action: 'Begin scan',
      result: 'in-progress',
      comparisons: 0,
      variables: [
        { label: 'slow', value: slow, color: 'slow' },
        { label: 'fast', value: 0, color: 'fast' },
        { label: 'target', value: target },
      ],
    });

    for (let fast = 0; fast < array.length; fast++) {
      comparisons++;

      steps.push({
        array: makeArrayState(array, slow, fast, { targetVal: target }),
        left: -1, right: -1, slow, fast, i: -1, target,
        activeLine: 3,
        explanation: `Check nums[fast] = ${array[fast]}. ${array[fast] !== target ? `Not equal to ${target} — keep this element.` : `Equal to ${target} — skip it, it will be removed.`}`,
        condition: `nums[fast] (${array[fast]}) != ${target}?`,
        action: array[fast] !== target ? 'Keep element' : 'Skip target',
        result: 'in-progress',
        comparisons,
        variables: [
          { label: 'slow', value: slow, color: 'slow' },
          { label: 'fast', value: fast, color: 'fast' },
          { label: 'nums[slow]', value: array[slow] },
          { label: 'nums[fast]', value: array[fast] },
          { label: 'target', value: target },
        ],
      });

      if (array[fast] !== target) {
        if (slow !== fast) {
          const prev = array[slow];
          array[slow] = array[fast];
          steps.push({
            array: makeArrayState(array, slow, fast, { targetVal: target }),
            left: -1, right: -1, slow, fast, i: -1, target,
            activeLine: 4,
            explanation: `nums[fast] = ${array[slow]} is not ${target}. Copy it to nums[slow] (overwriting ${prev}). The target value at position ${slow} is effectively removed.`,
            condition: `nums[fast] != ${target} && slow != fast`,
            action: `nums[${slow}] = nums[${fast}]`,
            result: 'in-progress',
            comparisons,
            swapped: [slow, fast],
            variables: [
              { label: 'slow', value: slow, color: 'slow' },
              { label: 'fast', value: fast, color: 'fast' },
              { label: 'nums[slow]', value: array[slow] },
              { label: 'nums[fast]', value: array[fast] },
              { label: 'target', value: target },
            ],
          });
        } else {
          steps.push({
            array: makeArrayState(array, slow, fast, { targetVal: target }),
            left: -1, right: -1, slow, fast, i: -1, target,
            activeLine: 4,
            explanation: `nums[fast] = ${array[fast]} is not ${target}, but slow == fast so no copy is needed. The element is already in the correct position.`,
            condition: `slow == fast`,
            action: 'No copy needed',
            result: 'in-progress',
            comparisons,
            variables: [
              { label: 'slow', value: slow, color: 'slow' },
              { label: 'fast', value: fast, color: 'fast' },
              { label: 'nums[slow]', value: array[slow] },
              { label: 'nums[fast]', value: array[fast] },
              { label: 'target', value: target },
            ],
          });
        }
        slow++;
      } else {
        steps.push({
          array: makeArrayState(array, slow, fast, { targetVal: target }),
          left: -1, right: -1, slow, fast, i: -1, target,
          activeLine: 6,
          explanation: `nums[fast] = ${array[fast]} equals ${target}. Skip it — slow stays at ${slow}, ready for the next kept element.`,
          condition: `nums[fast] == ${target}`,
          action: 'Skip target value',
          result: 'in-progress',
          comparisons,
          variables: [
            { label: 'slow', value: slow, color: 'slow' },
            { label: 'fast', value: fast, color: 'fast' },
            { label: 'nums[slow]', value: array[slow] },
            { label: 'nums[fast]', value: array[fast] },
            { label: 'target', value: target },
          ],
        });
      }
    }

    const newLen = slow;
    steps.push({
      array: makeArrayState(array, slow, array.length - 1, { resultLen: newLen, targetVal: target }),
      left: -1, right: -1, slow, fast: -1, i: -1, target,
      activeLine: 8,
      explanation: `Scan complete. ${newLen} elements not equal to ${target} remain in the first ${newLen} positions. Elements from index ${newLen} onward are discarded. Return ${newLen}.`,
      condition: 'Done',
      action: `Return ${newLen}`,
      result: 'success',
      comparisons,
      resultValue: `${newLen}`,
      variables: [
        { label: 'newLength', value: newLen },
        { label: 'target', value: target },
      ],
    });
    return steps;
  },

  getComplexity(): Complexity {
    return {
      time: 'O(n)',
      space: 'O(1)',
      description: 'Fast scans the array exactly once. Slow only advances when a non-target element is found. The copy is in-place, so only constant extra space is used.',
    };
  },

  getCode(language: Language): string[] {
    const codes: Record<Language, string[]> = {
      c: [
        '// Remove Element',
        'int removeElement(int* nums, int numsSize, int val) {',
        '    int slow = 0;',
        '    for (int fast = 0; fast < numsSize; fast++) {',
        '        if (nums[fast] != val) {',
        '            nums[slow] = nums[fast];',
        '            slow++;',
        '        }',
        '    }',
        '    return slow;',
        '}',
      ],
      cpp: [
        '// Remove Element',
        'int removeElement(vector<int>& nums, int val) {',
        '    int slow = 0;',
        '    for (int fast = 0; fast < nums.size(); fast++) {',
        '        if (nums[fast] != val) {',
        '            nums[slow] = nums[fast];',
        '            slow++;',
        '        }',
        '    }',
        '    return slow;',
        '}',
      ],
      java: [
        '// Remove Element',
        'public int removeElement(int[] nums, int val) {',
        '    int slow = 0;',
        '    for (int fast = 0; fast < nums.length; fast++) {',
        '        if (nums[fast] != val) {',
        '            nums[slow] = nums[fast];',
        '            slow++;',
        '        }',
        '    }',
        '    return slow;',
        '}',
      ],
    };
    return codes[language];
  },

  getDefaultInput(): AlgorithmInput {
    return { array: [3, 2, 2, 3], target: 3 };
  },

  validateInput(input: AlgorithmInput): string | null {
    if (!input.array || input.array.length === 0) return 'Array cannot be empty.';
    if (input.array.length > 50) return 'Array too large for visualization (max 50 elements).';
    if (input.target === undefined || input.target === null) return 'Target value is required.';
    return null;
  },

  getWhyItWorks(): string {
    return 'The slow pointer marks the boundary where the next kept (non-target) element should be written. The fast pointer scans every element. When fast finds a value that is not the target, it copies that value into the slow position and advances slow. Target values are never copied, so they get overwritten by later kept values or left beyond the returned length. One pass, constant space, and the relative order of kept elements is preserved.';
  },

  getCommonMistakes(): string[] {
    return [
      'Copying even when slow == fast — harmless but unnecessary; a guard avoids the redundant write.',
      'Swapping instead of overwriting — swap is fine but unnecessary here, since the overwritten target values do not need to be preserved.',
      'Returning slow + 1 instead of slow — slow already points one past the last kept element, so it is the correct length.',
      'Forgetting that elements beyond the returned length are ignored by the caller, not actually erased from memory.',
    ];
  },
};
