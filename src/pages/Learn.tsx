import { motion } from 'framer-motion';
import { BookOpen, Code2, AlertTriangle, Lightbulb, ChevronRight, Target } from 'lucide-react';
import type { Page } from '@/components/Navbar';

interface LearnProps {
  onNavigate: (page: Page) => void;
}

const sections = [
  {
    title: 'What is Binary Search?',
    icon: BookOpen,
    content: 'Binary Search is an efficient algorithm for finding a target value within a sorted array. Instead of checking every element (like linear search), it repeatedly divides the search space in half. If the target is less than the middle element, search the left half. If greater, search the right half. This gives O(log n) time complexity.',
  },
  {
    title: 'Why Does It Work?',
    icon: Lightbulb,
    content: 'Binary search exploits the sorted property of the array. Because elements are in order, comparing the target with the middle element tells us which half can be safely eliminated. Each comparison removes half the remaining elements, making it exponentially faster than linear search for large arrays.',
  },
  {
    title: 'How Does mid Work?',
    icon: Code2,
    content: 'The middle index is calculated as: mid = low + (high - low) / 2. We use this formula instead of (low + high) / 2 to avoid integer overflow when low and high are large values. The formula is mathematically equivalent but safer.',
  },
  {
    title: 'Iterative vs Recursive',
    icon: Code2,
    content: 'Both approaches produce the same result. The iterative version uses a while loop and is generally preferred because it uses O(1) space. The recursive version is more elegant but uses O(log n) stack space due to recursive calls.',
  },
  {
    title: 'Common Mistakes',
    icon: AlertTriangle,
    content: '1. Using (low + high) / 2 can overflow — use low + (high - low) / 2 instead.\n2. Confusing low <= high with low < high — the former is for exact match, the latter for boundary search.\n3. Forgetting to update low = mid + 1 or high = mid - 1 (using mid itself causes infinite loops).\n4. Applying binary search to unsorted arrays.',
  },
  {
    title: 'Integer Overflow in mid',
    icon: AlertTriangle,
    content: 'When low and high are both close to INT_MAX, their sum overflows. The safe formula mid = low + (high - low) / 2 never overflows because (high - low) is always non-negative and at most the array size. In Java, you can also use mid = (low + high) >>> 1 (unsigned right shift).',
  },
  {
    title: 'low <= high vs low < high',
    icon: Lightbulb,
    content: 'Use low <= high when you want to check every element including the last one (exact match). Use low < high when searching for a boundary — this prevents infinite loops when low and high converge to the same index. The choice depends on whether you need to examine the final element.',
  },
  {
    title: 'First and Last Occurrence',
    icon: Code2,
    content: 'To find the first occurrence: when nums[mid] >= target, save mid and search left (high = mid - 1). To find the last occurrence: when nums[mid] <= target, save mid and search right (low = mid + 1). This "bias" toward one side finds the boundary.',
  },
  {
    title: 'Rotated Arrays',
    icon: Code2,
    content: 'In a rotated sorted array, one half is always sorted. Compare nums[low] with nums[mid] to determine which half is sorted. Then check if the target lies within that sorted half to decide which side to search.',
  },
  {
    title: 'Binary Search on Answer',
    icon: Lightbulb,
    content: 'Sometimes the search space is not an array but a range of possible answers. If you can define a feasibility function f(x) that is monotonic (once true, stays true), you can binary search over the answer range. Examples: Koko Eating Bananas, Capacity To Ship Packages, Split Array Largest Sum.',
  },
  {
    title: 'Interview Patterns',
    icon: Target,
    content: 'Recognize these patterns in interviews:\n1. Basic Binary Search — exact match in sorted array\n2. Boundary Search — first/last occurrence\n3. Rotated Array — identify sorted half\n4. Binary Search on Answer — search over answer range\n5. Peak Finding — move toward increasing neighbor',
  },
  {
    title: 'Complexity Analysis',
    icon: BookOpen,
    content: 'Time: O(log n) — each step halves the search space. For n = 1,000,000, only ~20 comparisons needed.\nSpace: O(1) iterative, O(log n) recursive.\nCompare: Linear search O(n) needs 1,000,000 comparisons for the same array.',
  },
];

export function Learn({ onNavigate }: LearnProps) {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Learn Binary Search</h1>
        <p className="text-slate-500 dark:text-slate-400">A comprehensive guide from fundamentals to advanced interview patterns</p>
      </div>

      <div className="space-y-4">
        {sections.map((section, i) => (
          <motion.div
            key={section.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05 }}
            className="card p-6"
          >
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-primary-50 dark:bg-primary-500/10">
                <section.icon className="h-5 w-5 text-primary-500" />
              </div>
              <div className="flex-1">
                <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-2">{section.title}</h2>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed whitespace-pre-line">{section.content}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mt-8 card p-6 text-center"
      >
        <p className="text-slate-600 dark:text-slate-400 mb-4">Ready to put your knowledge into practice?</p>
        <button
          onClick={() => onNavigate('visualizer')}
          className="inline-flex items-center gap-2 btn-primary"
        >
          Try the Visualizer
          <ChevronRight className="h-4 w-4" />
        </button>
      </motion.div>
    </div>
  );
}
