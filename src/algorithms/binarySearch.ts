import type { Algorithm, AlgorithmInput, VisualizationStep, ArrayElementState, Complexity, Language } from '@/types';

function makeArrayState(array: number[], low: number, high: number, mid: number, target: number, foundIndex: number = -1, eliminated: Set<number> = new Set()): ArrayElementState[] {
  return array.map((value, index) => {
    let state: ArrayElementState['state'] = 'default';
    if (foundIndex === index) {
      state = 'found';
    } else if (index >= low && index <= high) {
      if (index === low && index === high) {
        state = 'mid';
      } else if (index === low) {
        state = 'low';
      } else if (index === high) {
        state = 'high';
      } else if (index === mid) {
        state = 'mid';
      } else if (value === target) {
        state = 'target';
      } else {
        state = 'active-range';
      }
    } else if (eliminated.has(index)) {
      state = 'eliminated';
    }
    return { value, index, state };
  });
}

export const binarySearch: Algorithm = {
  id: 'binary-search',
  name: 'Binary Search',
  description: 'Given a sorted array of integers and a target value, return the index of the target if it exists, otherwise return -1.',
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
      array: makeArrayState(array, low, high, -1, target, -1, eliminated),
      low, mid: -1, high, target,
      activeLine: 0,
      explanation: `Initialize low = ${low}, high = ${high}. We will search for target ${target} in the array.`,
      condition: 'low <= high',
      action: 'Begin search',
      result: 'in-progress',
      comparisons: 0,
    });

    while (low <= high) {
      const mid = Math.floor(low + (high - low) / 2);
      comparisons++;

      steps.push({
        array: makeArrayState(array, low, high, mid, target, -1, eliminated),
        low, mid, high, target,
        activeLine: 2,
        explanation: `Calculate mid = low + (high - low) / 2 = ${low} + (${high} - ${low}) / 2 = ${mid}.`,
        condition: `mid = ${mid}`,
        action: 'Calculate middle index',
        result: 'in-progress',
        comparisons,
      });

      steps.push({
        array: makeArrayState(array, low, high, mid, target, -1, eliminated),
        low, mid, high, target,
        activeLine: 3,
        explanation: `Compare nums[mid] = ${array[mid]} with target = ${target}.`,
        condition: `nums[mid] (${array[mid]}) == target (${target})?`,
        action: array[mid] === target ? 'Target found!' : 'Comparing...',
        result: array[mid] === target ? 'found' : 'in-progress',
        comparisons,
      });

      if (array[mid] === target) {
        steps.push({
          array: makeArrayState(array, low, high, mid, target, mid, eliminated),
          low, mid, high, target,
          activeLine: 4,
          explanation: `nums[mid] (${array[mid]}) equals target (${target}). Return mid = ${mid}. Target found at index ${mid}!`,
          condition: `nums[mid] == target`,
          action: 'Return mid',
          result: 'found',
          comparisons,
        });
        return steps;
      } else if (array[mid] < target) {
        steps.push({
          array: makeArrayState(array, low, high, mid, target, -1, eliminated),
          low, mid, high, target,
          activeLine: 5,
          explanation: `nums[mid] (${array[mid]}) < target (${target}). The target must be in the right half. Set low = mid + 1 = ${mid + 1}.`,
          condition: `nums[mid] (${array[mid]}) < target (${target})`,
          action: 'Search right half: low = mid + 1',
          result: 'in-progress',
          comparisons,
        });
        for (let i = low; i <= mid; i++) eliminated.add(i);
        low = mid + 1;
      } else {
        steps.push({
          array: makeArrayState(array, low, high, mid, target, -1, eliminated),
          low, mid, high, target,
          activeLine: 7,
          explanation: `nums[mid] (${array[mid]}) > target (${target}). The target must be in the left half. Set high = mid - 1 = ${mid - 1}.`,
          condition: `nums[mid] (${array[mid]}) > target (${target})`,
          action: 'Search left half: high = mid - 1',
          result: 'in-progress',
          comparisons,
        });
        for (let i = mid; i <= high; i++) eliminated.add(i);
        high = mid - 1;
      }

      steps.push({
        array: makeArrayState(array, low, high, -1, target, -1, eliminated),
        low, mid: -1, high, target,
        activeLine: 1,
        explanation: low <= high
          ? `Updated range: low = ${low}, high = ${high}. Continue searching.`
          : `low (${low}) > high (${high}). Search space exhausted.`,
        condition: `low (${low}) <= high (${high})?`,
        action: low <= high ? 'Continue loop' : 'Exit loop',
        result: 'in-progress',
        comparisons,
      });
    }

    steps.push({
      array: makeArrayState(array, 0, array.length - 1, -1, target, -1, eliminated),
      low, mid: -1, high, target,
      activeLine: 8,
      explanation: `Target ${target} was not found in the array. Return -1.`,
      condition: 'low > high',
      action: 'Return -1 (not found)',
      result: 'not-found',
      comparisons,
    });

    return steps;
  },

  getComplexity(): Complexity {
    return {
      time: 'O(log n)',
      space: 'O(1)',
      description: 'Each comparison eliminates half the search space, giving logarithmic time complexity. Only a few variables are used, so space is constant.',
    };
  },

  getCode(language: Language): string[] {
    const codes: Record<Language, string[]> = {
      c: [
        '// Binary Search - Iterative',
        'int search(int* nums, int numsSize, int target) {',
        '    int low = 0, high = numsSize - 1;',
        '    while (low <= high) {',
        '        int mid = low + (high - low) / 2;',
        '        if (nums[mid] == target) {',
        '            return mid;',
        '        } else if (nums[mid] < target) {',
        '            low = mid + 1;',
        '        } else {',
        '            high = mid - 1;',
        '        }',
        '    }',
        '    return -1;',
        '}',
      ],
      cpp: [
        '// Binary Search - Iterative',
        'int search(vector<int>& nums, int target) {',
        '    int low = 0, high = nums.size() - 1;',
        '    while (low <= high) {',
        '        int mid = low + (high - low) / 2;',
        '        if (nums[mid] == target) {',
        '            return mid;',
        '        } else if (nums[mid] < target) {',
        '            low = mid + 1;',
        '        } else {',
        '            high = mid - 1;',
        '        }',
        '    }',
        '    return -1;',
        '}',
      ],
      java: [
        '// Binary Search - Iterative',
        'public int search(int[] nums, int target) {',
        '    int low = 0, high = nums.length - 1;',
        '    while (low <= high) {',
        '        int mid = low + (high - low) / 2;',
        '        if (nums[mid] == target) {',
        '            return mid;',
        '        } else if (nums[mid] < target) {',
        '            low = mid + 1;',
        '        } else {',
        '            high = mid - 1;',
        '        }',
        '    }',
        '    return -1;',
        '}',
      ],
    };
    return codes[language];
  },

  getDefaultInput(): AlgorithmInput {
    return { array: [2, 5, 8, 12, 16, 23, 38, 56, 72], target: 23 };
  },

  validateInput(input: AlgorithmInput): string | null {
    if (!input.array || input.array.length === 0) return 'Array cannot be empty.';
    if (input.array.length > 100) return 'Array too large for visualization (max 100 elements).';
    for (let i = 1; i < input.array.length; i++) {
      if (input.array[i] < input.array[i - 1]) {
        return 'Binary Search requires a sorted array. Would you like us to sort it automatically?';
      }
    }
    if (input.target === undefined || input.target === null || Number.isNaN(input.target)) {
      return 'Target must be a valid number.';
    }
    return null;
  },
};
