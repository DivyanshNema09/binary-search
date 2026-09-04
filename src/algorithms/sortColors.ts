import type { Algorithm, AlgorithmInput, VisualizationStep, ArrayElementState, Complexity, Language } from '@/types';

function makeArrayState(
  array: number[],
  left: number,
  right: number,
  extras: { i?: number; found?: number[]; partitionLow?: number; partitionHigh?: number; partitionMid?: number } = {}
): ArrayElementState[] {
  return array.map((value, index) => {
    let state: ArrayElementState['state'] = 'default';
    if (extras.found?.includes(index)) {
      state = 'found';
    } else if (extras.partitionLow !== undefined && index < extras.partitionLow) {
      state = 'partition-low';
    } else if (extras.partitionHigh !== undefined && index > extras.partitionHigh) {
      state = 'partition-high';
    } else if (extras.partitionMid !== undefined && index === extras.partitionMid) {
      state = 'partition-mid';
    } else if (index === left && index === right) {
      state = 'comparing';
    } else if (index === left) {
      state = 'left';
    } else if (index === right) {
      state = 'right';
    } else if (extras.i === index) {
      state = 'i';
    } else {
      state = 'active';
    }
    return { value, index, state };
  });
}

export const sortColors: Algorithm = {
  id: 'sort-colors',
  name: 'Sort Colors (Dutch National Flag)',
  description: 'Given an array with values 0 (red), 1 (white), and 2 (blue), sort them in-place so same colors are adjacent.',
  pattern: 'Partition',
  visualizationType: 'partition',
  dataStructure: 'Array',

  generateSteps(input: AlgorithmInput): VisualizationStep[] {
    const { array } = input;
    const steps: VisualizationStep[] = [];
    let low = 0;
    let mid = 0;
    let high = array.length - 1;
    let comparisons = 0;

    steps.push({
      array: makeArrayState(array, -1, -1, { partitionLow: low, partitionMid: mid, partitionHigh: high }),
      left: -1, right: high, slow: mid, fast: -1, i: -1, target: 0,
      activeLine: 1,
      explanation: `Initialize low = 0, mid = 0, high = ${high}. low boundary for 0s, high boundary for 2s, mid scans the array.`,
      condition: 'low = 0, mid = 0, high = last',
      action: 'Begin partitioning',
      result: 'in-progress',
      comparisons: 0,
      variables: [
        { label: 'low', value: low, color: 'left' },
        { label: 'mid', value: mid, color: 'slow' },
        { label: 'high', value: high, color: 'right' },
      ],
    });

    while (mid <= high) {
      comparisons++;

      steps.push({
        array: makeArrayState(array, low, high, { partitionLow: low, partitionMid: mid, partitionHigh: high }),
        left: low, right: high, slow: mid, fast: -1, i: mid, target: 0,
        activeLine: 3,
        explanation: `Check nums[mid] = ${array[mid]}. ${array[mid] === 0 ? 'It is 0 (red) — swap with low.' : array[mid] === 1 ? 'It is 1 (white) — already in place, move mid.' : 'It is 2 (blue) — swap with high.'}`,
        condition: `nums[mid] = ${array[mid]}`,
        action: array[mid] === 0 ? 'Swap with low, move both' : array[mid] === 1 ? 'Move mid forward' : 'Swap with high, move high back',
        result: 'in-progress',
        comparisons,
        variables: [
          { label: 'low', value: low, color: 'left' },
          { label: 'mid', value: mid, color: 'slow' },
          { label: 'high', value: high, color: 'right' },
          { label: 'nums[mid]', value: array[mid] },
        ],
      });

      if (array[mid] === 0) {
        const tmp = array[low];
        array[low] = array[mid];
        array[mid] = tmp;
        steps.push({
          array: makeArrayState(array, low, high, { partitionLow: low, partitionMid: mid, partitionHigh: high }),
          left: low, right: high, slow: mid, fast: -1, i: mid, target: 0,
          activeLine: 4,
          explanation: `nums[mid] = 0. Swap nums[low] and nums[mid]. Move ${array[low]} to the 0s region. Increment both low and mid.`,
          condition: `nums[mid] == 0`,
          action: `Swap nums[low] and nums[mid], low++, mid++`,
          result: 'in-progress',
          comparisons,
          swapped: [low, mid],
          variables: [
            { label: 'low', value: low + 1, color: 'left' },
            { label: 'mid', value: mid + 1, color: 'slow' },
            { label: 'high', value: high, color: 'right' },
          ],
        });
        low++;
        mid++;
      } else if (array[mid] === 1) {
        steps.push({
          array: makeArrayState(array, low, high, { partitionLow: low, partitionMid: mid, partitionHigh: high }),
          left: low, right: high, slow: mid, fast: -1, i: mid, target: 0,
          activeLine: 6,
          explanation: `nums[mid] = 1. It is already in the correct region. Just move mid forward.`,
          condition: `nums[mid] == 1`,
          action: 'mid++',
          result: 'in-progress',
          comparisons,
          variables: [
            { label: 'low', value: low, color: 'left' },
            { label: 'mid', value: mid + 1, color: 'slow' },
            { label: 'high', value: high, color: 'right' },
          ],
        });
        mid++;
      } else {
        const tmp = array[high];
        array[high] = array[mid];
        array[mid] = tmp;
        steps.push({
          array: makeArrayState(array, low, high, { partitionLow: low, partitionMid: mid, partitionHigh: high }),
          left: low, right: high, slow: mid, fast: -1, i: mid, target: 0,
          activeLine: 8,
          explanation: `nums[mid] = 2. Swap nums[mid] and nums[high]. Move ${array[high]} to the 2s region. Decrement high. Do NOT increment mid — the swapped element needs checking.`,
          condition: `nums[mid] == 2`,
          action: `Swap nums[mid] and nums[high], high--`,
          result: 'in-progress',
          comparisons,
          swapped: [mid, high],
          variables: [
            { label: 'low', value: low, color: 'left' },
            { label: 'mid', value: mid, color: 'slow' },
            { label: 'high', value: high - 1, color: 'right' },
          ],
        });
        high--;
      }
    }

    steps.push({
      array: makeArrayState(array, -1, -1, { partitionLow: low, partitionMid: mid, partitionHigh: high, found: array.map((_, i) => i) }),
      left: -1, right: -1, slow: -1, fast: -1, i: -1, target: 0,
      activeLine: 11,
      explanation: `Partitioning complete. Array sorted: [${array.join(', ')}]. All 0s, then all 1s, then all 2s.`,
      condition: 'mid > high',
      action: 'Done',
      result: 'success',
      comparisons,
      resultValue: `[${array.join(', ')}]`,
    });
    return steps;
  },

  getComplexity(): Complexity {
    return {
      time: 'O(n)',
      space: 'O(1)',
      description: 'Each element is visited at most once by mid. The three-way partition uses constant space.',
    };
  },

  getCode(language: Language): string[] {
    const codes: Record<Language, string[]> = {
      c: [
        '// Sort Colors (Dutch National Flag)',
        'void sortColors(int* nums, int numsSize) {',
        '    int low = 0, mid = 0, high = numsSize - 1;',
        '    while (mid <= high) {',
        '        if (nums[mid] == 0) {',
        '            swap(&nums[low], &nums[mid]);',
        '            low++; mid++;',
        '        } else if (nums[mid] == 1) {',
        '            mid++;',
        '        } else {',
        '            swap(&nums[mid], &nums[high]);',
        '            high--;',
        '        }',
        '    }',
        '}',
      ],
      cpp: [
        '// Sort Colors (Dutch National Flag)',
        'void sortColors(vector<int>& nums) {',
        '    int low = 0, mid = 0, high = nums.size() - 1;',
        '    while (mid <= high) {',
        '        if (nums[mid] == 0) {',
        '            swap(nums[low], nums[mid]);',
        '            low++; mid++;',
        '        } else if (nums[mid] == 1) {',
        '            mid++;',
        '        } else {',
        '            swap(nums[mid], nums[high]);',
        '            high--;',
        '        }',
        '    }',
        '}',
      ],
      java: [
        '// Sort Colors (Dutch National Flag)',
        'public void sortColors(int[] nums) {',
        '    int low = 0, mid = 0, high = nums.length - 1;',
        '    while (mid <= high) {',
        '        if (nums[mid] == 0) {',
        '            int tmp = nums[low]; nums[low] = nums[mid]; nums[mid] = tmp;',
        '            low++; mid++;',
        '        } else if (nums[mid] == 1) {',
        '            mid++;',
        '        } else {',
        '            int tmp = nums[mid]; nums[mid] = nums[high]; nums[high] = tmp;',
        '            high--;',
        '        }',
        '    }',
        '}',
      ],
    };
    return codes[language];
  },

  getDefaultInput(): AlgorithmInput {
    return { array: [2, 0, 2, 1, 1, 0], target: 0 };
  },

  validateInput(input: AlgorithmInput): string | null {
    if (!input.array || input.array.length === 0) return 'Array cannot be empty.';
    if (input.array.length > 50) return 'Array too large for visualization (max 50 elements).';
    if (input.array.some((v) => v !== 0 && v !== 1 && v !== 2)) return 'Array must contain only 0s, 1s, and 2s.';
    return null;
  },

  getWhyItWorks(): string {
    return 'The array is divided into three regions: 0s (before low), 1s (low to mid), unknown (mid to high), and 2s (after high). Mid scans the unknown region. When it finds 0, it swaps to the low boundary; when it finds 2, it swaps to the high boundary; when it finds 1, it just advances.';
  },

  getCommonMistakes(): string[] {
    return [
      'Incrementing mid after swapping with high — the swapped element is unknown and needs checking.',
      'Using < instead of <= in the while condition (mid <= high).',
      'Forgetting that the three regions must be maintained as invariants at every step.',
    ];
  },
};
