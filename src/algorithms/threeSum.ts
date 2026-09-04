import type { Algorithm, AlgorithmInput, VisualizationStep, ArrayElementState, Complexity, Language } from '@/types';

function makeArrayState(
  array: number[],
  left: number,
  right: number,
  extras: { found?: number[]; eliminated?: Set<number>; slow?: number; fast?: number } = {}
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

export const threeSum: Algorithm = {
  id: 'three-sum',
  name: '3Sum',
  description: 'Given an array, find all unique triplets [nums[i], nums[j], nums[k]] such that i != j != k and nums[i] + nums[j] + nums[k] = 0.',
  pattern: 'Sorting + Two Pointers',
  visualizationType: 'sorting-pointers',
  dataStructure: 'Array',

  generateSteps(input: AlgorithmInput): VisualizationStep[] {
    const { array } = input;
    const sorted = [...array].sort((a, b) => a - b);
    const steps: VisualizationStep[] = [];
    let comparisons = 0;
    const results: number[][] = [];

    steps.push({
      array: makeArrayState(sorted, -1, -1),
      left: -1, right: -1, slow: -1, fast: -1, i: -1, target: 0,
      activeLine: 1,
      explanation: `Sort the array first: [${sorted.join(', ')}]. Sorting enables the two-pointer technique.`,
      condition: 'Sort array',
      action: 'Sort the array',
      result: 'in-progress',
      comparisons: 0,
      variables: [{ label: 'sorted', value: `[${sorted.join(', ')}]` }],
    });

    for (let i = 0; i < sorted.length - 2; i++) {
      if (i > 0 && sorted[i] === sorted[i - 1]) continue;
      let left = i + 1;
      let right = sorted.length - 1;

      steps.push({
        array: makeArrayState(sorted, left, right, { slow: i }),
        left, right, slow: i, fast: -1, i, target: 0,
        activeLine: 3,
        explanation: `Fix i = ${i} (value ${sorted[i]}). Set left = ${left}, right = ${right}. Search for two numbers that sum to ${-sorted[i]}.`,
        condition: `Fix nums[i] = ${sorted[i]}, find pair summing to ${-sorted[i]}`,
        action: 'Fix i, start two-pointer search',
        result: 'in-progress',
        comparisons,
        variables: [
          { label: 'i', value: i, color: 'i' },
          { label: 'left', value: left, color: 'left' },
          { label: 'right', value: right, color: 'right' },
          { label: 'nums[i]', value: sorted[i] },
          { label: 'target', value: -sorted[i] },
        ],
      });

      while (left < right) {
        const sum = sorted[i] + sorted[left] + sorted[right];
        comparisons++;

        steps.push({
          array: makeArrayState(sorted, left, right, { slow: i }),
          left, right, slow: i, fast: -1, i, target: -sorted[i],
          activeLine: 6,
          explanation: `Compare: nums[i] + nums[left] + nums[right] = ${sorted[i]} + ${sorted[left]} + ${sorted[right]} = ${sum}. Target = 0.`,
          condition: `sum = ${sum} vs target = 0`,
          action: 'Comparing...',
          result: 'in-progress',
          comparisons,
          variables: [
            { label: 'i', value: i, color: 'i' },
            { label: 'left', value: left, color: 'left' },
            { label: 'right', value: right, color: 'right' },
            { label: 'nums[i]', value: sorted[i] },
            { label: 'nums[left]', value: sorted[left] },
            { label: 'nums[right]', value: sorted[right] },
            { label: 'sum', value: sum },
          ],
        });

        if (sum === 0) {
          results.push([sorted[i], sorted[left], sorted[right]]);
          steps.push({
            array: makeArrayState(sorted, left, right, { slow: i, found: [i, left, right] }),
            left, right, slow: i, fast: -1, i, target: 0,
            activeLine: 7,
            explanation: `Found triplet: [${sorted[i]}, ${sorted[left]}, ${sorted[right]}]. Sum = 0. Record it and move both pointers.`,
            condition: `sum == 0`,
            action: 'Record triplet, move both pointers',
            result: 'found',
            comparisons,
            resultValue: `[${sorted[i]}, ${sorted[left]}, ${sorted[right]}]`,
            variables: [
              { label: 'i', value: i, color: 'i' },
              { label: 'left', value: left, color: 'left' },
              { label: 'right', value: right, color: 'right' },
              { label: 'sum', value: sum },
            ],
          });
          left++;
          right--;
          while (left < right && sorted[left] === sorted[left - 1]) left++;
          while (left < right && sorted[right] === sorted[right + 1]) right--;
        } else if (sum < 0) {
          steps.push({
            array: makeArrayState(sorted, left, right, { slow: i }),
            left, right, slow: i, fast: -1, i, target: -sorted[i],
            activeLine: 10,
            explanation: `sum (${sum}) < 0. Need a larger sum. Move left forward.`,
            condition: `sum < 0`,
            action: 'Move left forward (left++)',
            result: 'in-progress',
            comparisons,
            variables: [
              { label: 'i', value: i, color: 'i' },
              { label: 'left', value: left, color: 'left' },
              { label: 'right', value: right, color: 'right' },
              { label: 'sum', value: sum },
            ],
          });
          left++;
        } else {
          steps.push({
            array: makeArrayState(sorted, left, right, { slow: i }),
            left, right, slow: i, fast: -1, i, target: -sorted[i],
            activeLine: 12,
            explanation: `sum (${sum}) > 0. Need a smaller sum. Move right backward.`,
            condition: `sum > 0`,
            action: 'Move right backward (right--)',
            result: 'in-progress',
            comparisons,
            variables: [
              { label: 'i', value: i, color: 'i' },
              { label: 'left', value: left, color: 'left' },
              { label: 'right', value: right, color: 'right' },
              { label: 'sum', value: sum },
            ],
          });
          right--;
        }
      }
    }

    steps.push({
      array: makeArrayState(sorted, -1, -1),
      left: -1, right: -1, slow: -1, fast: -1, i: -1, target: 0,
      activeLine: 15,
      explanation: `Search complete. Found ${results.length} triplet(s): ${results.map((r) => `[${r.join(', ')}]`).join(', ') || 'none'}.`,
      condition: 'Done',
      action: 'Return all triplets',
      result: 'success',
      comparisons,
      resultValue: `${results.length} triplet(s)`,
    });
    return steps;
  },

  getComplexity(): Complexity {
    return {
      time: 'O(n^2)',
      space: 'O(1)',
      description: 'Sorting takes O(n log n). For each i, the two-pointer scan is O(n). Total: O(n^2). Space is constant (excluding output).',
    };
  },

  getCode(language: Language): string[] {
    const codes: Record<Language, string[]> = {
      c: [
        '// 3Sum',
        'int** threeSum(int* nums, int numsSize, int* returnSize) {',
        '    qsort(nums, numsSize, sizeof(int), cmp);',
        '    for (int i = 0; i < numsSize - 2; i++) {',
        '        if (i > 0 && nums[i] == nums[i-1]) continue;',
        '        int left = i + 1, right = numsSize - 1;',
        '        while (left < right) {',
        '            int sum = nums[i] + nums[left] + nums[right];',
        '            if (sum == 0) {',
        '                // record triplet',
        '                left++; right--;',
        '                while (left < right && nums[left] == nums[left-1]) left++;',
        '                while (left < right && nums[right] == nums[right+1]) right--;',
        '            } else if (sum < 0) left++;',
        '            else right--;',
        '        }',
        '    }',
        '    return result;',
        '}',
      ],
      cpp: [
        '// 3Sum',
        'vector<vector<int>> threeSum(vector<int>& nums) {',
        '    sort(nums.begin(), nums.end());',
        '    vector<vector<int>> result;',
        '    for (int i = 0; i < nums.size() - 2; i++) {',
        '        if (i > 0 && nums[i] == nums[i-1]) continue;',
        '        int left = i + 1, right = nums.size() - 1;',
        '        while (left < right) {',
        '            int sum = nums[i] + nums[left] + nums[right];',
        '            if (sum == 0) {',
        '                result.push_back({nums[i], nums[left], nums[right]});',
        '                left++; right--;',
        '                while (left < right && nums[left] == nums[left-1]) left++;',
        '                while (left < right && nums[right] == nums[right+1]) right--;',
        '            } else if (sum < 0) left++;',
        '            else right--;',
        '        }',
        '    }',
        '    return result;',
        '}',
      ],
      java: [
        '// 3Sum',
        'public List<List<Integer>> threeSum(int[] nums) {',
        '    Arrays.sort(nums);',
        '    List<List<Integer>> result = new ArrayList<>();',
        '    for (int i = 0; i < nums.length - 2; i++) {',
        '        if (i > 0 && nums[i] == nums[i-1]) continue;',
        '        int left = i + 1, right = nums.length - 1;',
        '        while (left < right) {',
        '            int sum = nums[i] + nums[left] + nums[right];',
        '            if (sum == 0) {',
        '                result.add(Arrays.asList(nums[i], nums[left], nums[right]));',
        '                left++; right--;',
        '                while (left < right && nums[left] == nums[left-1]) left++;',
        '                while (left < right && nums[right] == nums[right+1]) right--;',
        '            } else if (sum < 0) left++;',
        '            else right--;',
        '        }',
        '    }',
        '    return result;',
        '}',
      ],
    };
    return codes[language];
  },

  getDefaultInput(): AlgorithmInput {
    return { array: [-1, 0, 1, 2, -1, -4], target: 0 };
  },

  validateInput(input: AlgorithmInput): string | null {
    if (!input.array || input.array.length < 3) return 'Array must have at least 3 elements.';
    if (input.array.length > 30) return 'Array too large for visualization (max 30 elements).';
    return null;
  },

  getWhyItWorks(): string {
    return 'Sorting lets us use two pointers for the inner loop. For each fixed i, we search left/right for a pair summing to -nums[i]. If the sum is too small, move left to increase it; if too large, move right to decrease it. Skipping duplicates avoids repeated triplets.';
  },

  getCommonMistakes(): string[] {
    return [
      'Forgetting to sort the array first — the two-pointer approach requires sorted input.',
      'Not skipping duplicate values for i, left, or right, leading to duplicate triplets.',
      'Using the wrong comparison direction — sum < 0 means move left, not right.',
      'Off-by-one in the outer loop — need i < nums.length - 2, not nums.length - 1.',
    ];
  },
};
