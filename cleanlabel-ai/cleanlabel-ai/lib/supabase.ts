// lib/supabase.ts
// Initializes and exports the Supabase client
// Used for database operations (scan history) and image storage

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Validate that env vars are present (helpful error in development)
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    '⚠️  Supabase environment variables are missing.\n' +
    'Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to your .env.local file.'
  );
}

export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '');

// ─── Database helpers ────────────────────────────────────────────────────────

import type { ScanRecord, AnalysisResult } from '@/types';

/**
 * Save a new scan result to the `scans` table
 */
export async function saveScan(
  result: AnalysisResult,
  imageUrl?: string
): Promise<ScanRecord | null> {
  const { data, error } = await supabase
    .from('scans')
    .insert([
      {
        product_name: result.product_name,
        glow_score: result.glow_score,
        vibe_check: result.vibe_check,
        red_flags: result.red_flags,
        suggested_swap: result.suggested_swap,
        image_url: imageUrl || null,
      },
    ])
    .select()
    .single();

  if (error) {
    console.error('Error saving scan:', error.message);
    return null;
  }

  return data as ScanRecord;
}

/**
 * Fetch the most recent scans for the history sidebar
 */
export async function fetchRecentScans(limit = 10): Promise<ScanRecord[]> {
  const { data, error } = await supabase
    .from('scans')
    .select('id, product_name, glow_score, vibe_check, created_at')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching scans:', error.message);
    return [];
  }

  return (data || []) as ScanRecord[];
}

/**
 * Upload an image file to Supabase Storage and return its public URL
 * Bucket name: label-images (create this in your Supabase dashboard)
 */
export async function uploadLabelImage(
  file: File,
  fileName: string
): Promise<string | null> {
  const { data, error } = await supabase.storage
    .from('label-images')
    .upload(`public/${fileName}`, file, {
      cacheControl: '3600',
      upsert: false,
    });

  if (error) {
    console.error('Error uploading image:', error.message);
    return null;
  }

  const { data: urlData } = supabase.storage
    .from('label-images')
    .getPublicUrl(data.path);

  return urlData.publicUrl;
}
