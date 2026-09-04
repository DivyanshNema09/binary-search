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

export const findPeakElement: Algorithm = {
  id: 'find-peak-element',
  name: 'Find Peak Element',
  description: 'A peak element is an element that is strictly greater than its neighbors. Given an array, find any peak element index. The array can be unsorted.',
  pattern: 'Peak Finding',
  visualizationType: 'peak-finding',

  generateSteps(input: AlgorithmInput): VisualizationStep[] {
    const { array } = input;
    const steps: VisualizationStep[] = [];
    let low = 0;
    let high = array.length - 1;
    let comparisons = 0;
    const eliminated = new Set<number>();

    steps.push({
      array: makeArrayState(array, low, high, -1, -1, eliminated),
      low, mid: -1, high, target: -1,
      activeLine: 0,
      explanation: `Initialize low = ${low}, high = ${high}. A peak element is greater than both its neighbors.`,
      condition: 'low <= high',
      action: 'Begin peak search',
      result: 'in-progress',
      comparisons: 0,
    });

    while (low <= high) {
      const mid = Math.floor(low + (high - low) / 2);
      comparisons++;

      steps.push({
        array: makeArrayState(array, low, high, mid, -1, eliminated),
        low, mid, high, target: -1,
        activeLine: 2,
        explanation: `Calculate mid = ${mid}, nums[mid] = ${array[mid]}.`,
        condition: `mid = ${mid}`,
        action: 'Calculate middle index',
        result: 'in-progress',
        comparisons,
      });

      // Check if mid is a peak
      const left = mid > 0 ? array[mid - 1] : Number.NEGATIVE_INFINITY;
      const right = mid < array.length - 1 ? array[mid + 1] : Number.NEGATIVE_INFINITY;
      const isPeak = array[mid] > left && array[mid] > right;

      steps.push({
        array: makeArrayState(array, low, high, mid, -1, eliminated),
        low, mid, high, target: -1,
        activeLine: 3,
        explanation: `Check if nums[mid] = ${array[mid]} is a peak. Left neighbor: ${mid > 0 ? array[mid - 1] : '-∞'}, Right neighbor: ${mid < array.length - 1 ? array[mid + 1] : '-∞'}.`,
        condition: `nums[mid] > neighbors?`,
        action: isPeak ? 'Peak found!' : 'Not a peak',
        result: isPeak ? 'found' : 'in-progress',
        comparisons,
      });

      if (isPeak) {
        steps.push({
          array: makeArrayState(array, low, high, mid, mid, eliminated),
          low, mid, high, target: -1,
          activeLine: 4,
          explanation: `nums[mid] = ${array[mid]} is greater than both neighbors. Peak found at index ${mid}!`,
          condition: 'nums[mid] is a peak',
          action: `Return ${mid}`,
          result: 'found',
          comparisons,
        });
        return steps;
      }

      // Move to the side with a greater neighbor
      steps.push({
        array: makeArrayState(array, low, high, mid, -1, eliminated),
        low, mid, high, target: -1,
        activeLine: 5,
        explanation: `nums[mid] = ${array[mid]} is not a peak. Check which neighbor is greater to decide search direction.`,
        condition: `Which neighbor is greater?`,
        action: 'Compare neighbors',
        result: 'in-progress',
        comparisons,
      });

      if (mid < array.length - 1 && array[mid + 1] > array[mid]) {
        steps.push({
          array: makeArrayState(array, low, high, mid, -1, eliminated),
          low, mid, high, target: -1,
          activeLine: 6,
          explanation: `Right neighbor (${array[mid + 1]}) > nums[mid] (${array[mid]}). A peak must exist on the right. Set low = mid + 1 = ${mid + 1}.`,
          condition: `nums[mid+1] > nums[mid]`,
          action: `low = mid + 1 = ${mid + 1}`,
          result: 'in-progress',
          comparisons,
        });
        for (let i = low; i <= mid; i++) eliminated.add(i);
        low = mid + 1;
      } else {
        steps.push({
          array: makeArrayState(array, low, high, mid, -1, eliminated),
          low, mid, high, target: -1,
          activeLine: 7,
          explanation: `Left neighbor (${array[mid - 1]}) > nums[mid] (${array[mid]}). A peak must exist on the left. Set high = mid - 1 = ${mid - 1}.`,
          condition: `nums[mid-1] > nums[mid]`,
          action: `high = mid - 1 = ${mid - 1}`,
          result: 'in-progress',
          comparisons,
        });
        for (let i = mid; i <= high; i++) eliminated.add(i);
        high = mid - 1;
      }
    }

    steps.push({
      array: makeArrayState(array, 0, array.length - 1, -1, 0, eliminated),
      low, mid: -1, high, target: -1,
      activeLine: 8,
      explanation: `Peak search complete. Return index ${Math.min(low, array.length - 1)}.`,
      condition: 'Search complete',
      action: 'Return result',
      result: 'found',
      comparisons,
    });

    return steps;
  },

  getComplexity(): Complexity {
    return {
      time: 'O(log n)',
      space: 'O(1)',
      description: 'Binary search works here because if nums[mid+1] > nums[mid], a peak is guaranteed to exist on the right side (since we move toward increasing values).',
    };
  },

  getCode(language: Language): string[] {
    const codes: Record<Language, string[]> = {
      c: [
        '// Find Peak Element',
        'int findPeakElement(int* nums, int numsSize) {',
        '    int low = 0, high = numsSize - 1;',
        '    while (low <= high) {',
        '        int mid = low + (high - low) / 2;',
        '        // Check if mid is a peak',
        '        int left = mid > 0 ? nums[mid-1] : INT_MIN;',
        '        int right = mid < numsSize-1 ? nums[mid+1] : INT_MIN;',
        '        if (nums[mid] > left && nums[mid] > right)',
        '            return mid;',
        '        // Move to the greater neighbor',
        '        if (mid < numsSize-1 && nums[mid+1] > nums[mid])',
        '            low = mid + 1;',
        '        else',
        '            high = mid - 1;',
        '    }',
        '    return low;',
        '}',
      ],
      cpp: [
        '// Find Peak Element',
        'int findPeakElement(vector<int>& nums) {',
        '    int low = 0, high = nums.size() - 1;',
        '    while (low <= high) {',
        '        int mid = low + (high - low) / 2;',
        '        // Check if mid is a peak',
        '        long left = mid > 0 ? nums[mid-1] : LONG_MIN;',
        '        long right = mid < (int)nums.size()-1 ? nums[mid+1] : LONG_MIN;',
        '        if (nums[mid] > left && nums[mid] > right)',
        '            return mid;',
        '        // Move to the greater neighbor',
        '        if (mid < (int)nums.size()-1 && nums[mid+1] > nums[mid])',
        '            low = mid + 1;',
        '        else',
        '            high = mid - 1;',
        '    }',
        '    return low;',
        '}',
      ],
      java: [
        '// Find Peak Element',
        'public int findPeakElement(int[] nums) {',
        '    int low = 0, high = nums.length - 1;',
        '    while (low <= high) {',
        '        int mid = low + (high - low) / 2;',
        '        // Check if mid is a peak',
        '        long left = mid > 0 ? nums[mid-1] : Long.MIN_VALUE;',
        '        long right = mid < nums.length-1 ? nums[mid+1] : Long.MIN_VALUE;',
        '        if (nums[mid] > left && nums[mid] > right)',
        '            return mid;',
        '        // Move to the greater neighbor',
        '        if (mid < nums.length-1 && nums[mid+1] > nums[mid])',
        '            low = mid + 1;',
        '        else',
        '            high = mid - 1;',
        '    }',
        '    return low;',
        '}',
      ],
    };
    return codes[language];
  },

  getDefaultInput(): AlgorithmInput {
    return { array: [1, 2, 3, 1], target: -1 };
  },

  validateInput(input: AlgorithmInput): string | null {
    if (!input.array || input.array.length === 0) return 'Array cannot be empty.';
    if (input.array.length > 100) return 'Array too large for visualization (max 100 elements).';
    return null;
  },
};
