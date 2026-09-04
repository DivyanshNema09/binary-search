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
    } else if (index === slow) {
      state = 'slow';
    } else if (index === fast) {
      state = 'fast';
    } else if (extras.resultLen !== undefined && index < extras.resultLen) {
      state = 'active';
    } else if (extras.targetVal !== undefined && value === extras.targetVal) {
      state = 'eliminated';
    } else {
      state = 'active';
    }
    return { value, index, state };
  });
}

export const moveZeroes: Algorithm = {
  id: 'move-zeroes',
  name: 'Move Zeroes',
  description: 'Given an array, move all zeroes to the end while maintaining the relative order of non-zero elements.',
  pattern: 'Fast & Slow',
  visualizationType: 'fast-slow',
  dataStructure: 'Array',

  generateSteps(input: AlgorithmInput): VisualizationStep[] {
    const { array } = input;
    const steps: VisualizationStep[] = [];
    let slow = 0;
    let comparisons = 0;

    steps.push({
      array: makeArrayState(array, slow, 0),
      left: -1, right: -1, slow, fast: 0, i: -1, target: 0,
      activeLine: 1,
      explanation: `Initialize slow = 0. slow tracks where the next non-zero element should go. fast scans the array.`,
      condition: 'slow = 0, fast = 0',
      action: 'Begin scan',
      result: 'in-progress',
      comparisons: 0,
      variables: [
        { label: 'slow', value: slow, color: 'slow' },
        { label: 'fast', value: 0, color: 'fast' },
      ],
    });

    for (let fast = 0; fast < array.length; fast++) {
      comparisons++;

      steps.push({
        array: makeArrayState(array, slow, fast),
        left: -1, right: -1, slow, fast, i: -1, target: 0,
        activeLine: 3,
        explanation: `Check nums[fast] = ${array[fast]}. ${array[fast] !== 0 ? 'Non-zero — needs to be moved.' : 'Zero — skip, it stays in place.'}`,
        condition: `nums[fast] (${array[fast]}) != 0?`,
        action: array[fast] !== 0 ? 'Non-zero found' : 'Zero, skip',
        result: 'in-progress',
        comparisons,
        variables: [
          { label: 'slow', value: slow, color: 'slow' },
          { label: 'fast', value: fast, color: 'fast' },
          { label: 'nums[fast]', value: array[fast] },
        ],
      });

      if (array[fast] !== 0) {
        if (slow !== fast) {
          const tmp = array[slow];
          array[slow] = array[fast];
          array[fast] = tmp;
          steps.push({
            array: makeArrayState(array, slow, fast),
            left: -1, right: -1, slow, fast, i: -1, target: 0,
            activeLine: 4,
            explanation: `Swap nums[slow] and nums[fast]. Place ${array[slow]} at position ${slow}. The zero moves to position ${fast}.`,
            condition: `nums[fast] != 0 && slow != fast`,
            action: `Swap nums[${slow}] and nums[${fast}]`,
            result: 'in-progress',
            comparisons,
            swapped: [slow, fast],
            variables: [
              { label: 'slow', value: slow, color: 'slow' },
              { label: 'fast', value: fast, color: 'fast' },
              { label: 'nums[slow]', value: array[slow] },
              { label: 'nums[fast]', value: array[fast] },
            ],
          });
        } else {
          steps.push({
            array: makeArrayState(array, slow, fast),
            left: -1, right: -1, slow, fast, i: -1, target: 0,
            activeLine: 4,
            explanation: `nums[fast] is non-zero but slow == fast, so no swap needed. Element is already in the right place.`,
            condition: `slow == fast`,
            action: 'No swap needed',
            result: 'in-progress',
            comparisons,
            variables: [
              { label: 'slow', value: slow, color: 'slow' },
              { label: 'fast', value: fast, color: 'fast' },
            ],
          });
        }
        slow++;
      }
    }

    steps.push({
      array: makeArrayState(array, slow, array.length - 1),
      left: -1, right: -1, slow, fast: -1, i: -1, target: 0,
      activeLine: 7,
      explanation: `Done. All non-zero elements are at the front (indices 0 to ${slow - 1}). All zeroes moved to the end.`,
      condition: 'Done',
      action: 'Complete',
      result: 'success',
      comparisons,
      resultValue: `[${array.join(', ')}]`,
      variables: [
        { label: 'nonZeroCount', value: slow },
      ],
    });
    return steps;
  },

  getComplexity(): Complexity {
    return {
      time: 'O(n)',
      space: 'O(1)',
      description: 'Fast scans the array once. Slow only advances when a non-zero is found. In-place swaps use constant space.',
    };
  },

  getCode(language: Language): string[] {
    const codes: Record<Language, string[]> = {
      c: [
        '// Move Zeroes',
        'void moveZeroes(int* nums, int numsSize) {',
        '    int slow = 0;',
        '    for (int fast = 0; fast < numsSize; fast++) {',
        '        if (nums[fast] != 0) {',
        '            int tmp = nums[slow];',
        '            nums[slow] = nums[fast];',
        '            nums[fast] = tmp;',
        '            slow++;',
        '        }',
        '    }',
        '}',
      ],
      cpp: [
        '// Move Zeroes',
        'void moveZeroes(vector<int>& nums) {',
        '    int slow = 0;',
        '    for (int fast = 0; fast < nums.size(); fast++) {',
        '        if (nums[fast] != 0) {',
        '            swap(nums[slow], nums[fast]);',
        '            slow++;',
        '        }',
        '    }',
        '}',
      ],
      java: [
        '// Move Zeroes',
        'public void moveZeroes(int[] nums) {',
        '    int slow = 0;',
        '    for (int fast = 0; fast < nums.length; fast++) {',
        '        if (nums[fast] != 0) {',
        '            int tmp = nums[slow];',
        '            nums[slow] = nums[fast];',
        '            nums[fast] = tmp;',
        '            slow++;',
        '        }',
        '    }',
        '}',
      ],
    };
    return codes[language];
  },

  getDefaultInput(): AlgorithmInput {
    return { array: [0, 1, 0, 3, 12], target: 0 };
  },

  validateInput(input: AlgorithmInput): string | null {
    if (!input.array || input.array.length === 0) return 'Array cannot be empty.';
    if (input.array.length > 50) return 'Array too large for visualization (max 50 elements).';
    return null;
  },

  getWhyItWorks(): string {
    return 'Slow marks the boundary between non-zero elements and the rest. Fast scans ahead — when it finds a non-zero, it swaps it into the slow position. This preserves the relative order of non-zero elements and pushes all zeroes to the end.';
  },

  getCommonMistakes(): string[] {
    return [
      'Swapping even when slow == fast (unnecessary but harmless).',
      'Using overwrite instead of swap — this loses the zero values.',
      'Incrementing slow for zero elements instead of non-zero elements.',
    ];
  },
};
