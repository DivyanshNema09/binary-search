import type { Algorithm, AlgorithmInput, VisualizationStep, ArrayElementState, Complexity, Language } from '@/types';

function makeArrayState(array: number[], low: number, high: number, mid: number, eliminated: Set<number>): ArrayElementState[] {
  return array.map((value, index) => {
    let state: ArrayElementState['state'] = 'default';
    if (index >= low && index <= high) {
      if (index === low && index === high) state = 'mid';
      else if (index === low) state = 'low';
      else if (index === high) state = 'high';
      else if (index === mid) state = 'mid';
      else state = 'active-range';
    } else if (eliminated.has(index)) {
      state = 'eliminated';
    }
    return { value, index, state };
  });
}

export const searchInsertPosition: Algorithm = {
  id: 'search-insert-position',
  name: 'Search Insert Position',
  description: 'Given a sorted array of distinct integers and a target value, return the index where the target should be inserted to maintain sorted order.',
  pattern: 'Basic Binary Search',
  visualizationType: 'binary-search',

  generateSteps(input: AlgorithmInput): VisualizationStep[] {
    const { array, target } = input;
    const steps: VisualizationStep[] = [];
    let low = 0;
    let high = array.length - 1;
    let comparisons = 0;
    const eliminated = new Set<number>();

    steps.push({
      array: makeArrayState(array, low, high, -1, eliminated),
      low, mid: -1, high, target,
      activeLine: 0,
      explanation: `Initialize low = ${low}, high = ${high}. Search for target ${target} or its correct insertion position.`,
      condition: 'low <= high',
      action: 'Begin search',
      result: 'in-progress',
      comparisons: 0,
    });

    while (low <= high) {
      const mid = Math.floor(low + (high - low) / 2);
      comparisons++;

      steps.push({
        array: makeArrayState(array, low, high, mid, eliminated),
        low, mid, high, target,
        activeLine: 2,
        explanation: `Calculate mid = ${mid}. nums[mid] = ${array[mid]}.`,
        condition: `mid = ${mid}`,
        action: 'Calculate middle index',
        result: 'in-progress',
        comparisons,
      });

      if (array[mid] === target) {
        steps.push({
          array: makeArrayState(array, low, high, mid, eliminated),
          low, mid, high, target,
          activeLine: 3,
          explanation: `nums[mid] (${array[mid]}) == target (${target}). Target found at index ${mid}. Return ${mid}.`,
          condition: `nums[mid] == target`,
          action: 'Return mid',
          result: 'found',
          comparisons,
        });
        return steps;
      } else if (array[mid] < target) {
        steps.push({
          array: makeArrayState(array, low, high, mid, eliminated),
          low, mid, high, target,
          activeLine: 4,
          explanation: `nums[mid] (${array[mid]}) < target (${target}). Target must be on the right. low = mid + 1 = ${mid + 1}.`,
          condition: `nums[mid] < target`,
          action: 'Search right half: low = mid + 1',
          result: 'in-progress',
          comparisons,
        });
        for (let i = low; i <= mid; i++) eliminated.add(i);
        low = mid + 1;
      } else {
        steps.push({
          array: makeArrayState(array, low, high, mid, eliminated),
          low, mid, high, target,
          activeLine: 5,
          explanation: `nums[mid] (${array[mid]}) > target (${target}). Target must be on the left. high = mid - 1 = ${mid - 1}.`,
          condition: `nums[mid] > target`,
          action: 'Search left half: high = mid - 1',
          result: 'in-progress',
          comparisons,
        });
        for (let i = mid; i <= high; i++) eliminated.add(i);
        high = mid - 1;
      }
    }

    steps.push({
      array: makeArrayState(array, 0, array.length - 1, -1, eliminated),
      low, mid: -1, high, target,
      activeLine: 6,
      explanation: `Target not found. The insertion position is low = ${low}, which is where the target would maintain sorted order.`,
      condition: 'low > high',
      action: `Return low = ${low} (insertion position)`,
      result: 'not-found',
      comparisons,
    });

    return steps;
  },

  getComplexity(): Complexity {
    return {
      time: 'O(log n)',
      space: 'O(1)',
      description: 'Binary search halves the search space each step, giving O(log n) time. Only constant extra space is used.',
    };
  },

  getCode(language: Language): string[] {
    const codes: Record<Language, string[]> = {
      c: [
        '// Search Insert Position',
        'int searchInsert(int* nums, int numsSize, int target) {',
        '    int low = 0, high = numsSize - 1;',
        '    while (low <= high) {',
        '        int mid = low + (high - low) / 2;',
        '        if (nums[mid] == target) return mid;',
        '        else if (nums[mid] < target) low = mid + 1;',
        '        else high = mid - 1;',
        '    }',
        '    return low;',
        '}',
      ],
      cpp: [
        '// Search Insert Position',
        'int searchInsert(vector<int>& nums, int target) {',
        '    int low = 0, high = nums.size() - 1;',
        '    while (low <= high) {',
        '        int mid = low + (high - low) / 2;',
        '        if (nums[mid] == target) return mid;',
        '        else if (nums[mid] < target) low = mid + 1;',
        '        else high = mid - 1;',
        '    }',
        '    return low;',
        '}',
      ],
      java: [
        '// Search Insert Position',
        'public int searchInsert(int[] nums, int target) {',
        '    int low = 0, high = nums.length - 1;',
        '    while (low <= high) {',
        '        int mid = low + (high - low) / 2;',
        '        if (nums[mid] == target) return mid;',
        '        else if (nums[mid] < target) low = mid + 1;',
        '        else high = mid - 1;',
        '    }',
        '    return low;',
        '}',
      ],
    };
    return codes[language];
  },

  getDefaultInput(): AlgorithmInput {
    return { array: [1, 3, 5, 6], target: 5 };
  },

  validateInput(input: AlgorithmInput): string | null {
    if (!input.array || input.array.length === 0) return 'Array cannot be empty.';
    if (input.array.length > 100) return 'Array too large for visualization (max 100 elements).';
    for (let i = 1; i < input.array.length; i++) {
      if (input.array[i] < input.array[i - 1]) {
        return 'Binary Search requires a sorted array. Would you like us to sort it automatically?';
      }
    }
    return null;
  },
};
