import type { Algorithm, AlgorithmInput, VisualizationStep, ArrayElementState, ListNodeState, Complexity, Language } from '@/types';

/**
 * Middle of the Linked List (LeetCode 876)
 *
 * Fast & Slow pointer pattern: `slow` advances one node per step while `fast`
 * advances two. When `fast` reaches the end (null), `slow` sits on the middle
 * node. For an even-length list this returns the second middle, matching the
 * LeetCode specification.
 */

function makeListState(
  list: number[],
  slow: number,
  fast: number,
  foundIndex: number = -1
): ListNodeState[] {
  return list.map((value, index) => {
    let state: ListNodeState['state'] = 'default';
    if (index === foundIndex) {
      state = 'found';
    } else if (index === slow && index === fast) {
      state = 'comparing';
    } else if (index === slow) {
      state = 'slow';
    } else if (index === fast) {
      state = 'fast';
    }
    return {
      value,
      index,
      state,
      hasNext: index < list.length - 1,
      hasCycle: false,
    };
  });
}

function makeListStateWithFound(
  list: number[],
  foundIndex: number
): ListNodeState[] {
  return list.map((value, index) => ({
    value,
    index,
    state: index === foundIndex ? 'found' : 'default',
    hasNext: index < list.length - 1,
    hasCycle: false,
  }));
}

export const middleOfLinkedList: Algorithm = {
  id: 'middle-of-linked-list',
  name: 'Middle of the Linked List',
  description:
    'Given the head of a singly linked list, return the middle node. If there are two middle nodes, return the second middle node.',
  pattern: 'Linked List',
  visualizationType: 'linked-list',
  dataStructure: 'Linked List',

  generateSteps(input: AlgorithmInput): VisualizationStep[] {
    const list = input.list ?? [];
    const steps: VisualizationStep[] = [];
    const emptyArray: ArrayElementState[] = [];

    // Edge case: empty list
    if (list.length === 0) {
      steps.push({
        array: emptyArray,
        listNodes: [],
        left: -1, right: -1, slow: -1, fast: -1, i: -1, target: -1,
        activeLine: 1,
        explanation: 'The linked list is empty. There is no middle node to return.',
        condition: 'head == null',
        action: 'Return null',
        result: 'not-found',
        comparisons: 0,
        variables: [
          { label: 'head', value: 'null' },
          { label: 'slow', value: 'null' },
          { label: 'fast', value: 'null' },
        ],
        resultValue: 'null',
      });
      return steps;
    }

    // Edge case: single node
    if (list.length === 1) {
      steps.push({
        array: emptyArray,
        listNodes: makeListStateWithFound(list, 0),
        left: -1, right: -1, slow: 0, fast: 0, i: -1, target: -1,
        activeLine: 2,
        explanation:
          'The list has only one node. Both slow and fast start here, and it is the middle.',
        condition: 'head != null',
        action: 'Initialize slow = fast = head',
        result: 'found',
        comparisons: 0,
        variables: [
          { label: 'slow', value: `node(${list[0]})`, color: 'slow' },
          { label: 'fast', value: `node(${list[0]})`, color: 'fast' },
        ],
        resultValue: `node(${list[0]}) at index 0`,
      });
      return steps;
    }

    let slow = 0;
    let fast = 0;
    let comparisons = 0;

    // Step: initialization
    steps.push({
      array: emptyArray,
      listNodes: makeListState(list, slow, fast),
      left: -1, right: -1, slow, fast, i: -1, target: -1,
      activeLine: 2,
      explanation:
        'Initialize two pointers at the head: slow moves 1 step at a time, fast moves 2 steps at a time.',
      condition: 'slow = head, fast = head',
      action: 'Initialize slow = fast = head',
      result: 'in-progress',
      comparisons: 0,
      variables: [
        { label: 'slow', value: `node(${list[slow]}) @ ${slow}`, color: 'slow' },
        { label: 'fast', value: `node(${list[fast]}) @ ${fast}`, color: 'fast' },
      ],
    });

    // Main loop: advance fast by 2, slow by 1, until fast hits the end.
    while (fast < list.length) {
      comparisons++;

      // Check whether fast can take its first hop (fast.next exists).
      const fastNext = fast + 1;
      const canFastAdvance = fastNext < list.length;

      steps.push({
        array: emptyArray,
        listNodes: makeListState(list, slow, fast),
        left: -1, right: -1, slow, fast, i: -1, target: -1,
        activeLine: 3,
        explanation: canFastAdvance
          ? `Check: fast (index ${fast}) is not null. fast.next (index ${fastNext}) exists, so fast can advance two steps.`
          : `Check: fast (index ${fast}) is not null, but fast.next (index ${fastNext}) is null. fast cannot complete a two-step move.`,
        condition: canFastAdvance
          ? `fast != null && fast.next != null`
          : `fast != null && fast.next == null`,
        action: canFastAdvance ? 'Advance fast by 2, slow by 1' : 'Stop — fast cannot advance',
        result: 'in-progress',
        comparisons,
        variables: [
          { label: 'slow', value: `node(${list[slow]}) @ ${slow}`, color: 'slow' },
          { label: 'fast', value: `node(${list[fast]}) @ ${fast}`, color: 'fast' },
          { label: 'fast.next', value: canFastAdvance ? `node(${list[fastNext]}) @ ${fastNext}` : 'null' },
        ],
      });

      if (!canFastAdvance) {
        // fast is on the last node (odd-length list). slow is already at the middle.
        break;
      }

      // Move slow one step, fast two steps.
      slow += 1;
      fast += 2;
      const fastInBounds = fast < list.length;

      steps.push({
        array: emptyArray,
        listNodes: makeListState(list, slow, fastInBounds ? fast : -1),
        left: -1, right: -1, slow, fast: fastInBounds ? fast : -1, i: -1, target: -1,
        activeLine: 4,
        explanation: fastInBounds
          ? `Move: slow advances 1 step to index ${slow} (value ${list[slow]}). fast advances 2 steps to index ${fast} (value ${list[fast]}).`
          : `Move: slow advances 1 step to index ${slow} (value ${list[slow]}). fast advances 2 steps and reaches null (end of list).`,
        condition: 'slow = slow.next; fast = fast.next.next',
        action: 'Advance slow by 1, fast by 2',
        result: 'in-progress',
        comparisons,
        variables: [
          { label: 'slow', value: `node(${list[slow]}) @ ${slow}`, color: 'slow' },
          { label: 'fast', value: fastInBounds ? `node(${list[fast]}) @ ${fast}` : 'null', color: 'fast' },
        ],
      });

      // If fast fell off the end, the loop condition (fast != null) will fail
      // on the next iteration; we still want to surface that check explicitly.
      if (!fastInBounds) {
        comparisons++;
        steps.push({
          array: emptyArray,
          listNodes: makeListState(list, slow, -1),
          left: -1, right: -1, slow, fast: -1, i: -1, target: -1,
          activeLine: 3,
          explanation:
            `Check: fast is now null (end of list). The loop condition fails — slow is positioned at the middle node.`,
          condition: 'fast == null',
          action: 'Exit loop',
          result: 'in-progress',
          comparisons,
          variables: [
            { label: 'slow', value: `node(${list[slow]}) @ ${slow}`, color: 'slow' },
            { label: 'fast', value: 'null', color: 'fast' },
          ],
        });
        break;
      }
    }

    // Final step: slow is at the middle. Highlight it.
    const isEven = list.length % 2 === 0;
    steps.push({
      array: emptyArray,
      listNodes: makeListStateWithFound(list, slow),
      left: -1, right: -1, slow, fast: -1, i: -1, target: -1,
      activeLine: 6,
      explanation: isEven
        ? `Done. The list has an even length (${list.length}), so the second middle node is at index ${slow} (value ${list[slow]}). Return slow.`
        : `Done. The list has an odd length (${list.length}), so the single middle node is at index ${slow} (value ${list[slow]}). Return slow.`,
      condition: 'fast == null',
      action: 'Return slow (middle node)',
      result: 'found',
      comparisons,
      variables: [
        { label: 'slow', value: `node(${list[slow]}) @ ${slow}`, color: 'slow' },
        { label: 'fast', value: 'null', color: 'fast' },
        { label: 'middle', value: `node(${list[slow]}) @ ${slow}` },
      ],
      resultValue: `node(${list[slow]}) at index ${slow}`,
    });

    return steps;
  },

  getComplexity(): Complexity {
    return {
      time: 'O(n)',
      space: 'O(1)',
      description:
        'fast traverses the list once, advancing two nodes per step, so the loop runs ~n/2 times. Only two pointers are stored, regardless of list size.',
    };
  },

  getCode(language: Language): string[] {
    const codes: Record<Language, string[]> = {
      c: [
        '// Middle of the Linked List',
        'struct ListNode* middleNode(struct ListNode* head) {',
        '    if (head == NULL) return NULL;',
        '    struct ListNode *slow = head, *fast = head;',
        '    while (fast != NULL && fast->next != NULL) {',
        '        slow = slow->next;',
        '        fast = fast->next->next;',
        '    }',
        '    return slow;',
        '}',
      ],
      cpp: [
        '// Middle of the Linked List',
        'ListNode* middleNode(ListNode* head) {',
        '    if (head == nullptr) return nullptr;',
        '    ListNode *slow = head, *fast = head;',
        '    while (fast != nullptr && fast->next != nullptr) {',
        '        slow = slow->next;',
        '        fast = fast->next->next;',
        '    }',
        '    return slow;',
        '}',
      ],
      java: [
        '// Middle of the Linked List',
        'public ListNode middleNode(ListNode head) {',
        '    if (head == null) return null;',
        '    ListNode slow = head, fast = head;',
        '    while (fast != null && fast.next != null) {',
        '        slow = slow.next;',
        '        fast = fast.next.next;',
        '    }',
        '    return slow;',
        '}',
      ],
    };
    return codes[language];
  },

  getDefaultInput(): AlgorithmInput {
    return { array: [], target: -1, list: [1, 2, 3, 4, 5] };
  },

  validateInput(input: AlgorithmInput): string | null {
    const list = input.list;
    if (!list) return 'A linked list (input.list) is required.';
    if (list.length === 0) return 'The linked list must have at least 1 node.';
    if (list.length > 50) return 'List too large for visualization (max 50 nodes).';
    for (const value of list) {
      if (!Number.isFinite(value)) return 'All list values must be finite numbers.';
    }
    return null;
  },

  getWhyItWorks(): string {
    return 'Because fast moves twice as fast as slow, by the time fast reaches the end of the list slow has covered exactly half the distance — landing on the middle node. For an even number of nodes, fast falls off the end one step later, so slow ends on the second middle node, which is the required result.';
  },

  getCommonMistakes(): string[] {
    return [
      'Using `while (fast != null)` alone without also checking `fast.next != null`, which causes a null-pointer dereference when fast is on the last node.',
      'Advancing slow before fast (or vice versa) and reading stale pointer values — always read fast.next before moving anything.',
      'Returning the first middle node for even-length lists; the problem asks for the second middle node, which this loop naturally produces.',
      'Forgetting the empty-list guard, leading to a null dereference on `head`.',
      'Confusing this with cycle detection — here fast simply runs off the end instead of meeting slow again.',
    ];
  },
};
