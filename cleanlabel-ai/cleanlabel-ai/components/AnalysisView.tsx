'use client';
// components/AnalysisView.tsx
// Shows the full analysis result after AI scanning completes
// Features: animated background color by score, slide-up drawer, red flags, swap card

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { RotateCcw, ChevronDown, ChevronUp, CheckCircle2 } from 'lucide-react';
import type { AnalysisResult } from '@/types';
import { SCORE_META } from '@/types';
import RedFlagsList from './RedFlagsList';
import SwapCard from './SwapCard';

interface AnalysisViewProps {
  analysis: AnalysisResult;
  onReset: () => void;
}

export default function AnalysisView({ analysis, onReset }: AnalysisViewProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const meta = SCORE_META[analysis.glow_score];

  // Auto-open drawer after a short delay for a nice reveal
  useEffect(() => {
    const timer = setTimeout(() => setDrawerOpen(true), 600);
    return () => clearTimeout(timer);
  }, []);

  return (
    <motion.div
      id="analysis"
      initial={{ backgroundColor: '#F7F4EF' }}
      animate={{ backgroundColor: meta.bg }}
      transition={{ duration: 0.7, ease: 'easeInOut' }}
      className="min-h-screen pt-20 pb-12 px-6"
    >
      <div className="max-w-3xl mx-auto">
        {/* ── Top bar: product name + reset ───────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex items-center justify-between mb-10"
        >
          <div>
            <p className="text-xs font-body text-ink-muted uppercase tracking-widest mb-1">Analysis complete</p>
            <h2 className="font-display text-xl font-semibold text-ink-primary leading-tight">
              {analysis.product_name}
            </h2>
          </div>
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={onReset}
            className="flex items-center gap-2 px-4 py-2 rounded-full border border-[#D8D3CC] bg-white/60 backdrop-blur-sm text-sm font-body text-ink-secondary hover:text-ink-primary hover:border-ink-muted transition-all"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Scan Another
          </motion.button>
        </motion.div>

        {/* ── Glow Score Hero ──────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex flex-col sm:flex-row items-center sm:items-start gap-8 mb-10"
        >
          {/* The big score letter */}
          <div className="relative shrink-0">
            <motion.div
              initial={{ scale: 0, rotate: -10 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.3 }}
              className="w-28 h-28 rounded-3xl flex items-center justify-center shadow-soft"
              style={{
                backgroundColor: meta.bg,
                border: `2px solid ${meta.border}`,
              }}
            >
              <span
                className="score-badge text-6xl leading-none"
                style={{ color: meta.text }}
              >
                {analysis.glow_score}
              </span>
            </motion.div>
            <span className="absolute -bottom-2 -right-2 text-2xl">{meta.emoji}</span>
          </div>

          {/* Score details */}
          <div className="flex-1 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-2 mb-3">
              <span
                className="text-xs font-body font-semibold uppercase tracking-widest px-2.5 py-1 rounded-full"
                style={{
                  color: meta.text,
                  backgroundColor: meta.border,
                }}
              >
                {meta.label}
              </span>
              <span className="text-xs text-ink-muted font-body">{meta.description}</span>
            </div>
            <p className="font-display text-2xl font-medium text-ink-primary mb-3 italic leading-snug">
              &ldquo;{analysis.vibe_check}&rdquo;
            </p>

            {/* Quick stats row */}
            <div className="flex flex-wrap gap-3 justify-center sm:justify-start">
              <StatPill
                value={analysis.red_flags.length}
                label="red flags"
                warn={analysis.red_flags.length > 0}
              />
              <StatPill
                value={analysis.red_flags.length === 0 ? '✓' : '→'}
                label={analysis.red_flags.length === 0 ? 'No additives' : 'Swap available'}
                warn={false}
                positive={analysis.red_flags.length === 0}
              />
            </div>
          </div>
        </motion.div>

        {/* ── Results Drawer ───────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4, ease: 'easeOut' }}
          className="rounded-2xl overflow-hidden border shadow-soft"
          style={{ borderColor: meta.border, backgroundColor: 'rgba(255,255,255,0.7)' }}
        >
          {/* Drawer header (toggle) */}
          <button
            onClick={() => setDrawerOpen(!drawerOpen)}
            className="w-full flex items-center justify-between px-6 py-4 hover:bg-white/40 transition-colors"
          >
            <span className="font-body font-semibold text-sm text-ink-primary">
              View full breakdown
            </span>
            {drawerOpen ? (
              <ChevronUp className="w-4 h-4 text-ink-muted" />
            ) : (
              <ChevronDown className="w-4 h-4 text-ink-muted" />
            )}
          </button>

          {/* Drawer content (animated) */}
          <motion.div
            initial={false}
            animate={{ height: drawerOpen ? 'auto' : 0 }}
            transition={{ duration: 0.4, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-6 pt-2 space-y-8">
              {/* Red Flags Section */}
              <div id="red-flags">
                <SectionLabel
                  icon="🚩"
                  title="Red Flags"
                  subtitle={`${analysis.red_flags.length} additive${analysis.red_flags.length !== 1 ? 's' : ''} detected`}
                />
                {analysis.red_flags.length === 0 ? (
                  <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-sage-50 border border-sage-100 mt-4">
                    <CheckCircle2 className="w-5 h-5 text-sage-600 shrink-0" />
                    <p className="text-sm font-body text-sage-600">
                      No concerning additives found — this product looks clean!
                    </p>
                  </div>
                ) : (
                  <RedFlagsList redFlags={analysis.red_flags} />
                )}
              </div>

              {/* Suggested Swap Section */}
              {analysis.suggested_swap && (
                <div id="swaps">
                  <SectionLabel
                    icon="💡"
                    title="Better Swap"
                    subtitle="Our recommendation"
                  />
                  <SwapCard swap={analysis.suggested_swap} score={analysis.glow_score} />
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
}

// ─── Sub-components ────────────────────────────────────────────────────────────

function StatPill({
  value,
  label,
  warn,
  positive,
}: {
  value: number | string;
  label: string;
  warn: boolean;
  positive?: boolean;
}) {
  return (
    <div
      className={`
        flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-body
        ${warn
          ? 'bg-red-50 border-red-100 text-red-700'
          : positive
            ? 'bg-sage-50 border-sage-100 text-sage-600'
            : 'bg-white border-[#E8E4DD] text-ink-secondary'
        }
      `}
    >
      <span className="font-semibold">{value}</span>
      <span>{label}</span>
    </div>
  );
}

function SectionLabel({
  icon,
  title,
  subtitle,
}: {
  icon: string;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-2">
        <span className="text-base">{icon}</span>
        <h3 className="font-display font-semibold text-ink-primary text-lg">{title}</h3>
      </div>
      <span className="text-xs font-body text-ink-muted">{subtitle}</span>
    </div>
  );
}
