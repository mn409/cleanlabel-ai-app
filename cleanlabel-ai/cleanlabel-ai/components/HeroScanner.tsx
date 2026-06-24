'use client';
// components/HeroScanner.tsx
// Landing section with drag-drop, click-to-browse, AND camera capture

import { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Camera, ScanLine, ArrowRight, AlertCircle, X } from 'lucide-react';
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
  const [showCameraModal, setShowCameraModal] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [liveCamera, setLiveCamera] = useState(false);

  const validateAndUpload = useCallback(
    (file: File) => {
      setValidationError(null);
      if (!ACCEPTED_TYPES.includes(file.type) && !file.name.match(/\.(jpe?g|png|webp|heic)$/i)) {
        setValidationError('Please upload a JPG, PNG, or WebP image.');
        return;
      }
      if (file.size > MAX_SIZE_MB * 1024 * 1024) {
        setValidationError(`Image must be under ${MAX_SIZE_MB}MB.`);
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);
      onFileUpload(file);
    },
    [onFileUpload]
  );

  const handleDragOver = (e: React.DragEvent) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = () => setIsDragging(false);
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault(); setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) validateAndUpload(file);
  };
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) validateAndUpload(file);
  };

  // ── Live camera (desktop browsers) ───────────────────────────────────────
  async function openLiveCamera() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
      });
      streamRef.current = stream;
      setLiveCamera(true);
      setShowCameraModal(true);
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
      }, 100);
    } catch {
      // Fallback: use native camera input (works on mobile always)
      cameraInputRef.current?.click();
    }
  }

  function closeLiveCamera() {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    setLiveCamera(false);
    setShowCameraModal(false);
  }

  function capturePhoto() {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    canvas.getContext('2d')?.drawImage(videoRef.current, 0, 0);
    canvas.toBlob((blob) => {
      if (!blob) return;
      const file = new File([blob], 'camera-capture.jpg', { type: 'image/jpeg' });
      closeLiveCamera();
      validateAndUpload(file);
    }, 'image/jpeg', 0.92);
  }

  const displayError = validationError || error;

  return (
    <section id="scanner" className="min-h-screen pt-16 flex flex-col items-center justify-center px-6 py-16">
      <div className="max-w-2xl w-full mx-auto">

        {/* Headline */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="text-center mb-12"
        >
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
            Upload or photograph any ingredient label. Our AI food scientist scores it,
            flags hidden additives, and cites real sources — in seconds.
          </p>
        </motion.div>

        {/* Drop Zone */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`relative cursor-pointer rounded-2xl border-2 border-dashed transition-all duration-200 overflow-hidden
              ${isDragging
                ? 'border-sage-400 bg-sage-50/50 scale-[1.01]'
                : 'border-[#D8D3CC] bg-white/60 hover:border-sage-300 hover:bg-sage-50/20'
              }`}
          >
            <div className="py-14 px-8 flex flex-col items-center justify-center text-center">
              {preview ? (
                <div className="relative w-32 h-32 rounded-xl overflow-hidden mb-4 shadow-card">
                  <Image src={preview} alt="Label preview" fill className="object-cover" />
                  <div className="absolute inset-0 bg-sage-600/20 flex items-center justify-center">
                    <div className="w-8 h-8 rounded-full bg-white/90 flex items-center justify-center">
                      <ScanLine className="w-4 h-4 text-sage-600" />
                    </div>
                  </div>
                </div>
              ) : (
                <motion.div
                  animate={isDragging ? { scale: 1.15, y: -4 } : { scale: 1, y: 0 }}
                  className="w-16 h-16 rounded-2xl bg-[#F0EDE8] flex items-center justify-center mb-5"
                >
                  <Upload className="w-7 h-7 text-ink-secondary" />
                </motion.div>
              )}

              <p className="font-display text-xl font-semibold text-ink-primary mb-2">
                {isDragging ? 'Drop your label photo here' : preview ? 'Image ready — analyzing…' : 'Drop a label photo here'}
              </p>
              <p className="text-ink-muted text-sm font-body mb-6">
                {!isDragging && !preview && 'JPG, PNG or WebP · up to 10 MB'}
              </p>

              {/* Two action buttons */}
              {!preview && (
                <div className="flex items-center gap-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-ink-primary text-white text-sm font-body font-medium shadow-soft hover:bg-[#333] transition-colors"
                    onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
                  >
                    <Upload className="w-4 h-4" />
                    Choose file
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-[#D8D3CC] bg-white/80 text-ink-secondary text-sm font-body font-medium hover:border-sage-300 hover:text-ink-primary transition-all"
                    onClick={(e) => { e.stopPropagation(); openLiveCamera(); }}
                  >
                    <Camera className="w-4 h-4" />
                    Use camera
                  </motion.button>
                </div>
              )}
            </div>

            {/* Dot grid */}
            <div
              className="absolute inset-0 pointer-events-none opacity-[0.03]"
              style={{
                backgroundImage: 'radial-gradient(circle, #1A1A1A 1px, transparent 1px)',
                backgroundSize: '24px 24px',
              }}
            />
          </div>

          {/* Hidden file inputs */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/heic,.heic"
            onChange={handleInputChange}
            className="hidden"
          />
          {/* Camera input — fallback for mobile / no getUserMedia */}
          <input
            ref={cameraInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleInputChange}
            className="hidden"
          />
        </motion.div>

        {/* Error */}
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

        {/* Feature pills */}
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
            { icon: '📖', text: 'Source Citations' },
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

      {/* ── Live Camera Modal ────────────────────────────────────────────── */}
      <AnimatePresence>
        {showCameraModal && liveCamera && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="w-full max-w-md bg-[#1A1A1A] rounded-2xl overflow-hidden"
            >
              {/* Modal header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
                <p className="text-white font-body font-medium text-sm">Point at the ingredient label</p>
                <button
                  onClick={closeLiveCamera}
                  className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                >
                  <X className="w-4 h-4 text-white" />
                </button>
              </div>

              {/* Video feed */}
              <div className="relative aspect-[4/3] bg-black">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                />
                {/* Scan guide overlay */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-3/4 h-1/2 border-2 border-white/40 rounded-xl" />
                </div>
              </div>

              {/* Capture button */}
              <div className="flex items-center justify-center py-6">
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.94 }}
                  onClick={capturePhoto}
                  className="w-16 h-16 rounded-full bg-white flex items-center justify-center shadow-lg"
                >
                  <div className="w-12 h-12 rounded-full border-2 border-[#1A1A1A]/20 bg-white" />
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
