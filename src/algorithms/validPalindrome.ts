import type { Algorithm, AlgorithmInput, VisualizationStep, ArrayElementState, Complexity, Language } from '@/types';

function makeArrayState(
  array: number[],
  left: number,
  right: number,
  extras: { slow?: number; fast?: number; found?: number[]; eliminated?: Set<number> } = {}
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

export const validPalindrome: Algorithm = {
  id: 'valid-palindrome',
  name: 'Valid Palindrome',
  description: 'Given a string, determine if it is a palindrome, considering only alphanumeric characters and ignoring case.',
  pattern: 'String',
  visualizationType: 'string-pointers',
  dataStructure: 'String',

  generateSteps(input: AlgorithmInput): VisualizationStep[] {
    const raw = input.string || input.array.map(String).join('');
    const s = raw.toLowerCase().replace(/[^a-z0-9]/g, '');
    const steps: VisualizationStep[] = [];
    let left = 0;
    let right = s.length - 1;
    let comparisons = 0;

    const arr = s.split('').map((c) => c.charCodeAt(0));
    const makeStrState = (l: number, r: number, found: boolean): ArrayElementState[] => {
      return s.split('').map((char, index) => {
        let state: ArrayElementState['state'] = 'default';
        if (found) {
          state = 'found';
        } else if (index === l && index === r) {
          state = 'comparing';
        } else if (index === l) {
          state = 'left';
        } else if (index === r) {
          state = 'right';
        } else if (l >= 0 && r >= 0 && index < l) {
          state = 'eliminated';
        } else if (l >= 0 && r >= 0 && index > r) {
          state = 'eliminated';
        }
        return { value: char, index, state };
      });
    };

    steps.push({
      array: makeStrState(left, right, false),
      left, right, slow: -1, fast: -1, i: -1, target: 0,
      activeLine: 1,
      explanation: `After cleaning: "${s}". Initialize left = 0, right = ${right}. Compare characters from both ends.`,
      condition: 'left < right',
      action: 'Begin comparison',
      result: 'in-progress',
      comparisons: 0,
      variables: [
        { label: 'left', value: left, color: 'left' },
        { label: 'right', value: right, color: 'right' },
        { label: 's[left]', value: s[left] || '—' },
        { label: 's[right]', value: s[right] || '—' },
      ],
    });

    while (left < right) {
      comparisons++;
      const match = s[left] === s[right];

      steps.push({
        array: makeStrState(left, right, false),
        left, right, slow: -1, fast: -1, i: -1, target: 0,
        activeLine: 3,
        explanation: `Compare s[left] = '${s[left]}' with s[right] = '${s[right]}'. ${match ? 'They match!' : 'They do NOT match.'}`,
        condition: `s[left] ('${s[left]}') == s[right] ('${s[right]}')?`,
        action: match ? 'Characters match, move both pointers' : 'Not a palindrome',
        result: match ? 'in-progress' : 'not-found',
        comparisons,
        variables: [
          { label: 'left', value: left, color: 'left' },
          { label: 'right', value: right, color: 'right' },
          { label: 's[left]', value: s[left] },
          { label: 's[right]', value: s[right] },
        ],
      });

      if (!match) {
        steps.push({
          array: makeStrState(left, right, false),
          left, right, slow: -1, fast: -1, i: -1, target: 0,
          activeLine: 5,
          explanation: `'${s[left]}' != '${s[right]}'. The string is not a palindrome.`,
          condition: `s[left] != s[right]`,
          action: 'Return false',
          result: 'not-found',
          comparisons,
        });
        return steps;
      }

      steps.push({
        array: makeStrState(left, right, false),
        left, right, slow: -1, fast: -1, i: -1, target: 0,
        activeLine: 6,
        explanation: `Characters match. Move left forward and right backward.`,
        condition: `s[left] == s[right]`,
        action: 'left++, right--',
        result: 'in-progress',
        comparisons,
        variables: [
          { label: 'left', value: left + 1, color: 'left' },
          { label: 'right', value: right - 1, color: 'right' },
        ],
      });
      left++;
      right--;
    }

    steps.push({
      array: makeStrState(-1, -1, true),
      left, right, slow: -1, fast: -1, i: -1, target: 0,
      activeLine: 8,
      explanation: `All characters matched. The string is a valid palindrome.`,
      condition: 'left >= right',
      action: 'Return true',
      result: 'found',
      comparisons,
      resultValue: 'true',
    });
    return steps;
  },

  getComplexity(): Complexity {
    return {
      time: 'O(n)',
      space: 'O(1)',
      description: 'Each character is compared at most once. Only two pointers are used, so space is constant.',
    };
  },

  getCode(language: Language): string[] {
    const codes: Record<Language, string[]> = {
      c: [
        '// Valid Palindrome',
        'bool isPalindrome(char* s) {',
        '    int left = 0, right = strlen(s) - 1;',
        '    while (left < right) {',
        '        if (!isalnum(s[left])) { left++; continue; }',
        '        if (!isalnum(s[right])) { right--; continue; }',
        '        if (tolower(s[left]) != tolower(s[right]))',
        '            return false;',
        '        left++; right--;',
        '    }',
        '    return true;',
        '}',
      ],
      cpp: [
        '// Valid Palindrome',
        'bool isPalindrome(string s) {',
        '    int left = 0, right = s.size() - 1;',
        '    while (left < right) {',
        '        if (!isalnum(s[left])) { left++; continue; }',
        '        if (!isalnum(s[right])) { right--; continue; }',
        '        if (tolower(s[left]) != tolower(s[right]))',
        '            return false;',
        '        left++; right--;',
        '    }',
        '    return true;',
        '}',
      ],
      java: [
        '// Valid Palindrome',
        'public boolean isPalindrome(String s) {',
        '    int left = 0, right = s.length() - 1;',
        '    while (left < right) {',
        '        if (!Character.isLetterOrDigit(s.charAt(left))) { left++; continue; }',
        '        if (!Character.isLetterOrDigit(s.charAt(right))) { right--; continue; }',
        '        if (Character.toLowerCase(s.charAt(left)) != Character.toLowerCase(s.charAt(right)))',
        '            return false;',
        '        left++; right--;',
        '    }',
        '    return true;',
        '}',
      ],
    };
    return codes[language];
  },

  getDefaultInput(): AlgorithmInput {
    return { array: [], target: 0, string: 'A man, a plan, a canal: Panama' };
  },

  validateInput(input: AlgorithmInput): string | null {
    const s = input.string || input.array.map(String).join('');
    if (!s || s.length === 0) return 'String cannot be empty.';
    if (s.length > 100) return 'String too long for visualization (max 100 characters).';
    return null;
  },

  getWhyItWorks(): string {
    return 'A palindrome reads the same forward and backward. By comparing characters from both ends moving inward, we verify this property in a single pass. If any pair mismatches, the string is not a palindrome.';
  },

  getCommonMistakes(): string[] {
    return [
      'Not skipping non-alphanumeric characters before comparing.',
      'Not converting to the same case (upper vs lower).',
      'Using left <= right instead of left < right — the middle character does not need to match anything.',
    ];
  },
};
