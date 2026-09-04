import type { Algorithm, AlgorithmInput, VisualizationStep, ArrayElementState, Complexity, Language } from '@/types';

function makeArrayState(
  array: number[],
  left: number,
  right: number,
  extras: { i?: number; slow?: number; fast?: number; found?: number[]; eliminated?: Set<number> } = {}
): ArrayElementState[] {
  return array.map((value, index) => {
    let state: ArrayElementState['state'] = 'default';
    if (extras.found?.includes(index)) {
      state = 'found';
    } else if (extras.eliminated?.has(index)) {
      state = 'eliminated';
    } else if (index === left && index === right) {
      state = 'comparing';
    } else if (index === left) {
      state = 'left';
    } else if (index === right) {
      state = 'right';
    } else if (extras.i === index) {
      state = 'i';
    } else if (extras.slow === index) {
      state = 'slow';
    } else if (extras.fast === index) {
      state = 'fast';
    } else if (left >= 0 && right >= 0 && index >= left && index <= right) {
      state = 'active';
    }
    return { value, index, state };
  });
}

export const twoSumII: Algorithm = {
  id: 'two-sum-ii',
  name: 'Two Sum II - Input Array Is Sorted',
  description: 'Given a 1-indexed sorted array and a target, return indices of two numbers that add up to target.',
  pattern: 'Opposite Direction',
  visualizationType: 'opposite-pointers',
  dataStructure: 'Array',

  generateSteps(input: AlgorithmInput): VisualizationStep[] {
    const { array, target } = input;
    const steps: VisualizationStep[] = [];
    let left = 0;
    let right = array.length - 1;
    let comparisons = 0;

    steps.push({
      array: makeArrayState(array, left, right),
      left, right, slow: -1, fast: -1, i: -1, target,
      activeLine: 1,
      explanation: `Initialize left = ${left + 1}, right = ${right + 1}. The array is sorted, so we start from both ends.`,
      condition: 'left < right',
      action: 'Begin search',
      result: 'in-progress',
      comparisons: 0,
      variables: [
        { label: 'left', value: left + 1, color: 'left' },
        { label: 'right', value: right + 1, color: 'right' },
        { label: 'target', value: target },
      ],
    });

    while (left < right) {
      const sum = array[left] + array[right];
      comparisons++;

      steps.push({
        array: makeArrayState(array, left, right),
        left, right, slow: -1, fast: -1, i: -1, target,
        activeLine: 3,
        explanation: `Compare: nums[left] + nums[right] = ${array[left]} + ${array[right]} = ${sum}. Target = ${target}.`,
        condition: `nums[left] + nums[right] = ${sum} vs target = ${target}`,
        action: 'Comparing...',
        result: 'in-progress',
        comparisons,
        variables: [
          { label: 'left', value: left + 1, color: 'left' },
          { label: 'right', value: right + 1, color: 'right' },
          { label: 'nums[left]', value: array[left] },
          { label: 'nums[right]', value: array[right] },
          { label: 'sum', value: sum },
          { label: 'target', value: target },
        ],
      });

      if (sum === target) {
        steps.push({
          array: makeArrayState(array, left, right, { found: [left, right] }),
          left, right, slow: -1, fast: -1, i: -1, target,
          activeLine: 4,
          explanation: `sum (${sum}) == target (${target}). Found! Return [${left + 1}, ${right + 1}] (1-indexed).`,
          condition: `sum == target`,
          action: 'Return indices',
          result: 'found',
          comparisons,
          resultValue: `[${left + 1}, ${right + 1}]`,
          variables: [
            { label: 'left', value: left + 1, color: 'left' },
            { label: 'right', value: right + 1, color: 'right' },
            { label: 'sum', value: sum },
            { label: 'target', value: target },
          ],
        });
        return steps;
      } else if (sum < target) {
        steps.push({
          array: makeArrayState(array, left, right),
          left, right, slow: -1, fast: -1, i: -1, target,
          activeLine: 6,
          explanation: `sum (${sum}) < target (${target}). We need a larger sum. Move left forward to increase it.`,
          condition: `sum < target`,
          action: 'Move left forward (left++)',
          result: 'in-progress',
          comparisons,
          variables: [
            { label: 'left', value: left + 1, color: 'left' },
            { label: 'right', value: right + 1, color: 'right' },
            { label: 'sum', value: sum },
            { label: 'target', value: target },
          ],
        });
        left++;
      } else {
        steps.push({
          array: makeArrayState(array, left, right),
          left, right, slow: -1, fast: -1, i: -1, target,
          activeLine: 8,
          explanation: `sum (${sum}) > target (${target}). We need a smaller sum. Move right backward to decrease it.`,
          condition: `sum > target`,
          action: 'Move right backward (right--)',
          result: 'in-progress',
          comparisons,
          variables: [
            { label: 'left', value: left + 1, color: 'left' },
            { label: 'right', value: right + 1, color: 'right' },
            { label: 'sum', value: sum },
            { label: 'target', value: target },
          ],
        });
        right--;
      }
    }

    steps.push({
      array: makeArrayState(array, -1, -1),
      left, right, slow: -1, fast: -1, i: -1, target,
      activeLine: 10,
      explanation: `left >= right. No pair found that sums to target.`,
      condition: 'left >= right',
      action: 'No solution found',
      result: 'not-found',
      comparisons,
    });
    return steps;
  },

  getComplexity(): Complexity {
    return {
      time: 'O(n)',
      space: 'O(1)',
      description: 'Each step moves left or right by one, so at most n steps are needed. Only constant extra space is used.',
    };
  },

  getCode(language: Language): string[] {
    const codes: Record<Language, string[]> = {
      c: [
        '// Two Sum II - Sorted Array',
        'int* twoSum(int* nums, int numsSize, int target, int* returnSize) {',
        '    int left = 0, right = numsSize - 1;',
        '    while (left < right) {',
        '        int sum = nums[left] + nums[right];',
        '        if (sum == target) {',
        '            int* result = malloc(2 * sizeof(int));',
        '            result[0] = left + 1; result[1] = right + 1;',
        '            *returnSize = 2; return result;',
        '        } else if (sum < target) {',
        '            left++;',
        '        } else {',
        '            right--;',
        '        }',
        '    }',
        '    *returnSize = 0; return NULL;',
        '}',
      ],
      cpp: [
        '// Two Sum II - Sorted Array',
        'vector<int> twoSum(vector<int>& nums, int target) {',
        '    int left = 0, right = nums.size() - 1;',
        '    while (left < right) {',
        '        int sum = nums[left] + nums[right];',
        '        if (sum == target) {',
        '            return {left + 1, right + 1};',
        '        } else if (sum < target) {',
        '            left++;',
        '        } else {',
        '            right--;',
        '        }',
        '    }',
        '    return {};',
        '}',
      ],
      java: [
        '// Two Sum II - Sorted Array',
        'public int[] twoSum(int[] nums, int target) {',
        '    int left = 0, right = nums.length - 1;',
        '    while (left < right) {',
        '        int sum = nums[left] + nums[right];',
        '        if (sum == target) {',
        '            return new int[]{left + 1, right + 1};',
        '        } else if (sum < target) {',
        '            left++;',
        '        } else {',
        '            right--;',
        '        }',
        '    }',
        '    return new int[]{};',
        '}',
      ],
    };
    return codes[language];
  },

  getDefaultInput(): AlgorithmInput {
    return { array: [2, 7, 11, 15, 18, 22, 30], target: 26 };
  },

  validateInput(input: AlgorithmInput): string | null {
    if (!input.array || input.array.length < 2) return 'Array must have at least 2 elements.';
    if (input.array.length > 50) return 'Array too large for visualization (max 50 elements).';
    for (let i = 1; i < input.array.length; i++) {
      if (input.array[i] < input.array[i - 1]) return 'Array must be sorted in non-decreasing order.';
    }
    return null;
  },

  getWhyItWorks(): string {
    return 'Because the array is sorted, moving left forward always increases the sum and moving right backward always decreases it. This lets us narrow in on the target without checking every pair.';
  },

  getCommonMistakes(): string[] {
    return [
      'Forgetting that the array must be sorted for this approach to work.',
      'Moving the wrong pointer — if sum < target, move left (not right).',
      'Using left <= right instead of left < right, which could use the same element twice.',
      'Returning 0-indexed results when the problem asks for 1-indexed.',
    ];
  },

  getChallengeForStep(step, stepIndex, allSteps) {
    if (stepIndex < 2 || step.result === 'found' || step.result === 'not-found') return null;
    const nextStep = allSteps[stepIndex + 1];
    if (!nextStep || nextStep.result === 'found') return null;
    const movedLeft = nextStep.left > step.left;
    const movedRight = nextStep.right < step.right;
    const correct = movedLeft ? 0 : movedRight ? 1 : 2;
    const sum = step.array[step.left]?.value as number + (step.array[step.right]?.value as number);
    return {
      prompt: `left = ${step.left + 1}, right = ${step.right + 1}, sum = ${sum}, target = ${step.target}. What should you do?`,
      options: ['Move left forward', 'Move right backward', 'Stop (found)'],
      correctIndex: correct,
      explanation: sum < step.target
        ? `The sum (${sum}) is less than target (${step.target}), so we need a larger value. Move left forward.`
        : `The sum (${sum}) is greater than target (${step.target}), so we need a smaller value. Move right backward.`,
    };
  },
};
