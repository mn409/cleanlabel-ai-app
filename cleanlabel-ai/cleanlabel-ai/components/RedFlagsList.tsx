'use client';
// components/RedFlagsList.tsx
// Displays a stacked card list of identified red-flag additives
// Uses a built-in dictionary to explain each additive, with fallback text

import { motion } from 'framer-motion';
import { AlertTriangle, Info } from 'lucide-react';
import { ADDITIVE_INFO } from '@/types';

interface RedFlagsListProps {
  redFlags: string[];
}

export default function RedFlagsList({ redFlags }: RedFlagsListProps) {
  if (redFlags.length === 0) return null;

  return (
    <div className="grid gap-3 mt-4 sm:grid-cols-1 lg:grid-cols-1">
      {redFlags.map((flag, index) => (
        <RedFlagCard key={flag} flag={flag} index={index} />
      ))}
    </div>
  );
}

function RedFlagCard({ flag, index }: { flag: string; index: number }) {
  // Look up the additive in our dictionary; fall back to a generic message
  const knownInfo = ADDITIVE_INFO[flag];

  // Partial match for common names (e.g. "Artificial Color (Red 40)" → "Artificial Colors")
  const partialInfo = !knownInfo
    ? Object.entries(ADDITIVE_INFO).find(([key]) =>
        flag.toLowerCase().includes(key.toLowerCase()) ||
        key.toLowerCase().includes(flag.toLowerCase())
      )?.[1]
    : null;

  const description =
    knownInfo ||
    partialInfo ||
    'An industrial additive worth watching — consider checking its effects on your health.';

  return (
    <motion.div
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.07, duration: 0.35 }}
      className="flex gap-4 p-4 rounded-xl bg-red-50/60 border border-red-100 hover:bg-red-50 transition-colors"
    >
      {/* Icon */}
      <div className="shrink-0 w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center mt-0.5">
        <AlertTriangle className="w-4 h-4 text-red-600" />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2 mb-1">
          <p className="font-body font-semibold text-sm text-ink-primary leading-tight">
            {flag}
          </p>
          {/* Badge: known vs AI-detected */}
          {(knownInfo || partialInfo) ? (
            <span className="shrink-0 text-xs px-2 py-0.5 rounded-full bg-red-100 text-red-700 font-body">
              Known additive
            </span>
          ) : (
            <span className="shrink-0 text-xs px-2 py-0.5 rounded-full bg-amber-50 border border-amber-100 text-amber-700 font-body flex items-center gap-1">
              <Info className="w-3 h-3" />
              AI detected
            </span>
          )}
        </div>
        <p className="text-xs font-body text-ink-secondary leading-relaxed">
          {description}
        </p>
      </div>
    </motion.div>
  );
}
