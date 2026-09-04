import type { Algorithm, AlgorithmInput, VisualizationStep, ArrayElementState, Complexity, Language } from '@/types';

function makeArrayState(
  array: number[],
  left: number,
  right: number,
  extras: { found?: number[]; eliminated?: Set<number>; maxArea?: { l: number; r: number } } = {}
): ArrayElementState[] {
  return array.map((value, index) => {
    let state: ArrayElementState['state'] = 'default';
    if (extras.found?.includes(index)) {
      state = 'found';
    } else if (extras.eliminated?.has(index)) {
      state = 'eliminated';
    } else if (extras.maxArea && (index === extras.maxArea.l || index === extras.maxArea.r)) {
      state = 'result';
    } else if (index === left && index === right) {
      state = 'comparing';
    } else if (index === left) {
      state = 'left';
    } else if (index === right) {
      state = 'right';
    } else if (left >= 0 && right >= 0 && index >= left && index <= right) {
      state = 'active';
    }
    return { value, index, state };
  });
}

export const containerWithMostWater: Algorithm = {
  id: 'container-with-most-water',
  name: 'Container With Most Water',
  description: 'Given n non-negative integers representing heights, find two lines that form a container holding the most water.',
  pattern: 'Opposite Direction',
  visualizationType: 'opposite-pointers',
  dataStructure: 'Array',

  generateSteps(input: AlgorithmInput): VisualizationStep[] {
    const { array } = input;
    const steps: VisualizationStep[] = [];
    let left = 0;
    let right = array.length - 1;
    let maxArea = 0;
    let maxLeft = 0;
    let maxRight = array.length - 1;
    let comparisons = 0;

    steps.push({
      array: makeArrayState(array, left, right),
      left, right, slow: -1, fast: -1, i: -1, target: 0,
      activeLine: 1,
      explanation: `Initialize left = 0, right = ${right}. Start with the widest container.`,
      condition: 'left < right',
      action: 'Begin search',
      result: 'in-progress',
      comparisons: 0,
      variables: [
        { label: 'left', value: left, color: 'left' },
        { label: 'right', value: right, color: 'right' },
        { label: 'maxArea', value: 0 },
      ],
    });

    while (left < right) {
      const hLeft = array[left];
      const hRight = array[right];
      const height = Math.min(hLeft, hRight);
      const width = right - left;
      const area = height * width;
      comparisons++;

      steps.push({
        array: makeArrayState(array, left, right),
        left, right, slow: -1, fast: -1, i: -1, target: 0,
        activeLine: 3,
        explanation: `Height = min(${hLeft}, ${hRight}) = ${height}. Width = ${right} - ${left} = ${width}. Area = ${height} * ${width} = ${area}.`,
        condition: `area = min(${hLeft}, ${hRight}) * (${right} - ${left}) = ${area}`,
        action: 'Calculate area',
        result: 'in-progress',
        comparisons,
        variables: [
          { label: 'left', value: left, color: 'left' },
          { label: 'right', value: right, color: 'right' },
          { label: 'height', value: height },
          { label: 'width', value: width },
          { label: 'area', value: area },
          { label: 'maxArea', value: Math.max(maxArea, area) },
        ],
      });

      if (area > maxArea) {
        maxArea = area;
        maxLeft = left;
        maxRight = right;
        steps.push({
          array: makeArrayState(array, left, right, { maxArea: { l: left, r: right } }),
          left, right, slow: -1, fast: -1, i: -1, target: 0,
          activeLine: 4,
          explanation: `New maximum area found: ${area}. This is the best container so far.`,
          condition: `area > maxArea`,
          action: 'Update maxArea',
          result: 'in-progress',
          comparisons,
          resultValue: `${maxArea}`,
          variables: [
            { label: 'left', value: left, color: 'left' },
            { label: 'right', value: right, color: 'right' },
            { label: 'area', value: area },
            { label: 'maxArea', value: maxArea },
          ],
        });
      }

      if (hLeft < hRight) {
        steps.push({
          array: makeArrayState(array, left, right),
          left, right, slow: -1, fast: -1, i: -1, target: 0,
          activeLine: 7,
          explanation: `Left height (${hLeft}) < right height (${hRight}). Moving right cannot increase the limiting height. Move left.`,
          condition: `height[left] < height[right]`,
          action: 'Move left forward (left++)',
          result: 'in-progress',
          comparisons,
          variables: [
            { label: 'left', value: left, color: 'left' },
            { label: 'right', value: right, color: 'right' },
            { label: 'maxArea', value: maxArea },
          ],
        });
        left++;
      } else {
        steps.push({
          array: makeArrayState(array, left, right),
          left, right, slow: -1, fast: -1, i: -1, target: 0,
          activeLine: 9,
          explanation: `Right height (${hRight}) <= left height (${hLeft}). Moving left cannot increase the limiting height. Move right.`,
          condition: `height[right] <= height[left]`,
          action: 'Move right backward (right--)',
          result: 'in-progress',
          comparisons,
          variables: [
            { label: 'left', value: left, color: 'left' },
            { label: 'right', value: right, color: 'right' },
            { label: 'maxArea', value: maxArea },
          ],
        });
        right--;
      }
    }

    steps.push({
      array: makeArrayState(array, -1, -1, { maxArea: { l: maxLeft, r: maxRight } }),
      left: -1, right: -1, slow: -1, fast: -1, i: -1, target: 0,
      activeLine: 11,
      explanation: `Search complete. Maximum water container area = ${maxArea}, using lines at indices ${maxLeft} and ${maxRight}.`,
      condition: 'left >= right',
      action: 'Return maxArea',
      result: 'success',
      comparisons,
      resultValue: `${maxArea}`,
      variables: [
        { label: 'maxArea', value: maxArea },
      ],
    });
    return steps;
  },

  getComplexity(): Complexity {
    return {
      time: 'O(n)',
      space: 'O(1)',
      description: 'Each comparison moves left or right by one, so at most n iterations. Only constant extra space is used.',
    };
  },

  getCode(language: Language): string[] {
    const codes: Record<Language, string[]> = {
      c: [
        '// Container With Most Water',
        'int maxArea(int* height, int heightSize) {',
        '    int left = 0, right = heightSize - 1;',
        '    int maxArea = 0;',
        '    while (left < right) {',
        '        int h = fmin(height[left], height[right]);',
        '        int w = right - left;',
        '        int area = h * w;',
        '        if (area > maxArea) maxArea = area;',
        '        if (height[left] < height[right])',
        '            left++;',
        '        else',
        '            right--;',
        '    }',
        '    return maxArea;',
        '}',
      ],
      cpp: [
        '// Container With Most Water',
        'int maxArea(vector<int>& height) {',
        '    int left = 0, right = height.size() - 1;',
        '    int maxArea = 0;',
        '    while (left < right) {',
        '        int h = min(height[left], height[right]);',
        '        int w = right - left;',
        '        int area = h * w;',
        '        if (area > maxArea) maxArea = area;',
        '        if (height[left] < height[right])',
        '            left++;',
        '        else',
        '            right--;',
        '    }',
        '    return maxArea;',
        '}',
      ],
      java: [
        '// Container With Most Water',
        'public int maxArea(int[] height) {',
        '    int left = 0, right = height.length - 1;',
        '    int maxArea = 0;',
        '    while (left < right) {',
        '        int h = Math.min(height[left], height[right]);',
        '        int w = right - left;',
        '        int area = h * w;',
        '        if (area > maxArea) maxArea = area;',
        '        if (height[left] < height[right])',
        '            left++;',
        '        else',
        '            right--;',
        '    }',
        '    return maxArea;',
        '}',
      ],
    };
    return codes[language];
  },

  getDefaultInput(): AlgorithmInput {
    return { array: [1, 8, 6, 2, 5, 4, 8, 3, 7], target: 0 };
  },

  validateInput(input: AlgorithmInput): string | null {
    if (!input.array || input.array.length < 2) return 'Array must have at least 2 elements.';
    if (input.array.length > 50) return 'Array too large for visualization (max 50 elements).';
    if (input.array.some((v) => v < 0)) return 'Heights must be non-negative.';
    return null;
  },

  getWhyItWorks(): string {
    return 'The area is limited by the shorter line. By starting with the widest container and always moving the shorter side inward, we never miss a potentially better container — moving the taller side cannot increase the limiting height.';
  },

  getCommonMistakes(): string[] {
    return [
      'Moving the taller pointer instead of the shorter one — this cannot increase the area.',
      'Forgetting that width also matters — area = min(h1, h2) * (right - left).',
      'Using a brute-force O(n^2) approach instead of the two-pointer O(n) approach.',
    ];
  },
};
