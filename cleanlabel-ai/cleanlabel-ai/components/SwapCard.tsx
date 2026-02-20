'use client';
// components/SwapCard.tsx
// Displays the AI's suggested healthier alternative / swap for the scanned product

import { motion } from 'framer-motion';
import { Leaf, ArrowRight } from 'lucide-react';
import type { GlowScore } from '@/types';

interface SwapCardProps {
  swap: string;
  score: GlowScore;
}

export default function SwapCard({ swap, score }: SwapCardProps) {
  // For C and D scores, the swap is more urgent — show it with more emphasis
  const isUrgent = score === 'C' || score === 'D';

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className={`
        relative overflow-hidden rounded-2xl p-5 border
        ${isUrgent
          ? 'bg-sage-50/80 border-sage-100'
          : 'bg-white/60 border-[#E8E4DD]'
        }
      `}
    >
      {/* Decorative background leaf */}
      <div className="absolute -right-4 -top-4 w-20 h-20 rounded-full bg-sage-100/40" />
      <div className="absolute -right-2 -bottom-4 w-14 h-14 rounded-full bg-sage-100/30" />

      <div className="relative flex gap-4">
        {/* Icon */}
        <div className="shrink-0 w-10 h-10 rounded-xl bg-sage-100 flex items-center justify-center">
          <Leaf className="w-5 h-5 text-sage-600" />
        </div>

        {/* Content */}
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <p className="font-body font-semibold text-sm text-ink-primary">
              Cleaner Alternative
            </p>
            {isUrgent && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-sage-100 text-sage-600 font-body font-medium">
                Recommended
              </span>
            )}
          </div>
          <p className="text-sm font-body text-ink-secondary leading-relaxed">
            {swap}
          </p>

          {/* Prompt to take action */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-3 flex items-center gap-1 text-xs text-sage-600 font-body font-medium"
          >
            <span>Look for this next time you shop</span>
            <ArrowRight className="w-3 h-3" />
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
