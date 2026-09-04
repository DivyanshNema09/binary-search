import type { Problem, RoadmapLevel, Badge } from '@/types';

export const problems: Problem[] = [
  {
    id: 0,
    leetcodeId: 704,
    title: 'Binary Search',
    difficulty: 'Easy',
    pattern: 'Basic Binary Search',
    companies: ['Google', 'Amazon', 'Apple'],
    description: 'Given an array of integers nums which is sorted in ascending order, and an integer target, write a function to search target in nums. If target exists, return its index. Otherwise, return -1.',
    examples: [
      { input: 'nums = [-1,0,3,5,9,12], target = 9', output: '4', explanation: '9 exists in nums and its index is 4' },
      { input: 'nums = [-1,0,3,5,9,12], target = 2', output: '-1', explanation: '2 does not exist in nums so return -1' },
    ],
    algorithmId: 'binary-search',
    interviewTip: 'Always use mid = low + (high - low) / 2 to avoid integer overflow. Remember the loop condition: low <= high for exact match.',
    constraints: ['1 <= nums.length <= 10^4', '-10^4 < nums[i], target < 10^4', 'All integers in nums are unique', 'nums is sorted in ascending order'],
  },
  {
    id: 1,
    leetcodeId: 35,
    title: 'Search Insert Position',
    difficulty: 'Easy',
    pattern: 'Basic Binary Search',
    companies: ['Microsoft', 'Amazon', 'Facebook'],
    description: 'Given a sorted array of distinct integers and a target value, return the index if the target is found. If not, return the index where it would be if it were inserted in order.',
    examples: [
      { input: 'nums = [1,3,5,6], target = 5', output: '2', explanation: 'Target 5 is found at index 2' },
      { input: 'nums = [1,3,5,6], target = 2', output: '1', explanation: 'Target 2 is not found. Insert at index 1 to maintain sorted order' },
      { input: 'nums = [1,3,5,6], target = 7', output: '4', explanation: 'Target 7 is not found. Insert at index 4 (end of array)' },
    ],
    algorithmId: 'search-insert-position',
    interviewTip: 'When the target is not found, low will point to the correct insertion position. This is because low always points to where the target "should" be.',
    constraints: ['1 <= nums.length <= 10^4', '-10^4 <= nums[i] <= 10^4', 'nums contains distinct values', 'nums is sorted in ascending order'],
  },
  {
    id: 2,
    leetcodeId: 34,
    title: 'Find First and Last Position of Element in Sorted Array',
    difficulty: 'Medium',
    pattern: 'Boundary Search',
    companies: ['Google', 'Amazon', 'Microsoft', 'Meta'],
    description: 'Given an array of integers nums sorted in non-decreasing order, find the starting and ending position of a given target value. If target is not found, return [-1, -1].',
    examples: [
      { input: 'nums = [5,7,7,8,8,10], target = 8', output: '[3,4]', explanation: 'Target 8 first appears at index 3 and last at index 4' },
      { input: 'nums = [5,7,7,8,8,10], target = 6', output: '[-1,-1]', explanation: 'Target 6 is not found' },
    ],
    algorithmId: 'find-first-last-position',
    interviewTip: 'The key insight is to run binary search twice: once to find the left boundary (when nums[mid] >= target, go left), and once for the right boundary (when nums[mid] <= target, go right).',
    constraints: ['0 <= nums.length <= 10^5', '-10^9 <= nums[i] <= 10^9', 'nums is sorted in non-decreasing order'],
  },
  {
    id: 3,
    leetcodeId: 33,
    title: 'Search in Rotated Sorted Array',
    difficulty: 'Medium',
    pattern: 'Rotated Array',
    companies: ['Google', 'Amazon', 'Microsoft', 'Meta', 'Adobe'],
    description: 'There is an integer array nums sorted in ascending order (with distinct values). The array is rotated at an unknown pivot. Given the array after rotation and an integer target, return the index of target if found, or -1.',
    examples: [
      { input: 'nums = [4,5,6,7,0,1,2], target = 0', output: '4', explanation: 'Target 0 is found at index 4' },
      { input: 'nums = [4,5,6,7,0,1,2], target = 3', output: '-1', explanation: 'Target 3 is not in the array' },
    ],
    algorithmId: 'search-in-rotated-sorted-array',
    interviewTip: 'At each step, one half of the array is always sorted. Determine which half is sorted, then check if the target lies in that sorted half to decide which side to search.',
    constraints: ['1 <= nums.length <= 5000', '-10^4 <= nums[i] <= 10^4', 'All values are unique', 'nums is rotated at some pivot'],
  },
  {
    id: 4,
    leetcodeId: 162,
    title: 'Find Peak Element',
    difficulty: 'Medium',
    pattern: 'Peak Finding',
    companies: ['Google', 'Amazon', 'Apple', 'Microsoft'],
    description: 'A peak element is an element that is strictly greater than its neighbors. Given an integer array nums, find a peak element and return its index. The array can be unsorted.',
    examples: [
      { input: 'nums = [1,2,3,1]', output: '2', explanation: '3 is a peak element at index 2 (3 > 2 and 3 > 1)' },
      { input: 'nums = [1,2,1,3,5,6,4]', output: '5', explanation: '6 is a peak element at index 5 (6 > 5 and 6 > 4)' },
    ],
    algorithmId: 'find-peak-element',
    interviewTip: 'Binary search works here because if nums[mid+1] > nums[mid], a peak is guaranteed on the right side. Move toward the increasing direction.',
    constraints: ['1 <= nums.length <= 1000', '-2^31 <= nums[i] <= 2^31 - 1', 'nums[i] != nums[i+1] for all valid i'],
  },
  {
    id: 5,
    leetcodeId: 875,
    title: 'Koko Eating Bananas',
    difficulty: 'Medium',
    pattern: 'Binary Search on Answer',
    companies: ['Google', 'Amazon', 'Meta', 'ByteDance'],
    description: 'Koko loves to eat bananas. There are n piles of bananas. She can eat k bananas per hour. Find the minimum integer k such that she can eat all bananas within h hours.',
    examples: [
      { input: 'piles = [3,6,7,11], h = 8', output: '4', explanation: 'At speed 4, Koko takes 1+2+2+3 = 8 hours' },
      { input: 'piles = [30,11,23,4,20], h = 5', output: '30', explanation: 'At speed 30, each pile takes exactly 1 hour' },
    ],
    algorithmId: 'koko-eating-bananas',
    interviewTip: 'This is a classic "Binary Search on Answer" problem. The answer range is [1, max(piles)]. Binary search for the minimum feasible speed.',
    constraints: ['1 <= piles.length <= 10^4', 'piles.length <= h <= 10^9', '1 <= piles[i] <= 10^9'],
  },
];

export const roadmap: RoadmapLevel[] = [
  {
    level: 1,
    title: 'Binary Search Fundamentals',
    description: 'Understand the core concept of binary search, when to use it, and how low, mid, and high work together.',
    topics: ['What is Binary Search?', 'Sorted array requirement', 'Time & space complexity', 'low, mid, high pointers', 'Iterative implementation', 'Recursive implementation'],
    problemIds: [0],
  },
  {
    level: 2,
    title: 'Basic Binary Search Problems',
    description: 'Apply binary search to solve fundamental problems like search and insertion position.',
    topics: ['Standard binary search', 'Search insert position', 'Guess number higher or lower', 'First bad version'],
    problemIds: [0, 1],
  },
  {
    level: 3,
    title: 'First/Last Occurrence Patterns',
    description: 'Learn how to modify binary search to find boundaries and handle duplicates.',
    topics: ['First occurrence', 'Last occurrence', 'Count occurrences', 'Boundary search technique'],
    problemIds: [2],
  },
  {
    level: 4,
    title: 'Rotated Sorted Arrays',
    description: 'Master searching in rotated arrays by identifying which half is sorted.',
    topics: ['Search in rotated array', 'Find minimum in rotated array', 'Identifying sorted halves', 'Rotation pivot'],
    problemIds: [3],
  },
  {
    level: 5,
    title: 'Binary Search on Answer',
    description: 'Use binary search to search over a range of possible answers instead of array indices.',
    topics: ['Pattern recognition', 'Feasibility functions', 'Koko eating bananas', 'Capacity to ship packages', 'Split array largest sum'],
    problemIds: [5],
  },
  {
    level: 6,
    title: 'Advanced Binary Search',
    description: 'Tackle advanced patterns including peak finding, median of sorted arrays, and more.',
    topics: ['Find peak element', 'Median of two sorted arrays', 'Single element in sorted array', 'Time-based key-value store'],
    problemIds: [4],
  },
];

export const badges: Badge[] = [
  { id: 'bs-beginner', name: 'Binary Search Beginner', description: 'Visualized your first binary search', icon: 'Search', condition: 'Visualize 1 problem' },
  { id: 'boundary-hunter', name: 'Boundary Hunter', description: 'Mastered boundary search patterns', icon: 'Crosshair', condition: 'Complete 2 boundary problems' },
  { id: 'rotation-master', name: 'Rotation Master', description: 'Solved rotated array problems', icon: 'RotateCw', condition: 'Complete rotated array problems' },
  { id: 'answer-searcher', name: 'Answer Searcher', description: 'Mastered binary search on answer', icon: 'Target', condition: 'Complete BS on answer problems' },
  { id: 'fang-ready', name: 'FANG Ready', description: 'Completed all binary search problems', icon: 'Trophy', condition: 'Complete all problems' },
];

export function getProblem(id: number): Problem | undefined {
  return problems.find((p) => p.id === id);
}

export function getProblemsByPattern(pattern: string): Problem[] {
  return problems.filter((p) => p.pattern === pattern);
}
