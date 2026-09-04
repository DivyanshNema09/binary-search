import type { Algorithm } from '@/types';
import { binarySearch } from './binarySearch';
import { searchInsertPosition } from './searchInsertPosition';
import { findFirstLastPosition } from './firstLastPosition';
import { searchRotatedSortedArray } from './rotatedArray';
import { findPeakElement } from './findPeakElement';
import { kokoEatingBananas } from './kokoEatingBananas';

export const algorithms: Record<string, Algorithm> = {
  'binary-search': binarySearch,
  'search-insert-position': searchInsertPosition,
  'find-first-last-position': findFirstLastPosition,
  'search-in-rotated-sorted-array': searchRotatedSortedArray,
  'find-peak-element': findPeakElement,
  'koko-eating-bananas': kokoEatingBananas,
};

export function getAlgorithm(id: string): Algorithm | undefined {
  return algorithms[id];
}

export { binarySearch, searchInsertPosition, findFirstLastPosition, searchRotatedSortedArray, findPeakElement, kokoEatingBananas };
