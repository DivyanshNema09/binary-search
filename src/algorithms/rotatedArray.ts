import type { Algorithm, AlgorithmInput, VisualizationStep, ArrayElementState, Complexity, Language } from '@/types';

function makeArrayState(array: number[], low: number, high: number, mid: number, foundIndex: number, eliminated: Set<number>): ArrayElementState[] {
  return array.map((value, index) => {
    let state: ArrayElementState['state'] = 'default';
    if (foundIndex >= 0 && index === foundIndex) {
      state = 'found';
    } else if (index >= low && index <= high) {
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

export const searchRotatedSortedArray: Algorithm = {
  id: 'search-in-rotated-sorted-array',
  name: 'Search in Rotated Sorted Array',
  description: 'Given a rotated sorted array of distinct integers, find the index of a target value. Return -1 if not found.',
  pattern: 'Rotated Array',
  visualizationType: 'rotated-binary-search',

  generateSteps(input: AlgorithmInput): VisualizationStep[] {
    const { array, target } = input;
    const steps: VisualizationStep[] = [];
    let low = 0;
    let high = array.length - 1;
    let comparisons = 0;
    const eliminated = new Set<number>();

    steps.push({
      array: makeArrayState(array, low, high, -1, -1, eliminated),
      low, mid: -1, high, target,
      activeLine: 0,
      explanation: `Initialize low = ${low}, high = ${high}. Search for target ${target} in the rotated sorted array.`,
      condition: 'low <= high',
      action: 'Begin search',
      result: 'in-progress',
      comparisons: 0,
    });

    while (low <= high) {
      const mid = Math.floor(low + (high - low) / 2);
      comparisons++;

      steps.push({
        array: makeArrayState(array, low, high, mid, -1, eliminated),
        low, mid, high, target,
        activeLine: 2,
        explanation: `Calculate mid = ${mid}, nums[mid] = ${array[mid]}.`,
        condition: `mid = ${mid}`,
        action: 'Calculate middle index',
        result: 'in-progress',
        comparisons,
      });

      if (array[mid] === target) {
        steps.push({
          array: makeArrayState(array, low, high, mid, mid, eliminated),
          low, mid, high, target,
          activeLine: 3,
          explanation: `nums[mid] (${array[mid]}) == target (${target}). Found at index ${mid}!`,
          condition: `nums[mid] == target`,
          action: `Return ${mid}`,
          result: 'found',
          comparisons,
        });
        return steps;
      }

      // Check which half is sorted
      steps.push({
        array: makeArrayState(array, low, high, mid, -1, eliminated),
        low, mid, high, target,
        activeLine: 4,
        explanation: `Check which half is sorted: nums[low] = ${array[low]}, nums[mid] = ${array[mid]}.`,
        condition: `nums[low] <= nums[mid]?`,
        action: 'Determine sorted half',
        result: 'in-progress',
        comparisons,
      });

      if (array[low] <= array[mid]) {
        // Left half is sorted
        steps.push({
          array: makeArrayState(array, low, high, mid, -1, eliminated),
          low, mid, high, target,
          activeLine: 5,
          explanation: `Left half [${low}..${mid}] is sorted (nums[low] = ${array[low]} <= nums[mid] = ${array[mid]}). Check if target is in this range.`,
          condition: `nums[low] (${array[low]}) <= target (${target}) < nums[mid] (${array[mid]})?`,
          action: 'Left half is sorted',
          result: 'in-progress',
          comparisons,
        });

        if (array[low] <= target && target < array[mid]) {
          steps.push({
            array: makeArrayState(array, low, high, mid, -1, eliminated),
            low, mid, high, target,
            activeLine: 6,
            explanation: `Target ${target} is in the sorted left half. Set high = mid - 1 = ${mid - 1}.`,
            condition: `target in left half`,
            action: `high = mid - 1 = ${mid - 1}`,
            result: 'in-progress',
            comparisons,
          });
          for (let i = mid; i <= high; i++) eliminated.add(i);
          high = mid - 1;
        } else {
          steps.push({
            array: makeArrayState(array, low, high, mid, -1, eliminated),
            low, mid, high, target,
            activeLine: 7,
            explanation: `Target ${target} is NOT in the sorted left half. Search the right half: low = mid + 1 = ${mid + 1}.`,
            condition: `target not in left half`,
            action: `low = mid + 1 = ${mid + 1}`,
            result: 'in-progress',
            comparisons,
          });
          for (let i = low; i <= mid; i++) eliminated.add(i);
          low = mid + 1;
        }
      } else {
        // Right half is sorted
        steps.push({
          array: makeArrayState(array, low, high, mid, -1, eliminated),
          low, mid, high, target,
          activeLine: 8,
          explanation: `Right half [${mid}..${high}] is sorted (nums[mid] = ${array[mid]} <= nums[high] = ${array[high]}). Check if target is in this range.`,
          condition: `nums[mid] (${array[mid]}) < target (${target}) <= nums[high] (${array[high]})?`,
          action: 'Right half is sorted',
          result: 'in-progress',
          comparisons,
        });

        if (array[mid] < target && target <= array[high]) {
          steps.push({
            array: makeArrayState(array, low, high, mid, -1, eliminated),
            low, mid, high, target,
            activeLine: 9,
            explanation: `Target ${target} is in the sorted right half. Set low = mid + 1 = ${mid + 1}.`,
            condition: `target in right half`,
            action: `low = mid + 1 = ${mid + 1}`,
            result: 'in-progress',
            comparisons,
          });
          for (let i = low; i <= mid; i++) eliminated.add(i);
          low = mid + 1;
        } else {
          steps.push({
            array: makeArrayState(array, low, high, mid, -1, eliminated),
            low, mid, high, target,
            activeLine: 10,
            explanation: `Target ${target} is NOT in the sorted right half. Search the left half: high = mid - 1 = ${mid - 1}.`,
            condition: `target not in right half`,
            action: `high = mid - 1 = ${mid - 1}`,
            result: 'in-progress',
            comparisons,
          });
          for (let i = mid; i <= high; i++) eliminated.add(i);
          high = mid - 1;
        }
      }
    }

    steps.push({
      array: makeArrayState(array, 0, array.length - 1, -1, -1, eliminated),
      low, mid: -1, high, target,
      activeLine: 11,
      explanation: `Target ${target} was not found in the rotated array. Return -1.`,
      condition: 'low > high',
      action: 'Return -1',
      result: 'not-found',
      comparisons,
    });

    return steps;
  },

  getComplexity(): Complexity {
    return {
      time: 'O(log n)',
      space: 'O(1)',
      description: 'Even though the array is rotated, we can still determine which half to search in O(1) per step, maintaining O(log n) time.',
    };
  },

  getCode(language: Language): string[] {
    const codes: Record<Language, string[]> = {
      c: [
        '// Search in Rotated Sorted Array',
        'int search(int* nums, int numsSize, int target) {',
        '    int low = 0, high = numsSize - 1;',
        '    while (low <= high) {',
        '        int mid = low + (high - low) / 2;',
        '        if (nums[mid] == target) return mid;',
        '        // Check which half is sorted',
        '        if (nums[low] <= nums[mid]) {',
        '            if (nums[low] <= target && target < nums[mid])',
        '                high = mid - 1;',
        '            else low = mid + 1;',
        '        } else {',
        '            if (nums[mid] < target && target <= nums[high])',
        '                low = mid + 1;',
        '            else high = mid - 1;',
        '        }',
        '    }',
        '    return -1;',
        '}',
      ],
      cpp: [
        '// Search in Rotated Sorted Array',
        'int search(vector<int>& nums, int target) {',
        '    int low = 0, high = nums.size() - 1;',
        '    while (low <= high) {',
        '        int mid = low + (high - low) / 2;',
        '        if (nums[mid] == target) return mid;',
        '        // Check which half is sorted',
        '        if (nums[low] <= nums[mid]) {',
        '            if (nums[low] <= target && target < nums[mid])',
        '                high = mid - 1;',
        '            else low = mid + 1;',
        '        } else {',
        '            if (nums[mid] < target && target <= nums[high])',
        '                low = mid + 1;',
        '            else high = mid - 1;',
        '        }',
        '    }',
        '    return -1;',
        '}',
      ],
      java: [
        '// Search in Rotated Sorted Array',
        'public int search(int[] nums, int target) {',
        '    int low = 0, high = nums.length - 1;',
        '    while (low <= high) {',
        '        int mid = low + (high - low) / 2;',
        '        if (nums[mid] == target) return mid;',
        '        // Check which half is sorted',
        '        if (nums[low] <= nums[mid]) {',
        '            if (nums[low] <= target && target < nums[mid])',
        '                high = mid - 1;',
        '            else low = mid + 1;',
        '        } else {',
        '            if (nums[mid] < target && target <= nums[high])',
        '                low = mid + 1;',
        '            else high = mid - 1;',
        '        }',
        '    }',
        '    return -1;',
        '}',
      ],
    };
    return codes[language];
  },

  getDefaultInput(): AlgorithmInput {
    return { array: [4, 5, 6, 7, 0, 1, 2], target: 0 };
  },

  validateInput(input: AlgorithmInput): string | null {
    if (!input.array || input.array.length === 0) return 'Array cannot be empty.';
    if (input.array.length > 100) return 'Array too large for visualization (max 100 elements).';
    return null;
  },
};
