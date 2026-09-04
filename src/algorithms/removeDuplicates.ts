import type { Algorithm, AlgorithmInput, VisualizationStep, ArrayElementState, Complexity, Language } from '@/types';

function makeArrayState(
  array: number[],
  slow: number,
  fast: number,
  extras: { found?: number[]; resultLen?: number } = {}
): ArrayElementState[] {
  return array.map((value, index) => {
    let state: ArrayElementState['state'] = 'default';
    if (index < (extras.resultLen ?? array.length)) {
      state = 'active';
    }
    if (extras.found?.includes(index)) {
      state = 'found';
    } else if (index === slow && index === fast) {
      state = 'comparing';
    } else if (index === slow) {
      state = 'slow';
    } else if (index === fast) {
      state = 'fast';
    } else if (index < (extras.resultLen ?? array.length)) {
      state = 'active';
    } else {
      state = 'eliminated';
    }
    return { value, index, state };
  });
}

export const removeDuplicates: Algorithm = {
  id: 'remove-duplicates',
  name: 'Remove Duplicates from Sorted Array',
  description: 'Given a sorted array, remove duplicates in-place and return the new length.',
  pattern: 'Fast & Slow',
  visualizationType: 'fast-slow',
  dataStructure: 'Array',

  generateSteps(input: AlgorithmInput): VisualizationStep[] {
    const { array } = input;
    const steps: VisualizationStep[] = [];
    let slow = 0;
    let comparisons = 0;

    steps.push({
      array: makeArrayState(array, slow, 1),
      left: -1, right: -1, slow, fast: 1, i: -1, target: 0,
      activeLine: 1,
      explanation: `Initialize slow = 0 (points to the last unique element). fast will scan through the array.`,
      condition: 'slow = 0, fast = 1',
      action: 'Begin scan',
      result: 'in-progress',
      comparisons: 0,
      variables: [
        { label: 'slow', value: slow, color: 'slow' },
        { label: 'fast', value: 1, color: 'fast' },
      ],
    });

    for (let fast = 1; fast < array.length; fast++) {
      comparisons++;

      steps.push({
        array: makeArrayState(array, slow, fast),
        left: -1, right: -1, slow, fast, i: -1, target: 0,
        activeLine: 3,
        explanation: `Compare nums[slow] = ${array[slow]} with nums[fast] = ${array[fast]}.`,
        condition: `nums[slow] (${array[slow]}) != nums[fast] (${array[fast]})?`,
        action: 'Comparing...',
        result: 'in-progress',
        comparisons,
        variables: [
          { label: 'slow', value: slow, color: 'slow' },
          { label: 'fast', value: fast, color: 'fast' },
          { label: 'nums[slow]', value: array[slow] },
          { label: 'nums[fast]', value: array[fast] },
        ],
      });

      if (array[fast] !== array[slow]) {
        slow++;
        array[slow] = array[fast];
        steps.push({
          array: makeArrayState(array, slow, fast, { resultLen: slow + 1 }),
          left: -1, right: -1, slow, fast, i: -1, target: 0,
          activeLine: 4,
          explanation: `nums[fast] (${array[fast]}) is different from nums[slow]. New unique value found. Increment slow and copy: nums[slow] = ${array[fast]}.`,
          condition: `nums[fast] != nums[slow]`,
          action: `slow++, nums[slow] = ${array[fast]}`,
          result: 'in-progress',
          comparisons,
          swapped: [slow, fast],
          variables: [
            { label: 'slow', value: slow, color: 'slow' },
            { label: 'fast', value: fast, color: 'fast' },
            { label: 'nums[slow]', value: array[slow] },
          ],
        });
      } else {
        steps.push({
          array: makeArrayState(array, slow, fast),
          left: -1, right: -1, slow, fast, i: -1, target: 0,
          activeLine: 6,
          explanation: `nums[fast] (${array[fast]}) is a duplicate of nums[slow]. Skip it — slow stays in place.`,
          condition: `nums[fast] == nums[slow]`,
          action: 'Skip duplicate',
          result: 'in-progress',
          comparisons,
          variables: [
            { label: 'slow', value: slow, color: 'slow' },
            { label: 'fast', value: fast, color: 'fast' },
          ],
        });
      }
    }

    const newLen = slow + 1;
    steps.push({
      array: makeArrayState(array, slow, array.length - 1, { resultLen: newLen }),
      left: -1, right: -1, slow, fast: -1, i: -1, target: 0,
      activeLine: 8,
      explanation: `Scan complete. ${newLen} unique values remain in the first ${newLen} positions. Return ${newLen}.`,
      condition: 'Done',
      action: `Return ${newLen}`,
      result: 'success',
      comparisons,
      resultValue: `${newLen}`,
      variables: [
        { label: 'newLength', value: newLen },
      ],
    });
    return steps;
  },

  getComplexity(): Complexity {
    return {
      time: 'O(n)',
      space: 'O(1)',
      description: 'Fast pointer scans the array once. Slow pointer only moves when a new unique element is found. Constant space.',
    };
  },

  getCode(language: Language): string[] {
    const codes: Record<Language, string[]> = {
      c: [
        '// Remove Duplicates from Sorted Array',
        'int removeDuplicates(int* nums, int numsSize) {',
        '    if (numsSize == 0) return 0;',
        '    int slow = 0;',
        '    for (int fast = 1; fast < numsSize; fast++) {',
        '        if (nums[fast] != nums[slow]) {',
        '            slow++;',
        '            nums[slow] = nums[fast];',
        '        }',
        '    }',
        '    return slow + 1;',
        '}',
      ],
      cpp: [
        '// Remove Duplicates from Sorted Array',
        'int removeDuplicates(vector<int>& nums) {',
        '    if (nums.empty()) return 0;',
        '    int slow = 0;',
        '    for (int fast = 1; fast < nums.size(); fast++) {',
        '        if (nums[fast] != nums[slow]) {',
        '            slow++;',
        '            nums[slow] = nums[fast];',
        '        }',
        '    }',
        '    return slow + 1;',
        '}',
      ],
      java: [
        '// Remove Duplicates from Sorted Array',
        'public int removeDuplicates(int[] nums) {',
        '    if (nums.length == 0) return 0;',
        '    int slow = 0;',
        '    for (int fast = 1; fast < nums.length; fast++) {',
        '        if (nums[fast] != nums[slow]) {',
        '            slow++;',
        '            nums[slow] = nums[fast];',
        '        }',
        '    }',
        '    return slow + 1;',
        '}',
      ],
    };
    return codes[language];
  },

  getDefaultInput(): AlgorithmInput {
    return { array: [0, 0, 1, 1, 1, 2, 2, 3, 3, 4], target: 0 };
  },

  validateInput(input: AlgorithmInput): string | null {
    if (!input.array || input.array.length === 0) return 'Array cannot be empty.';
    if (input.array.length > 50) return 'Array too large for visualization (max 50 elements).';
    for (let i = 1; i < input.array.length; i++) {
      if (input.array[i] < input.array[i - 1]) return 'Array must be sorted in non-decreasing order.';
    }
    return null;
  },

  getWhyItWorks(): string {
    return 'The slow pointer marks the boundary of unique elements. The fast pointer scans ahead. When a new value appears, slow advances and the new value is placed there. Since the array is sorted, duplicates are always adjacent.';
  },

  getCommonMistakes(): string[] {
    return [
      'Forgetting that the array must be sorted — duplicates must be adjacent.',
      'Incrementing slow before the copy instead of after.',
      'Returning slow instead of slow + 1 (the length is index + 1).',
      'Not handling the empty array edge case.',
    ];
  },
};
