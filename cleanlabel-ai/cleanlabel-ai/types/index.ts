// types/index.ts
// Central type definitions for CleanLabel AI

export type GlowScore = 'A' | 'B' | 'C' | 'D';

export interface IngredientDetail {
  name: string;
  what_it_is: string;
  why_flagged: string;
  regulatory_status: string;
  source_label: string;
  source_url: string;
}

export interface AnalysisResult {
  product_name: string;
  glow_score: GlowScore;
  vibe_check: string;
  red_flags: string[];
  ingredient_details: IngredientDetail[];
  suggested_swap: string;
}

export interface ScanRecord {
  id: string;
  product_name: string;
  glow_score: GlowScore;
  vibe_check: string;
  red_flags: string[];
  suggested_swap: string;
  image_url?: string;
  created_at: string;
}

// Score metadata for colors, labels, and descriptions
export const SCORE_META: Record<GlowScore, {
  bg: string;
  border: string;
  text: string;
  badge: string;
  label: string;
  emoji: string;
  description: string;
}> = {
  A: {
    bg: '#E8F5E9',
    border: '#C8E6C9',
    text: '#2E7D32',
    badge: 'bg-sage-50 text-sage-600 border border-sage-100',
    label: 'Clean',
    emoji: '✨',
    description: 'Excellent ingredient profile',
  },
  B: {
    bg: '#FFFDE7',
    border: '#FFF9C4',
    text: '#F57F17',
    badge: 'bg-yellow-50 text-yellow-700 border border-yellow-100',
    label: 'Good',
    emoji: '👍',
    description: 'Mostly wholesome ingredients',
  },
  C: {
    bg: '#FFF3E0',
    border: '#FFE0B2',
    text: '#E65100',
    badge: 'bg-orange-50 text-orange-700 border border-orange-100',
    label: 'Fair',
    emoji: '⚠️',
    description: 'Some processed ingredients',
  },
  D: {
    bg: '#FFEBEE',
    border: '#FFCDD2',
    text: '#B71C1C',
    badge: 'bg-red-50 text-red-700 border border-red-100',
    label: 'Avoid',
    emoji: '🚫',
    description: 'Heavy industrial additives',
  },
};

// Fallback additive dictionary — used when Gemini doesn't return details for a flag
export const ADDITIVE_INFO: Record<string, string> = {
  'Soy Lecithin': 'An emulsifier derived from soy, often GMO. May cause digestive issues in sensitive individuals.',
  'Carrageenan': 'A seaweed-derived thickener linked to gut inflammation in some studies.',
  'High Fructose Corn Syrup': 'Highly processed sugar linked to obesity, insulin resistance, and metabolic issues.',
  'HFCS': 'High Fructose Corn Syrup — highly processed sugar linked to metabolic issues.',
  'Sodium Nitrite': 'A preservative in processed meats associated with increased cancer risk.',
  'Artificial Colors': 'Synthetic dyes linked to hyperactivity in children and potential carcinogenic effects.',
  'BHA': 'Butylated hydroxyanisole — a preservative classified as a possible human carcinogen.',
  'BHT': 'Butylated hydroxytoluene — a synthetic antioxidant with potential endocrine-disrupting properties.',
  'Polysorbate 80': 'An emulsifier that may disrupt gut microbiome and contribute to metabolic syndrome.',
  'Xanthan Gum': 'A thickener that can cause digestive distress in large amounts.',
  'Guar Gum': 'A thickener that may cause bloating and digestive issues in sensitive individuals.',
  'Aspartame': 'An artificial sweetener with contested health effects; some research links it to neurological issues.',
  'Sucralose': 'An artificial sweetener that may negatively alter gut microbiome composition.',
  'Sodium Benzoate': 'A preservative that can form benzene (a carcinogen) when combined with vitamin C.',
  'TBHQ': 'Tertiary butylhydroquinone — a preservative with potential immune and neurological effects.',
  'Maltodextrin': 'A highly processed starch with a higher glycemic index than table sugar.',
  'Artificial Flavors': 'Vague term masking hundreds of synthetic chemicals used to simulate natural taste.',
  'Modified Starch': 'Chemically altered starch that may cause digestive issues and blood sugar spikes.',
};
