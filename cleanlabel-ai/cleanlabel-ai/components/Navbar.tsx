'use client';
// components/Navbar.tsx
// Fixed top navigation bar with logo, scan history button, and auth controls

import { motion } from 'framer-motion';
import { History, Leaf, Sparkles } from 'lucide-react';

interface NavbarProps {
  onHistoryClick: () => void;
  hasResult: boolean;
  onLogoClick: () => void;
}

export default function Navbar({ onHistoryClick, onLogoClick }: NavbarProps) {
  return (
    <motion.nav
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="fixed top-0 left-0 right-0 z-50 h-16"
      id="nav"
    >
      {/* Frosted glass background */}
      <div className="absolute inset-0 bg-[#F7F4EF]/80 backdrop-blur-md border-b border-[#E8E4DD]" />

      <div className="relative max-w-6xl mx-auto h-full px-6 flex items-center justify-between">
        {/* ── Logo ─────────────────────────────────────────── */}
        <button
          onClick={onLogoClick}
          className="flex items-center gap-2 group"
          aria-label="CleanLabel AI — go to home"
        >
          <div className="w-8 h-8 rounded-full bg-sage-50 border border-sage-100 flex items-center justify-center group-hover:bg-sage-100 transition-colors">
            <Leaf className="w-4 h-4 text-sage-600" />
          </div>
          <span className="font-display font-semibold text-ink-primary text-lg tracking-tight">
            CleanLabel
            <span className="text-sage-600 ml-0.5">AI</span>
          </span>
        </button>

        {/* ── Right controls ──────────────────────────────── */}
        <div className="flex items-center gap-3">
          {/* Scan History button */}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={onHistoryClick}
            className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-body font-medium text-ink-secondary hover:text-ink-primary hover:bg-[#EFECE7] transition-all"
          >
            <History className="w-4 h-4" />
            <span className="hidden sm:inline">History</span>
          </motion.button>

          {/* CTA badge */}
          <motion.div
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-sage-50 border border-sage-100 text-sage-600 text-xs font-body font-medium"
          >
            <Sparkles className="w-3 h-3" />
            AI Powered
          </motion.div>
        </div>
      </div>
    </motion.nav>
  );
}
