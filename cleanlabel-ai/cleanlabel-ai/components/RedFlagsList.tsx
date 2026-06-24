'use client';
// components/RedFlagsList.tsx
// Expandable ingredient cards with deep-dive info and source citations

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, ChevronDown, ExternalLink, FlaskConical, ShieldAlert, Globe } from 'lucide-react';
import { ADDITIVE_INFO } from '@/types';
import type { IngredientDetail } from '@/types';

interface RedFlagsListProps {
  redFlags: string[];
  ingredientDetails?: IngredientDetail[];
}

export default function RedFlagsList({ redFlags, ingredientDetails = [] }: RedFlagsListProps) {
  if (redFlags.length === 0) return null;

  return (
    <div className="flex flex-col gap-2.5 mt-4">
      {redFlags.map((flag, index) => {
        const detail = ingredientDetails.find(
          (d) => d.name.toLowerCase() === flag.toLowerCase()
        );
        return (
          <RedFlagCard key={flag} flag={flag} index={index} detail={detail} />
        );
      })}
    </div>
  );
}

function RedFlagCard({
  flag,
  index,
  detail,
}: {
  flag: string;
  index: number;
  detail?: IngredientDetail;
}) {
  const [open, setOpen] = useState(false);

  // Fallback description from static dictionary
  const knownInfo = ADDITIVE_INFO[flag];
  const partialInfo = !knownInfo
    ? Object.entries(ADDITIVE_INFO).find(([key]) =>
        flag.toLowerCase().includes(key.toLowerCase()) ||
        key.toLowerCase().includes(flag.toLowerCase())
      )?.[1]
    : null;

  const fallbackDescription =
    knownInfo ||
    partialInfo ||
    'An industrial additive worth investigating — check its regulatory status before consuming regularly.';

  const hasDetail = !!detail;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.3 }}
      className="rounded-xl border border-red-100 overflow-hidden"
    >
      {/* Card header — always visible, clickable */}
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-start gap-3.5 p-4 bg-red-50/50 hover:bg-red-50/80 transition-colors text-left"
      >
        <div className="shrink-0 w-7 h-7 rounded-lg bg-red-100 flex items-center justify-center mt-0.5">
          <AlertTriangle className="w-3.5 h-3.5 text-red-600" />
        </div>

        <div className="flex-1 min-w-0">
          <p className="font-body font-semibold text-sm text-ink-primary leading-snug">
            {flag}
          </p>
          <p className="text-xs font-body text-ink-secondary mt-0.5 leading-relaxed line-clamp-2">
            {detail?.why_flagged || fallbackDescription}
          </p>
        </div>

        <motion.div
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="shrink-0 mt-0.5"
        >
          <ChevronDown className="w-4 h-4 text-ink-muted" />
        </motion.div>
      </button>

      {/* Expanded deep-dive panel */}
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="detail"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 pt-3 bg-white border-t border-red-100 space-y-3.5">

              {/* What it is */}
              {detail?.what_it_is && (
                <div className="flex gap-3">
                  <div className="shrink-0 w-6 h-6 rounded-md bg-[#F0EDE8] flex items-center justify-center mt-0.5">
                    <FlaskConical className="w-3 h-3 text-ink-secondary" />
                  </div>
                  <div>
                    <p className="text-[11px] uppercase tracking-widest font-body text-ink-muted mb-0.5">
                      What it is
                    </p>
                    <p className="text-xs font-body text-ink-secondary leading-relaxed">
                      {detail.what_it_is}
                    </p>
                  </div>
                </div>
              )}

              {/* Regulatory status */}
              {detail?.regulatory_status && (
                <div className="flex gap-3">
                  <div className="shrink-0 w-6 h-6 rounded-md bg-[#F0EDE8] flex items-center justify-center mt-0.5">
                    <ShieldAlert className="w-3 h-3 text-ink-secondary" />
                  </div>
                  <div>
                    <p className="text-[11px] uppercase tracking-widest font-body text-ink-muted mb-0.5">
                      Regulatory status
                    </p>
                    <p className="text-xs font-body text-ink-secondary leading-relaxed">
                      {detail.regulatory_status}
                    </p>
                  </div>
                </div>
              )}

              {/* Source link */}
              {detail?.source_url && (
                <div className="flex gap-3">
                  <div className="shrink-0 w-6 h-6 rounded-md bg-[#F0EDE8] flex items-center justify-center mt-0.5">
                    <Globe className="w-3 h-3 text-ink-secondary" />
                  </div>
                  <div>
                    <p className="text-[11px] uppercase tracking-widest font-body text-ink-muted mb-0.5">
                      Source
                    </p>
                    <a
                      href={detail.source_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-body text-sage-600 hover:text-sage-700 underline underline-offset-2 transition-colors"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {detail.source_label || 'Read the research'}
                      <ExternalLink className="w-3 h-3 shrink-0" />
                    </a>
                  </div>
                </div>
              )}

              {/* Fallback if no detail from AI */}
              {!hasDetail && (
                <p className="text-xs font-body text-ink-muted italic leading-relaxed">
                  Detailed breakdown unavailable for this ingredient — try searching it on{' '}
                  <a
                    href={`https://pubmed.ncbi.nlm.nih.gov/?term=${encodeURIComponent(flag)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sage-600 underline underline-offset-2 hover:text-sage-700"
                    onClick={(e) => e.stopPropagation()}
                  >
                    PubMed
                  </a>{' '}
                  or{' '}
                  <a
                    href="https://www.fda.gov/food/food-additives-petitions/food-additive-status-list"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sage-600 underline underline-offset-2 hover:text-sage-700"
                    onClick={(e) => e.stopPropagation()}
                  >
                    FDA's additive list
                  </a>
                  .
                </p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
