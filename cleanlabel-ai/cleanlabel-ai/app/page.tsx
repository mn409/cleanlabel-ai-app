'use client';
// app/page.tsx
// Main dashboard page — orchestrates all sections and manages global state

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import HeroScanner from '@/components/HeroScanner';
import AnalysisView from '@/components/AnalysisView';
import ContactForm from '@/components/ContactForm';
import ScanHistory from '@/components/ScanHistory';
import type { AnalysisResult } from '@/types';

export default function Home() {
  // The current analysis result (null = not yet scanned)
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  // Whether the AI is currently processing
  const [isLoading, setIsLoading] = useState(false);
  // Any error message to show the user
  const [error, setError] = useState<string | null>(null);
  // Whether the history sidebar is open
  const [historyOpen, setHistoryOpen] = useState(false);

  /**
   * Called by HeroScanner when the user picks a file.
   * Sends the base64 image to the API and updates state.
   */
  async function handleFileUpload(file: File) {
    setIsLoading(true);
    setError(null);
    setAnalysis(null);

    try {
      // Convert file to base64
      const base64 = await fileToBase64(file);
      const mimeType = file.type || 'image/jpeg';

      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: base64, mimeType }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Analysis failed. Please try again.');
      }

      setAnalysis(data as AnalysisResult);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Something went wrong. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  }

  function handleReset() {
    setAnalysis(null);
    setError(null);
    setIsLoading(false);
  }

  return (
    <main className="min-h-screen flex flex-col">
      {/* ── Fixed Navbar ──────────────────────────────────── */}
      <Navbar
        onHistoryClick={() => setHistoryOpen(true)}
        hasResult={!!analysis}
        onLogoClick={handleReset}
      />

      {/* ── Scan History Sidebar ───────────────────────────── */}
      <AnimatePresence>
        {historyOpen && (
          <ScanHistory onClose={() => setHistoryOpen(false)} />
        )}
      </AnimatePresence>

      {/* ── Main Content ──────────────────────────────────────── */}
      <div className="flex-1 flex flex-col">
        <AnimatePresence mode="wait">
          {!analysis && !isLoading ? (
            // ── Hero Scanner (default view) ─────────────────
            <motion.div
              key="hero"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="flex-1"
            >
              <HeroScanner
                onFileUpload={handleFileUpload}
                isLoading={isLoading}
                error={error}
              />
            </motion.div>
          ) : isLoading ? (
            // ── Loading State ──────────────────────────────────
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="flex-1 flex items-center justify-center min-h-screen"
            >
              <LoadingState />
            </motion.div>
          ) : analysis ? (
            // ── Analysis Results View ──────────────────────────
            <motion.div
              key="analysis"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="flex-1"
            >
              <AnalysisView
                analysis={analysis}
                onReset={handleReset}
              />
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>

      {/* ── Contact / Footer ──────────────────────────────────── */}
      <ContactForm />
    </main>
  );
}

// ─── Loading animation component ──────────────────────────────────────────────

function LoadingState() {
  return (
    <div className="text-center px-6">
      {/* Pulsing orb */}
      <div className="relative inline-flex items-center justify-center mb-8">
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute w-32 h-32 rounded-full bg-sage-50"
        />
        <motion.div
          animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut', delay: 0.2 }}
          className="absolute w-20 h-20 rounded-full bg-sage-100"
        />
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
          className="relative w-16 h-16 rounded-full border-2 border-sage-600 border-t-transparent"
        />
      </div>

      <motion.h2
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="font-display text-2xl text-ink-primary mb-3"
      >
        Analyzing ingredients…
      </motion.h2>
      <p className="text-ink-secondary font-body text-sm max-w-xs mx-auto">
        Our AI food scientist is reviewing every additive and assigning your Glow Score.
      </p>

      {/* Animated steps */}
      <div className="mt-8 flex flex-col items-center gap-3">
        {['Reading ingredients', 'Checking additives', 'Computing Glow Score'].map(
          (step, i) => (
            <motion.div
              key={step}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.6 + 0.5, duration: 0.4 }}
              className="flex items-center gap-2 text-ink-muted text-sm"
            >
              <motion.div
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 1, repeat: Infinity, delay: i * 0.6 }}
                className="w-1.5 h-1.5 rounded-full bg-sage-400"
              />
              {step}
            </motion.div>
          )
        )}
      </div>
    </div>
  );
}

// ─── Utility: convert File to base64 string ───────────────────────────────────

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      // Strip the "data:image/...;base64," prefix
      const base64 = result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
}
