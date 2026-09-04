import type { Algorithm, AlgorithmInput, VisualizationStep, ArrayElementState, ListNodeState, Complexity, Language } from '@/types';

/**
 * Build the visual state of every node in the linked list.
 *
 * @param values     The node values in list order.
 * @param cycleIndex The index the tail connects back to (-1 = no cycle).
 * @param slow       Current slow (tortoise) index, or -1.
 * @param fast       Current fast (hare) index, or -1.
 * @param meetIndex  Index where slow & fast met (cycle confirmed), or -1.
 * @param found      Whether the algorithm has concluded a cycle exists.
 * @param noCycle    Whether the algorithm has concluded there is no cycle.
 */
function makeListNodes(
  values: number[],
  cycleIndex: number,
  slow: number,
  fast: number,
  meetIndex: number,
  found: boolean,
  noCycle: boolean
): ListNodeState[] {
  const lastIndex = values.length - 1;
  const hasCycle = cycleIndex >= 0 && cycleIndex < values.length;

  return values.map((value, index) => {
    let state: ListNodeState['state'] = 'default';

    if (found && meetIndex === index) {
      // The meeting point that confirmed the cycle.
      state = 'found';
    } else if (noCycle && index === lastIndex) {
      // The tail that fast fell off of.
      state = 'eliminated';
    } else if (index === slow && index === fast) {
      // Both pointers on the same node but not (yet) a confirmed meeting.
      state = 'active';
    } else if (index === slow) {
      state = 'slow';
    } else if (index === fast) {
      state = 'fast';
    } else {
      state = 'default';
    }

    const hasNext = index < lastIndex || hasCycle;

    return {
      value,
      index,
      state,
      hasNext,
      hasCycle: hasCycle && index === lastIndex,
      cycleTargetIndex: hasCycle && index === lastIndex ? cycleIndex : undefined,
    };
  });
}

export const linkedListCycle: Algorithm = {
  id: 'linked-list-cycle',
  name: 'Linked List Cycle',
  description:
    'Given head of a linked list, determine whether the list has a cycle. Use Floyd’s Tortoise and Hare algorithm: a slow pointer moves 1 step and a fast pointer moves 2 steps — if they ever meet, a cycle exists; if fast reaches the end, there is no cycle.',
  pattern: 'Linked List',
  visualizationType: 'linked-list',
  dataStructure: 'Linked List',

  generateSteps(input: AlgorithmInput): VisualizationStep[] {
    const values: number[] = input.list && input.list.length > 0 ? input.list : input.array;
    const cycleIndexRaw = input.extra?.cycleIndex;
    const cycleIndex =
      typeof cycleIndexRaw === 'number' && cycleIndexRaw >= -1 ? cycleIndexRaw : -1;

    const steps: VisualizationStep[] = [];
    let comparisons = 0;

    const hasCycle = cycleIndex >= 0 && cycleIndex < values.length;
    const lastIndex = values.length - 1;

    // fastIndex(i) returns the node index the hare lands on after its 2nd hop,
    // or -1 if it falls off the end of the list. With a cycle, the hare wraps
    // around using the tail -> cycleIndex link.
    const fastIndex = (i: number): number => {
      let next = i + 1;
      if (next > lastIndex) {
        // Stepped off the tail.
        return hasCycle ? cycleIndex : -1;
      }
      return next;
    };

    // slowIndex(i) returns the node index the tortoise lands on after its hop,
    // or -1 if it falls off (only possible without a cycle).
    const slowIndex = (i: number): number => {
      const next = i + 1;
      if (next > lastIndex) {
        return hasCycle ? cycleIndex : -1;
      }
      return next;
    };

    // ----- Step 0: initialization -----
    steps.push({
      array: [] as ArrayElementState[],
      listNodes: makeListNodes(values, cycleIndex, 0, 0, -1, false, false),
      left: -1,
      right: -1,
      slow: 0,
      fast: 0,
      i: -1,
      target: -1,
      activeLine: 1,
      explanation:
        'Initialize slow = head and fast = head. Both pointers start at the first node. The tortoise will move 1 step per turn; the hare will move 2.',
      condition: 'slow == fast == head',
      action: 'Initialize pointers',
      result: 'in-progress',
      comparisons: 0,
      variables: [
        { label: 'slow', value: 0, color: 'slow' },
        { label: 'fast', value: 0, color: 'fast' },
        { label: 'slow.val', value: values[0] },
        { label: 'fast.val', value: values[0] },
      ],
    });

    // Edge case: empty or single node with no cycle.
    if (values.length === 0) {
      steps.push({
        array: [] as ArrayElementState[],
        listNodes: [],
        left: -1,
        right: -1,
        slow: -1,
        fast: -1,
        i: -1,
        target: -1,
        activeLine: 2,
        explanation: 'The list is empty (head is null). There is no cycle.',
        condition: 'head == null',
        action: 'Return false',
        result: 'not-found',
        comparisons: 0,
        resultValue: 'false',
        variables: [],
      });
      return steps;
    }

    let slow = 0;
    let fast = 0;

    // ----- Main loop -----
    // Loop guard: cap iterations at a safe upper bound (n + a few) so a
    // no-cycle list always terminates and a cyclic list meets well within
    // n steps. We use 2 * values.length + 4 as a generous ceiling.
    const maxIterations = 2 * values.length + 4;
    let iteration = 0;

    while (iteration < maxIterations) {
      iteration++;

      // Check whether fast can advance (needs fast.next != null, then
      // fast.next.next != null).
      const firstHop = fastIndex(fast);
      comparisons++;
      steps.push({
        array: [] as ArrayElementState[],
        listNodes: makeListNodes(values, cycleIndex, slow, fast, -1, false, false),
        left: -1,
        right: -1,
        slow,
        fast,
        i: -1,
        target: -1,
        activeLine: 2,
        explanation:
          firstHop === -1
            ? `Check fast.next. fast is at node ${fast} (value ${values[fast]}), whose next is null. fast cannot advance — the list has no cycle.`
            : `Check fast.next. fast is at node ${fast} (value ${values[fast]}). fast.next is node ${firstHop} (value ${values[firstHop]}), so fast can take its first step.`,
        condition:
          firstHop === -1 ? 'fast.next == null' : 'fast.next != null',
        action:
          firstHop === -1 ? 'No cycle — return false' : 'fast takes first step',
        result: firstHop === -1 ? 'not-found' : 'in-progress',
        comparisons,
        variables: [
          { label: 'slow', value: slow, color: 'slow' },
          { label: 'fast', value: fast, color: 'fast' },
          { label: 'slow.val', value: values[slow] },
          { label: 'fast.val', value: values[fast] },
        ],
      });

      if (firstHop === -1) {
        // fast.next == null -> no cycle.
        steps.push({
          array: [] as ArrayElementState[],
          listNodes: makeListNodes(values, cycleIndex, slow, -1, -1, false, true),
          left: -1,
          right: -1,
          slow,
          fast: -1,
          i: -1,
          target: -1,
          activeLine: 3,
          explanation:
            'fast reached the end of the list (fast.next is null). Therefore there is no cycle. Return false.',
          condition: 'fast.next == null',
          action: 'Return false',
          result: 'not-found',
          comparisons,
          resultValue: 'false',
          variables: [
            { label: 'slow', value: slow, color: 'slow' },
            { label: 'fast', value: -1, color: 'fast' },
          ],
        });
        return steps;
      }

      // fast takes its first hop.
      fast = firstHop;
      steps.push({
        array: [] as ArrayElementState[],
        listNodes: makeListNodes(values, cycleIndex, slow, fast, -1, false, false),
        left: -1,
        right: -1,
        slow,
        fast,
        i: -1,
        target: -1,
        activeLine: 4,
        explanation: `fast takes its first step to node ${fast} (value ${values[fast]}). Now check fast.next before the second step.`,
        condition: 'fast = fast.next',
        action: 'fast takes first step',
        result: 'in-progress',
        comparisons,
        variables: [
          { label: 'slow', value: slow, color: 'slow' },
          { label: 'fast', value: fast, color: 'fast' },
          { label: 'slow.val', value: values[slow] },
          { label: 'fast.val', value: values[fast] },
        ],
      });

      const secondHop = fastIndex(fast);
      comparisons++;
      steps.push({
        array: [] as ArrayElementState[],
        listNodes: makeListNodes(values, cycleIndex, slow, fast, -1, false, false),
        left: -1,
        right: -1,
        slow,
        fast,
        i: -1,
        target: -1,
        activeLine: 5,
        explanation:
          secondHop === -1
            ? `Check fast.next again. fast is at node ${fast} (value ${values[fast]}), whose next is null. fast cannot take its second step — no cycle.`
            : `Check fast.next again. fast is at node ${fast} (value ${values[fast]}). fast.next is node ${secondHop} (value ${values[secondHop]}), so fast can take its second step.`,
        condition:
          secondHop === -1 ? 'fast.next == null' : 'fast.next != null',
        action:
          secondHop === -1 ? 'No cycle — return false' : 'fast takes second step',
        result: secondHop === -1 ? 'not-found' : 'in-progress',
        comparisons,
        variables: [
          { label: 'slow', value: slow, color: 'slow' },
          { label: 'fast', value: fast, color: 'fast' },
          { label: 'slow.val', value: values[slow] },
          { label: 'fast.val', value: values[fast] },
        ],
      });

      if (secondHop === -1) {
        steps.push({
          array: [] as ArrayElementState[],
          listNodes: makeListNodes(values, cycleIndex, slow, -1, -1, false, true),
          left: -1,
          right: -1,
          slow,
          fast: -1,
          i: -1,
          target: -1,
          activeLine: 6,
          explanation:
            'fast reached the end of the list on its second step. There is no cycle. Return false.',
          condition: 'fast.next == null',
          action: 'Return false',
          result: 'not-found',
          comparisons,
          resultValue: 'false',
          variables: [
            { label: 'slow', value: slow, color: 'slow' },
            { label: 'fast', value: -1, color: 'fast' },
          ],
        });
        return steps;
      }

      // fast takes its second hop.
      fast = secondHop;
      steps.push({
        array: [] as ArrayElementState[],
        listNodes: makeListNodes(values, cycleIndex, slow, fast, -1, false, false),
        left: -1,
        right: -1,
        slow,
        fast,
        i: -1,
        target: -1,
        activeLine: 7,
        explanation: `fast takes its second step to node ${fast} (value ${values[fast]}). Both pointers have now moved this turn.`,
        condition: 'fast = fast.next',
        action: 'fast takes second step',
        result: 'in-progress',
        comparisons,
        variables: [
          { label: 'slow', value: slow, color: 'slow' },
          { label: 'fast', value: fast, color: 'fast' },
          { label: 'slow.val', value: values[slow] },
          { label: 'fast.val', value: values[fast] },
        ],
      });

      // slow takes one step.
      const nextSlow = slowIndex(slow);
      comparisons++;
      steps.push({
        array: [] as ArrayElementState[],
        listNodes: makeListNodes(values, cycleIndex, slow, fast, -1, false, false),
        left: -1,
        right: -1,
        slow,
        fast,
        i: -1,
        target: -1,
        activeLine: 8,
        explanation:
          nextSlow === -1
            ? `Check slow.next. slow is at node ${slow} (value ${values[slow]}), whose next is null. slow cannot advance — no cycle.`
            : `slow takes one step to node ${nextSlow} (value ${values[nextSlow]}).`,
        condition:
          nextSlow === -1 ? 'slow.next == null' : 'slow = slow.next',
        action:
          nextSlow === -1 ? 'No cycle — return false' : 'slow takes one step',
        result: nextSlow === -1 ? 'not-found' : 'in-progress',
        comparisons,
        variables: [
          { label: 'slow', value: slow, color: 'slow' },
          { label: 'fast', value: fast, color: 'fast' },
          { label: 'slow.val', value: values[slow] },
          { label: 'fast.val', value: values[fast] },
        ],
      });

      if (nextSlow === -1) {
        steps.push({
          array: [] as ArrayElementState[],
          listNodes: makeListNodes(values, cycleIndex, -1, fast, -1, false, true),
          left: -1,
          right: -1,
          slow: -1,
          fast,
          i: -1,
          target: -1,
          activeLine: 9,
          explanation:
            'slow reached the end of the list. There is no cycle. Return false.',
          condition: 'slow.next == null',
          action: 'Return false',
          result: 'not-found',
          comparisons,
          resultValue: 'false',
          variables: [
            { label: 'slow', value: -1, color: 'slow' },
            { label: 'fast', value: fast, color: 'fast' },
          ],
        });
        return steps;
      }

      slow = nextSlow;

      // After both pointers have moved, check if they meet.
      comparisons++;
      steps.push({
        array: [] as ArrayElementState[],
        listNodes: makeListNodes(values, cycleIndex, slow, fast, -1, false, false),
        left: -1,
        right: -1,
        slow,
        fast,
        i: -1,
        target: -1,
        activeLine: 10,
        explanation:
          slow === fast
            ? `Check slow == fast. Both pointers are at node ${slow} (value ${values[slow]}). They have met — a cycle exists!`
            : `Check slow == fast. slow is at node ${slow} (value ${values[slow]}), fast is at node ${fast} (value ${values[fast]}). They have not met yet — continue.`,
        condition:
          slow === fast
            ? `slow (${slow}) == fast (${fast})`
            : `slow (${slow}) != fast (${fast})`,
        action: slow === fast ? 'Cycle detected — return true' : 'Continue loop',
        result: slow === fast ? 'found' : 'in-progress',
        comparisons,
        variables: [
          { label: 'slow', value: slow, color: 'slow' },
          { label: 'fast', value: fast, color: 'fast' },
          { label: 'slow.val', value: values[slow] },
          { label: 'fast.val', value: values[fast] },
        ],
      });

      if (slow === fast) {
        steps.push({
          array: [] as ArrayElementState[],
          listNodes: makeListNodes(values, cycleIndex, slow, fast, slow, true, false),
          left: -1,
          right: -1,
          slow,
          fast,
          i: -1,
          target: -1,
          activeLine: 11,
          explanation:
            'The tortoise and hare met at the same node. In an acyclic list the hare would always stay ahead and eventually fall off the end — the only way they can meet is if the hare lapped the tortoise inside a cycle. Return true.',
          condition: 'slow == fast',
          action: 'Return true',
          result: 'found',
          comparisons,
          resultValue: 'true',
          variables: [
            { label: 'slow', value: slow, color: 'slow' },
            { label: 'fast', value: fast, color: 'fast' },
            { label: 'meetNode', value: slow },
          ],
        });
        return steps;
      }
    }

    // Safety net: should not be reachable for well-formed inputs.
    steps.push({
      array: [] as ArrayElementState[],
      listNodes: makeListNodes(values, cycleIndex, slow, fast, -1, false, false),
      left: -1,
      right: -1,
      slow,
      fast,
      i: -1,
      target: -1,
      activeLine: 12,
      explanation:
        'Exceeded the iteration limit without the pointers meeting or fast falling off. Treating this as no cycle.',
      condition: 'iteration limit reached',
      action: 'Return false',
      result: 'not-found',
      comparisons,
      resultValue: 'false',
      variables: [
        { label: 'slow', value: slow, color: 'slow' },
        { label: 'fast', value: fast, color: 'fast' },
      ],
    });
    return steps;
  },

  getComplexity(): Complexity {
    return {
      time: 'O(n)',
      space: 'O(1)',
      description:
        'The hare moves twice as fast as the tortoise. If there is a cycle, the hare laps the tortoise within at most n steps (the gap closes by 1 each step inside the cycle). If there is no cycle, the hare falls off the end in at most n/2 iterations. Either way the work is linear in the list length, and only two pointers are stored.',
    };
  },

  getCode(language: Language): string[] {
    const codes: Record<Language, string[]> = {
      c: [
        '// Linked List Cycle - Floyd\'s Tortoise and Hare',
        'struct ListNode {',
        '    int val;',
        '    struct ListNode *next;',
        '};',
        '',
        'bool hasCycle(struct ListNode *head) {',
        '    struct ListNode *slow = head, *fast = head;',
        '    while (fast != NULL && fast->next != NULL) {',
        '        slow = slow->next;',
        '        fast = fast->next->next;',
        '        if (slow == fast) {',
        '            return true;',
        '        }',
        '    }',
        '    return false;',
        '}',
      ],
      cpp: [
        '// Linked List Cycle - Floyd\'s Tortoise and Hare',
        'struct ListNode {',
        '    int val;',
        '    ListNode *next;',
        '    ListNode(int x) : val(x), next(nullptr) {}',
        '};',
        '',
        'bool hasCycle(ListNode *head) {',
        '    ListNode *slow = head, *fast = head;',
        '    while (fast != nullptr && fast->next != nullptr) {',
        '        slow = slow->next;',
        '        fast = fast->next->next;',
        '        if (slow == fast) {',
        '            return true;',
        '        }',
        '    }',
        '    return false;',
        '}',
      ],
      java: [
        '// Linked List Cycle - Floyd\'s Tortoise and Hare',
        'class ListNode {',
        '    int val;',
        '    ListNode next;',
        '    ListNode(int x) { val = x; }',
        '}',
        '',
        'public boolean hasCycle(ListNode head) {',
        '    ListNode slow = head, fast = head;',
        '    while (fast != null && fast.next != null) {',
        '        slow = slow.next;',
        '        fast = fast.next.next;',
        '        if (slow == fast) {',
        '            return true;',
        '        }',
        '    }',
        '    return false;',
        '}',
      ],
    };
    return codes[language];
  },

  getDefaultInput(): AlgorithmInput {
    return {
      array: [],
      target: -1,
      list: [3, 2, 0, -4],
      extra: { cycleIndex: 1 },
    };
  },

  validateInput(input: AlgorithmInput): string | null {
    const values: number[] | undefined = input.list && input.list.length > 0 ? input.list : input.array;
    if (!values || values.length === 0) {
      return 'Linked list cannot be empty.';
    }
    if (values.length > 50) {
      return 'List too large for visualization (max 50 nodes).';
    }
    for (const v of values) {
      if (typeof v !== 'number' || Number.isNaN(v)) {
        return 'Every node value must be a valid number.';
      }
    }
    const cycleIndexRaw = input.extra?.cycleIndex;
    if (cycleIndexRaw !== undefined && cycleIndexRaw !== null) {
      if (typeof cycleIndexRaw !== 'number' || Number.isNaN(cycleIndexRaw)) {
        return 'cycleIndex must be a number (-1 for no cycle).';
      }
      if (cycleIndexRaw !== -1 && (cycleIndexRaw < 0 || cycleIndexRaw >= values.length)) {
        return `cycleIndex must be -1 (no cycle) or a valid node index between 0 and ${values.length - 1}.`;
      }
    }
    return null;
  },

  getWhyItWorks(): string {
    return 'The hare moves twice as fast as the tortoise. If the list has no cycle, the hare simply reaches the end first and we stop. If there is a cycle, neither pointer can ever exit — once both are inside the cycle, the hare gains one node on the tortoise every step, so the gap between them shrinks by 1 each turn. A shrinking-by-1 gap must eventually hit 0, meaning the hare catches the tortoise. Their meeting therefore is a necessary and sufficient condition for a cycle, and we never need to store visited nodes — hence O(1) space.';
  },

  getCommonMistakes(): string[] {
    return [
      'Starting fast one step ahead of slow — this can cause the pointers to never meet on some cycles, or to miss the head-of-list case.',
      'Checking slow == fast before fast has moved at least once, which falsely reports a cycle on the initial head==head state.',
      'Forgetting to check fast.next != null in addition to fast != null, leading to a null-pointer dereference on the second hop.',
      'Using a visited set for O(n) space — correct but not the two-pointer solution interviewers expect, and it misses the point of the pattern.',
      'Moving slow and fast the same number of steps — both must move every iteration, but fast must move exactly twice.',
    ];
  },

  getChallengeForStep(
    step: VisualizationStep,
    stepIndex: number,
    allSteps: VisualizationStep[]
  ): ChallengeQuestion | null {
    // Only attach a challenge at meaningful checkpoints.
    const isCheckFastNext =
      step.condition?.startsWith('fast.next') && step.result !== 'found' && step.result !== 'not-found';
    const isCheckMeet = step.condition?.startsWith('slow');

    if (isCheckFastNext && step.listNodes && step.listNodes.length > 0) {
      const fastVal = step.listNodes[step.fast]?.value;
      return {
        prompt: `fast is at the node with value ${fastVal}. What does it mean if fast.next is null right now?`,
        options: [
          'There is definitely a cycle and we should return true.',
          'fast has reached the end of the list, so there is no cycle — return false.',
          'We should move slow forward and try again.',
          'We need to reset fast back to head.',
        ],
        correctIndex: 1,
        explanation:
          'In Floyd’s algorithm, fast advances two nodes per turn. If fast or fast.next is ever null, fast cannot complete its move, which means the list terminates — so there is no cycle.',
      };
    }

    if (isCheckMeet && step.listNodes && step.listNodes.length > 0) {
      const slowVal = step.listNodes[step.slow]?.value;
      const fastVal = step.listNodes[step.fast]?.value;
      const met = step.slow === step.fast;
      return {
        prompt: `After this turn, slow is at value ${slowVal} and fast is at value ${fastVal}. What is the correct conclusion?`,
        options: met
          ? [
              'They are on the same node — the hare lapped the tortoise, so a cycle exists. Return true.',
              'They are on the same node by coincidence; keep looping to be sure.',
              'They are on the same node, which means there is no cycle.',
              'We must move fast another step before deciding.',
            ]
          : [
              'They are on different nodes, so there is no cycle — return false.',
              'They are on different nodes; keep looping because fast may still catch slow inside a cycle.',
              'They are on different nodes, so we should reset slow to head.',
              'They are on different nodes, which means the list is empty.',
            ],
        correctIndex: met ? 0 : 1,
        explanation: met
          ? 'Inside a cycle the hare gains one node per turn on the tortoise, so a meeting is proof of a cycle. There is no "coincidence" case to rule out — an acyclic list can never produce a meeting because fast would have fallen off the end first.'
          : 'A single non-meeting does not prove anything: fast may simply not have lapped slow yet. Continue the loop — either fast will catch slow (cycle) or fast will hit null (no cycle).',
      };
    }

    return null;
  },
};
