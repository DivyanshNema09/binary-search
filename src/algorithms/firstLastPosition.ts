import type { Algorithm, AlgorithmInput, VisualizationStep, ArrayElementState, Complexity, Language } from '@/types';

function makeArrayState(array: number[], low: number, high: number, mid: number, target: number, foundIndex: number, eliminated: Set<number>): ArrayElementState[] {
  return array.map((value, index) => {
    let state: ArrayElementState['state'] = 'default';
    if (foundIndex >= 0 && index === foundIndex) {
      state = 'found';
    } else if (index >= low && index <= high) {
      if (index === low && index === high) state = 'mid';
      else if (index === low) state = 'low';
      else if (index === high) state = 'high';
      else if (index === mid) state = 'mid';
      else if (value === target) state = 'target';
      else state = 'active-range';
    } else if (eliminated.has(index)) {
      state = 'eliminated';
    }
    return { value, index, state };
  });
}

export const findFirstLastPosition: Algorithm = {
  id: 'find-first-last-position',
  name: 'Find First and Last Position of Element in Sorted Array',
  description: 'Given a sorted array with duplicates, find the starting and ending position of a given target value. If not found, return [-1, -1].',
  pattern: 'Boundary Search',
  visualizationType: 'binary-search-boundary',

  generateSteps(input: AlgorithmInput): VisualizationStep[] {
    const { array, target } = input;
    const steps: VisualizationStep[] = [];
    let comparisons = 0;
    const eliminated = new Set<number>();

    // Find first occurrence
    let first = -1;
    let low = 0;
    let high = array.length - 1;

    steps.push({
      array: makeArrayState(array, low, high, -1, target, -1, eliminated),
      low, mid: -1, high, target,
      activeLine: 0,
      explanation: `Phase 1: Find the FIRST occurrence of target ${target}. Initialize low = 0, high = ${high}.`,
      condition: 'low <= high',
      action: 'Find first occurrence',
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
        explanation: `mid = ${mid}, nums[mid] = ${array[mid]}.`,
        condition: `nums[mid] = ${array[mid]}`,
        action: 'Calculate mid',
        result: 'in-progress',
        comparisons,
      });

      if (array[mid] >= target) {
        if (array[mid] === target) {
          first = mid;
          steps.push({
            array: makeArrayState(array, low, high, mid, target, mid, eliminated),
            low, mid, high, target,
            activeLine: 3,
            explanation: `nums[mid] (${array[mid]}) == target (${target}). Found a match at index ${mid}, but there might be an earlier occurrence. Save this as first = ${mid} and search left.`,
            condition: `nums[mid] == target`,
            action: `Save first = ${mid}, search left: high = mid - 1`,
            result: 'in-progress',
            comparisons,
          });
        } else {
          steps.push({
            array: makeArrayState(array, low, high, mid, target, -1, eliminated),
            low, mid, high, target,
            activeLine: 4,
            explanation: `nums[mid] (${array[mid]}) > target (${target}). Search left: high = mid - 1 = ${mid - 1}.`,
            condition: `nums[mid] > target`,
            action: `high = mid - 1 = ${mid - 1}`,
            result: 'in-progress',
            comparisons,
          });
        }
        for (let i = mid; i <= high; i++) eliminated.add(i);
        high = mid - 1;
      } else {
        steps.push({
          array: makeArrayState(array, low, high, mid, target, -1, eliminated),
          low, mid, high, target,
          activeLine: 5,
          explanation: `nums[mid] (${array[mid]}) < target (${target}). Search right: low = mid + 1 = ${mid + 1}.`,
          condition: `nums[mid] < target`,
          action: `low = mid + 1 = ${mid + 1}`,
          result: 'in-progress',
          comparisons,
        });
        for (let i = low; i <= mid; i++) eliminated.add(i);
        low = mid + 1;
      }
    }

    if (first === -1) {
      steps.push({
        array: makeArrayState(array, 0, array.length - 1, -1, target, -1, eliminated),
        low, mid: -1, high, target,
        activeLine: 6,
        explanation: `Target ${target} was not found in the array. Return [-1, -1].`,
        condition: 'first == -1',
        action: 'Return [-1, -1]',
        result: 'not-found',
        comparisons,
      });
      return steps;
    }

    // Find last occurrence
    eliminated.clear();
    low = 0;
    high = array.length - 1;
    let last = -1;

    steps.push({
      array: makeArrayState(array, low, high, -1, target, first, eliminated),
      low, mid: -1, high, target,
      activeLine: 7,
      explanation: `Phase 2: Find the LAST occurrence. First occurrence was found at index ${first}. Now search for the rightmost occurrence.`,
      condition: 'low <= high',
      action: 'Find last occurrence',
      result: 'in-progress',
      comparisons,
    });

    while (low <= high) {
      const mid = Math.floor(low + (high - low) / 2);
      comparisons++;

      steps.push({
        array: makeArrayState(array, low, high, mid, target, -1, eliminated),
        low, mid, high, target,
        activeLine: 9,
        explanation: `mid = ${mid}, nums[mid] = ${array[mid]}.`,
        condition: `nums[mid] = ${array[mid]}`,
        action: 'Calculate mid',
        result: 'in-progress',
        comparisons,
      });

      if (array[mid] <= target) {
        if (array[mid] === target) {
          last = mid;
          steps.push({
            array: makeArrayState(array, low, high, mid, target, mid, eliminated),
            low, mid, high, target,
            activeLine: 10,
            explanation: `nums[mid] (${array[mid]}) == target (${target}). Found a match at index ${mid}, but there might be a later occurrence. Save last = ${mid} and search right.`,
            condition: `nums[mid] == target`,
            action: `Save last = ${mid}, search right: low = mid + 1`,
            result: 'in-progress',
            comparisons,
          });
        } else {
          steps.push({
            array: makeArrayState(array, low, high, mid, target, -1, eliminated),
            low, mid, high, target,
            activeLine: 11,
            explanation: `nums[mid] (${array[mid]}) < target (${target}). Search right: low = mid + 1 = ${mid + 1}.`,
            condition: `nums[mid] < target`,
            action: `low = mid + 1 = ${mid + 1}`,
            result: 'in-progress',
            comparisons,
          });
        }
        for (let i = low; i <= mid; i++) eliminated.add(i);
        low = mid + 1;
      } else {
        steps.push({
          array: makeArrayState(array, low, high, mid, target, -1, eliminated),
          low, mid, high, target,
          activeLine: 12,
          explanation: `nums[mid] (${array[mid]}) > target (${target}). Search left: high = mid - 1 = ${mid - 1}.`,
          condition: `nums[mid] > target`,
          action: `high = mid - 1 = ${mid - 1}`,
          result: 'in-progress',
          comparisons,
        });
        for (let i = mid; i <= high; i++) eliminated.add(i);
        high = mid - 1;
      }
    }

    steps.push({
      array: makeArrayState(array, 0, array.length - 1, -1, target, -1, eliminated),
      low, mid: -1, high, target,
      activeLine: 13,
      explanation: `First occurrence: index ${first}. Last occurrence: index ${last}. Result: [${first}, ${last}].`,
      condition: 'Search complete',
      action: `Return [${first}, ${last}]`,
      result: 'found',
      comparisons,
    });

    return steps;
  },

  getComplexity(): Complexity {
    return {
      time: 'O(log n)',
      space: 'O(1)',
      description: 'Two binary searches are performed (one for each boundary), each O(log n). Total time is still O(log n).',
    };
  },

  getCode(language: Language): string[] {
    const codes: Record<Language, string[]> = {
      c: [
        '// Find First and Last Position',
        'int* searchRange(int* nums, int numsSize, int target, int* returnSize) {',
        '    int* result = malloc(2 * sizeof(int));',
        '    // Find first occurrence',
        '    int first = -1, low = 0, high = numsSize - 1;',
        '    while (low <= high) {',
        '        int mid = low + (high - low) / 2;',
        '        if (nums[mid] >= target) {',
        '            if (nums[mid] == target) first = mid;',
        '            high = mid - 1;',
        '        } else { low = mid + 1; }',
        '    }',
        '    if (first == -1) { result[0] = -1; result[1] = -1; return result; }',
        '    // Find last occurrence',
        '    int last = -1; low = 0; high = numsSize - 1;',
        '    while (low <= high) {',
        '        int mid = low + (high - low) / 2;',
        '        if (nums[mid] <= target) {',
        '            if (nums[mid] == target) last = mid;',
        '            low = mid + 1;',
        '        } else { high = mid - 1; }',
        '    }',
        '    result[0] = first; result[1] = last; return result;',
        '}',
      ],
      cpp: [
        '// Find First and Last Position',
        'vector<int> searchRange(vector<int>& nums, int target) {',
        '    // Find first occurrence',
        '    int first = -1, low = 0, high = nums.size() - 1;',
        '    while (low <= high) {',
        '        int mid = low + (high - low) / 2;',
        '        if (nums[mid] >= target) {',
        '            if (nums[mid] == target) first = mid;',
        '            high = mid - 1;',
        '        } else { low = mid + 1; }',
        '    }',
        '    if (first == -1) return {-1, -1};',
        '    // Find last occurrence',
        '    int last = -1; low = 0; high = nums.size() - 1;',
        '    while (low <= high) {',
        '        int mid = low + (high - low) / 2;',
        '        if (nums[mid] <= target) {',
        '            if (nums[mid] == target) last = mid;',
        '            low = mid + 1;',
        '        } else { high = mid - 1; }',
        '    }',
        '    return {first, last};',
        '}',
      ],
      java: [
        '// Find First and Last Position',
        'public int[] searchRange(int[] nums, int target) {',
        '    // Find first occurrence',
        '    int first = -1, low = 0, high = nums.length - 1;',
        '    while (low <= high) {',
        '        int mid = low + (high - low) / 2;',
        '        if (nums[mid] >= target) {',
        '            if (nums[mid] == target) first = mid;',
        '            high = mid - 1;',
        '        } else { low = mid + 1; }',
        '    }',
        '    if (first == -1) return new int[]{-1, -1};',
        '    // Find last occurrence',
        '    int last = -1; low = 0; high = nums.length - 1;',
        '    while (low <= high) {',
        '        int mid = low + (high - low) / 2;',
        '        if (nums[mid] <= target) {',
        '            if (nums[mid] == target) last = mid;',
        '            low = mid + 1;',
        '        } else { high = mid - 1; }',
        '    }',
        '    return new int[]{first, last};',
        '}',
      ],
    };
    return codes[language];
  },

  getDefaultInput(): AlgorithmInput {
    return { array: [5, 7, 7, 8, 8, 8, 10], target: 8 };
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
