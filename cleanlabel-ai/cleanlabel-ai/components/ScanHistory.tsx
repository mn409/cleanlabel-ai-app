'use client';
// components/ScanHistory.tsx
// A sliding sidebar that shows past scans pulled from Supabase

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { X, Clock, ChevronRight, Loader2 } from 'lucide-react';
import { fetchRecentScans } from '@/lib/supabase';
import type { ScanRecord } from '@/types';
import { SCORE_META } from '@/types';

interface ScanHistoryProps {
  onClose: () => void;
}

export default function ScanHistory({ onClose }: ScanHistoryProps) {
  const [scans, setScans] = useState<ScanRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const data = await fetchRecentScans(20);
        setScans(data);
      } catch {
        setError('Could not load scan history.');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
      />

      {/* Sidebar panel */}
      <motion.aside
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="fixed top-0 right-0 h-full w-full max-w-sm bg-[#FDFCFA] border-l border-[#E8E4DD] z-50 flex flex-col shadow-xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#E8E4DD]">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-ink-muted" />
            <h2 className="font-display font-semibold text-ink-primary">Scan History</h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#F0EDE8] flex items-center justify-center hover:bg-[#E8E4DD] transition-colors"
            aria-label="Close history"
          >
            <X className="w-4 h-4 text-ink-secondary" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-48 gap-3">
              <Loader2 className="w-5 h-5 text-ink-muted animate-spin" />
              <p className="text-sm text-ink-muted font-body">Loading your scans…</p>
            </div>
          ) : error ? (
            <div className="px-6 py-8 text-center">
              <p className="text-sm text-ink-muted font-body">{error}</p>
              <p className="text-xs text-ink-muted mt-1 font-body">
                Make sure your Supabase credentials are configured.
              </p>
            </div>
          ) : scans.length === 0 ? (
            <div className="px-6 py-8 text-center">
              <div className="w-12 h-12 rounded-2xl bg-[#F0EDE8] flex items-center justify-center mx-auto mb-3">
                <Clock className="w-5 h-5 text-ink-muted" />
              </div>
              <p className="font-body text-ink-secondary text-sm">No scans yet</p>
              <p className="font-body text-ink-muted text-xs mt-1">
                Upload a label to get started!
              </p>
            </div>
          ) : (
            <ul className="divide-y divide-[#F0EDE8]">
              {scans.map((scan, i) => (
                <ScanItem key={scan.id} scan={scan} index={i} />
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-[#E8E4DD] text-center">
          <p className="text-xs text-ink-muted font-body">
            Showing your {scans.length} most recent scans
          </p>
        </div>
      </motion.aside>
    </>
  );
}

function ScanItem({ scan, index }: { scan: ScanRecord; index: number }) {
  const meta = SCORE_META[scan.glow_score];

  const date = new Date(scan.created_at);
  const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  const timeStr = date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

  return (
    <motion.li
      initial={{ opacity: 0, x: 16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      className="flex items-center gap-4 px-6 py-4 hover:bg-[#F7F5F2] transition-colors cursor-default"
    >
      {/* Score badge */}
      <div
        className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 font-display font-bold text-sm"
        style={{ backgroundColor: meta.bg, color: meta.text }}
      >
        {scan.glow_score}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="font-body text-sm font-medium text-ink-primary truncate">
          {scan.product_name || 'Unknown Product'}
        </p>
        <p className="font-body text-xs text-ink-muted">
          {dateStr} · {timeStr}
        </p>
      </div>

      {/* Arrow */}
      <ChevronRight className="w-4 h-4 text-ink-muted shrink-0" />
    </motion.li>
  );
}
