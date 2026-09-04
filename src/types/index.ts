export type Language = 'c' | 'cpp' | 'java';

export type Difficulty = 'Easy' | 'Medium' | 'Hard';

export type Pattern =
  | 'Opposite Direction'
  | 'Fast & Slow'
  | 'Linked List'
  | 'Partition'
  | 'String'
  | 'Sorting + Two Pointers';

export type VisualizationType =
  | 'opposite-pointers'
  | 'fast-slow'
  | 'linked-list'
  | 'partition'
  | 'string-pointers'
  | 'sorting-pointers';

export type DataStructure = 'Array' | 'String' | 'Linked List';

// Element states for array/string visualization
export type ElementState =
  | 'default'
  | 'left'
  | 'right'
  | 'slow'
  | 'fast'
  | 'i'
  | 'active'
  | 'comparing'
  | 'swapped'
  | 'eliminated'
  | 'found'
  | 'result'
  | 'partition-low'
  | 'partition-high'
  | 'partition-mid';

export interface ArrayElementState {
  value: number | string;
  index: number;
  state: ElementState;
}

// Linked list node state
export interface ListNodeState {
  value: number;
  index: number;
  state: ElementState;
  hasNext: boolean;
  hasCycle: boolean;
  cycleTargetIndex?: number;
}

// Pointer descriptor — describes any pointer at a given step
export interface PointerState {
  name: string;
  index: number;
  color: 'left' | 'right' | 'slow' | 'fast' | 'i' | 'active';
}

// Variable descriptor — for the live variable panel
export interface VariableDesc {
  label: string;
  value: string | number;
  color?: string;
}

// Challenge mode question
export interface ChallengeQuestion {
  prompt: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface VisualizationStep {
  // Array / string state
  array: ArrayElementState[];

  // Linked list state (null for array/string problems)
  listNodes?: ListNodeState[];

  // Pointer positions (-1 = not active)
  left: number;
  right: number;
  slow: number;
  fast: number;
  i: number;

  // Extra pointers for problems like 3Sum, 4Sum
  extraPointers?: PointerState[];

  // Target / goal value
  target: number;

  // Which line of code is executing
  activeLine: number;

  // Human-readable explanation
  explanation: string;

  // The condition being evaluated (e.g. "nums[left] + nums[right] < target")
  condition?: string;

  // The action taken (e.g. "Move left forward")
  action?: string;

  // Current variable values for the variable panel
  variables?: VariableDesc[];

  // Result status
  result?: 'found' | 'not-found' | 'in-progress' | 'success';

  // Number of comparisons so far
  comparisons?: number;

  // Challenge mode question for this step (optional)
  challenge?: ChallengeQuestion;

  // Swapped indices (for visual swap animation)
  swapped?: [number, number];

  // Result value(s) — e.g. indices found, max area, etc.
  resultValue?: string;
}

export interface Complexity {
  time: string;
  space: string;
  description: string;
}

export interface AlgorithmInput {
  array: number[];
  target: number;
  string?: string;
  list?: number[];
  extra?: Record<string, unknown>;
}

export interface Algorithm {
  id: string;
  name: string;
  description: string;
  pattern: Pattern;
  visualizationType: VisualizationType;
  dataStructure: DataStructure;
  generateSteps(input: AlgorithmInput): VisualizationStep[];
  getComplexity(): Complexity;
  getCode(language: Language): string[];
  getDefaultInput(): AlgorithmInput;
  validateInput(input: AlgorithmInput): string | null;
  getWhyItWorks(): string;
  getCommonMistakes(): string[];
  getChallengeForStep?(step: VisualizationStep, stepIndex: number, allSteps: VisualizationStep[]): ChallengeQuestion | null;
}

export interface Problem {
  id: number;
  leetcodeId: number;
  title: string;
  difficulty: Difficulty;
  pattern: Pattern;
  dataStructure: DataStructure;
  visualizationType: VisualizationType;
  companies: string[];
  description: string;
  examples: { input: string; output: string; explanation: string }[];
  algorithmId: string;
  interviewTip: string;
  constraints?: string[];
}

export interface RoadmapLevel {
  level: number;
  title: string;
  description: string;
  topics: string[];
  problemIds: number[];
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  condition: string;
}

export interface UserProgress {
  problemsSolved: number[];
  problemsVisualized: number[];
  patternsLearned: Pattern[];
  xp: number;
  streak: number;
  badges: string[];
}
