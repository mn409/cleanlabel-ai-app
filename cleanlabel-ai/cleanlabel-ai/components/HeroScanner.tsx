'use client';
// components/HeroScanner.tsx
// The main landing section with drag-drop / click-to-upload for label images

import { useState, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { Upload, Camera, ScanLine, ArrowRight, AlertCircle } from 'lucide-react';
import Image from 'next/image';

interface HeroScannerProps {
  onFileUpload: (file: File) => void;
  isLoading: boolean;
  error: string | null;
}

const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/heic'];
const MAX_SIZE_MB = 10;

export default function HeroScanner({ onFileUpload, isLoading, error }: HeroScannerProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const validateAndUpload = useCallback(
    (file: File) => {
      setValidationError(null);

      // Type check
      if (!ACCEPTED_TYPES.includes(file.type) && !file.name.match(/\.(jpe?g|png|webp|heic)$/i)) {
        setValidationError('Please upload a JPG, PNG, or WebP image.');
        return;
      }

      // Size check
      if (file.size > MAX_SIZE_MB * 1024 * 1024) {
        setValidationError(`Image must be under ${MAX_SIZE_MB}MB.`);
        return;
      }

      // Show preview
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);

      onFileUpload(file);
    },
    [onFileUpload]
  );

  // ── Drag handlers ──────────────────────────────────────────────────────────
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) validateAndUpload(file);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) validateAndUpload(file);
  };

  const displayError = validationError || error;

  return (
    <section
      id="scanner"
      className="min-h-screen pt-16 flex flex-col items-center justify-center px-6 py-16"
    >
      <div className="max-w-2xl w-full mx-auto">
        {/* ── Headline ──────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="text-center mb-12"
        >
          {/* Eyebrow tag */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-sage-50 border border-sage-100 text-sage-600 text-xs font-body font-medium mb-6"
          >
            <ScanLine className="w-3 h-3" />
            Instant ingredient analysis
          </motion.div>

          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold text-ink-primary leading-[1.1] mb-5">
            Know exactly{' '}
            <em className="not-italic text-sage-600">what</em>
            <br />
            you&apos;re eating
          </h1>
          <p className="text-ink-secondary font-body text-base sm:text-lg max-w-lg mx-auto leading-relaxed">
            Upload a photo of any ingredient label. Our AI food scientist will score it,
            flag hidden additives, and suggest cleaner swaps — in seconds.
          </p>
        </motion.div>

        {/* ── Drop Zone ─────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => inputRef.current?.click()}
            className={`
              relative cursor-pointer rounded-2xl border-2 border-dashed transition-all duration-200 overflow-hidden
              ${isDragging
                ? 'border-sage-400 bg-sage-50/50 scale-[1.01]'
                : 'border-[#D8D3CC] bg-white/60 hover:border-sage-400 hover:bg-sage-50/30'
              }
            `}
          >
            {/* Inner content */}
            <div className="py-14 px-8 flex flex-col items-center justify-center text-center">
              {preview ? (
                // Preview of selected image
                <div className="relative w-32 h-32 rounded-xl overflow-hidden mb-4 shadow-card">
                  <Image src={preview} alt="Label preview" fill className="object-cover" />
                  <div className="absolute inset-0 bg-sage-600/20 flex items-center justify-center">
                    <div className="w-8 h-8 rounded-full bg-white/90 flex items-center justify-center">
                      <ScanLine className="w-4 h-4 text-sage-600" />
                    </div>
                  </div>
                </div>
              ) : (
                // Upload icon (animated)
                <motion.div
                  animate={isDragging ? { scale: 1.15, y: -4 } : { scale: 1, y: 0 }}
                  className="w-16 h-16 rounded-2xl bg-[#F0EDE8] flex items-center justify-center mb-5"
                >
                  {isDragging ? (
                    <Camera className="w-7 h-7 text-sage-600" />
                  ) : (
                    <Upload className="w-7 h-7 text-ink-secondary" />
                  )}
                </motion.div>
              )}

              <p className="font-display text-xl font-semibold text-ink-primary mb-2">
                {isDragging
                  ? 'Drop your label photo here'
                  : preview
                    ? 'Image ready — analyzing…'
                    : 'Upload ingredient label photo'}
              </p>
              <p className="text-ink-muted text-sm font-body">
                {isDragging ? '' : 'Drag & drop, or click to browse · JPG, PNG, WebP up to 10MB'}
              </p>

              {/* CTA button */}
              {!preview && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="mt-6 flex items-center gap-2 px-6 py-3 rounded-full bg-ink-primary text-white text-sm font-body font-medium shadow-soft hover:bg-[#333] transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    inputRef.current?.click();
                  }}
                >
                  Choose Photo
                  <ArrowRight className="w-4 h-4" />
                </motion.button>
              )}
            </div>

            {/* Subtle grid pattern */}
            <div
              className="absolute inset-0 pointer-events-none opacity-[0.03]"
              style={{
                backgroundImage: 'radial-gradient(circle, #1A1A1A 1px, transparent 1px)',
                backgroundSize: '24px 24px',
              }}
            />
          </div>

          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/heic,.heic"
            onChange={handleInputChange}
            className="hidden"
            aria-label="Upload food label image"
          />
        </motion.div>

        {/* ── Error message ──────────────────────────────────────── */}
        {displayError && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 flex items-start gap-3 px-4 py-3 rounded-xl bg-red-50 border border-red-100 text-red-700"
          >
            <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
            <p className="text-sm font-body">{displayError}</p>
          </motion.div>
        )}

        {/* ── Feature pills ──────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-10 flex flex-wrap justify-center gap-3"
        >
          {[
            { icon: '🧬', text: 'Additive Detection' },
            { icon: '✨', text: 'Glow Score A–D' },
            { icon: '🔄', text: 'Better Swaps' },
            { icon: '📋', text: 'Scan History' },
          ].map((pill) => (
            <div
              key={pill.text}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-[#E8E4DD] text-xs text-ink-secondary font-body"
            >
              <span>{pill.icon}</span>
              {pill.text}
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
