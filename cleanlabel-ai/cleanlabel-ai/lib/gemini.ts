// lib/gemini.ts
// Wraps the Google Generative AI SDK for food label analysis
// Called from the /api/analyze API route

import { GoogleGenerativeAI } from '@google/generative-ai';
import type { AnalysisResult } from '@/types';

// The system prompt — positions the AI as a food scientist
const FOOD_SCIENTIST_PROMPT = `You are an expert Food Scientist and Nutritionist specializing in food additive safety and ingredient transparency. Your role is to analyze food ingredient lists and provide clear, unbiased assessments of product "cleanliness."

When analyzing ingredients, you will:
1. Identify ALL ingredients listed on the label
2. Detect industrial additives: emulsifiers, thickening gums, artificial sweeteners, preservatives, synthetic colors/flavors, and ultra-processed ingredients
3. Assign a Glow Score (A, B, C, or D) based on this rubric:
   - A: Mostly whole, recognizable ingredients. Minimal or no additives.
   - B: Generally clean with 1-2 minor additives (e.g., natural gum, small amount of preservative).
   - C: Several processed ingredients or multiple additives. Not ideal but not alarming.
   - D: Heavy use of industrial additives, artificial ingredients, or ultra-processed components.
4. Write a warm, human-friendly "vibe check" summary (1-2 sentences) about the overall ingredient quality
5. Suggest one specific, actionable "better swap" — a cleaner product or ingredient alternative

CRITICAL: You MUST respond with ONLY valid JSON. No markdown, no code blocks, no explanation outside the JSON.

Response format:
{
  "product_name": "Product name if visible, otherwise 'Unknown Product'",
  "glow_score": "A" | "B" | "C" | "D",
  "vibe_check": "A friendly 1-2 sentence summary of the ingredient quality",
  "red_flags": ["Additive 1", "Additive 2", ...],
  "suggested_swap": "A specific, helpful suggestion for a cleaner alternative"
}`;

/**
 * Analyzes a food label image using Google Gemini 1.5 Flash
 * @param base64Image - Base64-encoded image data (without the data: prefix)
 * @param mimeType - Image MIME type (e.g., 'image/jpeg')
 * @returns Parsed AnalysisResult or throws an error
 */
export async function analyzeFoodLabel(
  base64Image: string,
  mimeType: string = 'image/jpeg'
): Promise<AnalysisResult> {
  const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error('NEXT_PUBLIC_GEMINI_API_KEY is not configured');
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: 'gemini-flash-latest' });

  const userPrompt = `Please analyze this food ingredient label image. Extract all ingredients you can see, identify any red flag additives, assign a Glow Score, and provide your full assessment.

Remember: respond with ONLY the JSON object, nothing else.`;

  const result = await model.generateContent([
    {
      inlineData: {
        mimeType: mimeType as 'image/jpeg' | 'image/png' | 'image/webp',
        data: base64Image,
      },
    },
    {
      text: FOOD_SCIENTIST_PROMPT + '\n\n' + userPrompt,
    },
  ]);

  const responseText = result.response.text().trim();

  // Strip markdown code fences if the model wraps the JSON (defensive parsing)
  const cleaned = responseText
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/\s*```$/i, '')
    .trim();

  let parsed: AnalysisResult;
  try {
    parsed = JSON.parse(cleaned);
  } catch {
    console.error('Gemini raw response:', responseText);
    throw new Error('AI returned invalid JSON. Please try again with a clearer image.');
  }

  // Validate required fields
  if (!parsed.glow_score || !['A', 'B', 'C', 'D'].includes(parsed.glow_score)) {
    throw new Error('AI returned an invalid Glow Score. Please try again.');
  }

  // Ensure red_flags is always an array
  if (!Array.isArray(parsed.red_flags)) {
    parsed.red_flags = [];
  }

  return {
    product_name: parsed.product_name || 'Unknown Product',
    glow_score: parsed.glow_score,
    vibe_check: parsed.vibe_check || '',
    red_flags: parsed.red_flags,
    suggested_swap: parsed.suggested_swap || '',
  };
}
