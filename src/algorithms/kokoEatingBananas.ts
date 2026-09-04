import type { Algorithm, AlgorithmInput, VisualizationStep, ArrayElementState, Complexity, Language } from '@/types';

interface KokoInput extends AlgorithmInput {
  extra?: { h?: number };
}

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

function canFinish(piles: number[], k: number, h: number): boolean {
  let hours = 0;
  for (const pile of piles) {
    hours += Math.ceil(pile / k);
  }
  return hours <= h;
}

export const kokoEatingBananas: Algorithm = {
  id: 'koko-eating-bananas',
  name: 'Koko Eating Bananas',
  description: 'Koko loves to eat bananas. There are n piles of bananas. Koko can eat k bananas per hour. Find the minimum integer k such that all bananas can be eaten within h hours.',
  pattern: 'Binary Search on Answer',
  visualizationType: 'binary-search-on-answer',

  generateSteps(input: AlgorithmInput): VisualizationStep[] {
    const piles = input.array;
    const h = (input as KokoInput).extra?.h ?? 6;
    const steps: VisualizationStep[] = [];
    let low = 1;
    let high = Math.max(...piles);
    let comparisons = 0;
    const eliminated = new Set<number>();

    steps.push({
      array: makeArrayState(piles, low, high, -1, -1, eliminated),
      low, mid: -1, high, target: h,
      activeLine: 0,
      explanation: `Binary Search on Answer: Search for minimum eating speed k. low = 1 (min speed), high = ${high} (max pile size). Hours available: ${h}.`,
      condition: 'low <= high',
      action: 'Begin search on answer range',
      result: 'in-progress',
      comparisons: 0,
    });

    while (low <= high) {
      const mid = Math.floor(low + (high - low) / 2);
      comparisons++;

      steps.push({
        array: makeArrayState(piles, low, high, mid, -1, eliminated),
        low, mid, high, target: h,
        activeLine: 2,
        explanation: `Try speed k = ${mid}. Can Koko finish all piles in ${h} hours at this speed?`,
        condition: `k = ${mid}`,
        action: 'Calculate mid speed',
        result: 'in-progress',
        comparisons,
      });

      const feasible = canFinish(piles, mid, h);
      const hours = piles.reduce((sum, p) => sum + Math.ceil(p / mid), 0);

      steps.push({
        array: makeArrayState(piles, low, high, mid, -1, eliminated),
        low, mid, high, target: h,
        activeLine: 3,
        explanation: `At speed ${mid}, Koko needs ${hours} hours. ${feasible ? `Since ${hours} <= ${h}, this speed works! Try a smaller speed.` : `Since ${hours} > ${h}, Koko cannot finish in time. Need a faster speed.`}`,
        condition: `canFinish(k=${mid}) = ${feasible}`,
        action: feasible ? 'Feasible - try smaller' : 'Too slow - try faster',
        result: 'in-progress',
        comparisons,
      });

      if (feasible) {
        steps.push({
          array: makeArrayState(piles, low, high, mid, -1, eliminated),
          low, mid, high, target: h,
          activeLine: 4,
          explanation: `Speed ${mid} works. Save this as a candidate and search for a smaller valid speed: high = mid - 1 = ${mid - 1}.`,
          condition: `feasible → high = mid - 1`,
          action: `high = mid - 1 = ${mid - 1}`,
          result: 'in-progress',
          comparisons,
        });
        for (let i = mid; i <= high; i++) eliminated.add(i);
        high = mid - 1;
      } else {
        steps.push({
          array: makeArrayState(piles, low, high, mid, -1, eliminated),
          low, mid, high, target: h,
          activeLine: 5,
          explanation: `Speed ${mid} is too slow. Need a faster speed: low = mid + 1 = ${mid + 1}.`,
          condition: `not feasible → low = mid + 1`,
          action: `low = mid + 1 = ${mid + 1}`,
          result: 'in-progress',
          comparisons,
        });
        for (let i = low; i <= mid; i++) eliminated.add(i);
        low = mid + 1;
      }
    }

    steps.push({
      array: makeArrayState(piles, 0, Math.max(...piles), -1, low, eliminated),
      low, mid: -1, high, target: h,
      activeLine: 6,
      explanation: `Search complete. The minimum eating speed is ${low} bananas per hour. Koko can finish all piles within ${h} hours at this speed.`,
      condition: 'low > high',
      action: `Return ${low}`,
      result: 'found',
      comparisons,
    });

    return steps;
  },

  getComplexity(): Complexity {
    return {
      time: 'O(n * log m)',
      space: 'O(1)',
      description: 'n = number of piles, m = max pile size. Binary search runs O(log m) iterations, each checking feasibility in O(n) time.',
    };
  },

  getCode(language: Language): string[] {
    const codes: Record<Language, string[]> = {
      c: [
        '// Koko Eating Bananas',
        'int minEatingSpeed(int* piles, int pilesSize, int h) {',
        '    int low = 1, high = 0;',
        '    for (int i = 0; i < pilesSize; i++)',
        '        if (piles[i] > high) high = piles[i];',
        '    while (low <= high) {',
        '        int mid = low + (high - low) / 2;',
        '        long hours = 0;',
        '        for (int i = 0; i < pilesSize; i++)',
        '            hours += (piles[i] + mid - 1) / mid;',
        '        if (hours <= h)',
        '            high = mid - 1;',
        '        else',
        '            low = mid + 1;',
        '    }',
        '    return low;',
        '}',
      ],
      cpp: [
        '// Koko Eating Bananas',
        'int minEatingSpeed(vector<int>& piles, int h) {',
        '    int low = 1, high = *max_element(piles.begin(), piles.end());',
        '    while (low <= high) {',
        '        int mid = low + (high - low) / 2;',
        '        long hours = 0;',
        '        for (int p : piles)',
        '            hours += (p + mid - 1) / mid;',
        '        if (hours <= h)',
        '            high = mid - 1;',
        '        else',
        '            low = mid + 1;',
        '    }',
        '    return low;',
        '}',
      ],
      java: [
        '// Koko Eating Bananas',
        'public int minEatingSpeed(int[] piles, int h) {',
        '    int low = 1, high = 0;',
        '    for (int p : piles) high = Math.max(high, p);',
        '    while (low <= high) {',
        '        int mid = low + (high - low) / 2;',
        '        long hours = 0;',
        '        for (int p : piles)',
        '            hours += (p + mid - 1) / mid;',
        '        if (hours <= h)',
        '            high = mid - 1;',
        '        else',
        '            low = mid + 1;',
        '    }',
        '    return low;',
        '}',
      ],
    };
    return codes[language];
  },

  getDefaultInput(): AlgorithmInput {
    return { array: [3, 6, 7, 11], target: 8, extra: { h: 8 } };
  },

  validateInput(input: AlgorithmInput): string | null {
    if (!input.array || input.array.length === 0) return 'Piles array cannot be empty.';
    if (input.array.length > 100) return 'Too many piles for visualization (max 100).';
    const h = (input as KokoInput).extra?.h;
    if (!h || h < input.array.length) return 'Hours must be at least equal to the number of piles.';
    return null;
  },
};
