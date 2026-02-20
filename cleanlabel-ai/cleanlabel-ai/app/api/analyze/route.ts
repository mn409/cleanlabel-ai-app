// app/api/analyze/route.ts
// POST /api/analyze
// Receives a base64 image, calls Gemini AI, saves to Supabase, returns results

import { NextResponse } from 'next/server';
import { analyzeFoodLabel } from '@/lib/gemini';
import { saveScan } from '@/lib/supabase';

export const maxDuration = 60; // Allow up to 60s for AI analysis (Vercel)

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { image, mimeType } = body as {
      image: string;
      mimeType?: string;
    };

    if (!image) {
      return NextResponse.json(
        { error: 'No image data provided' },
        { status: 400 }
      );
    }

    // Step 1: Analyze the image with Gemini AI
    const analysisResult = await analyzeFoodLabel(
      image,
      mimeType || 'image/jpeg'
    );

    // Step 2: Save result to Supabase (non-blocking — don't fail if DB is down)
    try {
      await saveScan(analysisResult);
    } catch (dbError) {
      // Log the DB error but don't block the user from seeing results
      console.error('Non-fatal DB error:', dbError);
    }

    // Step 3: Return the analysis to the frontend
    return NextResponse.json(analysisResult);
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : 'An unexpected error occurred. Please try again.';

    console.error('API analyze error:', message);

    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
