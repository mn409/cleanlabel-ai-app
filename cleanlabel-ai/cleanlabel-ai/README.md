# 🌿 CleanLabel AI

> Instantly decode any food ingredient list. Get a **Glow Score (A–D)**, identify hidden additives, and discover cleaner swaps — powered by Google Gemini AI.

---

## ✨ Features

- 📸 **Upload any label photo** — drag & drop or click to browse
- 🧬 **AI ingredient analysis** — powered by Google Gemini 1.5 Flash
- ✨ **Glow Score (A–D)** — instant cleanliness rating
- 🚩 **Red flag detection** — identifies emulsifiers, gums, preservatives, and more
- 💡 **Better swaps** — AI-suggested cleaner alternatives
- 📋 **Scan history** — all past scans saved to Supabase
- 📬 **Contact form** — Formspree-powered feedback
- 🎨 **Animated UI** — Framer Motion transitions & background color shifts

---

## 🚀 Quick Start

### 1. Clone the repo

```bash
git clone https://github.com/YOUR_USERNAME/cleanlabel-ai.git
cd cleanlabel-ai
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

```bash
cp .env.local.example .env.local
```

Open `.env.local` and fill in your three keys:

| Variable | Where to get it |
|---|---|
| `NEXT_PUBLIC_GEMINI_API_KEY` | [Google AI Studio](https://aistudio.google.com/app/apikey) — free |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase → Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase → Settings → API |

### 4. Set up Supabase

In your Supabase project, run this SQL in the **SQL Editor**:

```sql
-- Create the scans table
create table scans (
  id uuid default gen_random_uuid() primary key,
  product_name text,
  glow_score text not null check (glow_score in ('A', 'B', 'C', 'D')),
  vibe_check text,
  red_flags text[] default '{}',
  suggested_swap text,
  image_url text,
  created_at timestamptz default now()
);

-- Allow public inserts and reads (no auth required)
alter table scans enable row level security;
create policy "Allow public inserts" on scans for insert with check (true);
create policy "Allow public reads" on scans for select using (true);
```

Then create a **Storage bucket** called `label-images`:
- Go to **Storage** in Supabase dashboard
- Click **New bucket** → Name: `label-images` → ✅ Public bucket

### 5. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 🌐 Deploy to Vercel

### Option A: GitHub → Vercel (recommended)

1. Push this repo to GitHub
2. Go to [vercel.com](https://vercel.com) → **New Project**
3. Import your GitHub repo
4. Add your **3 environment variables** in the Vercel dashboard:
   - `NEXT_PUBLIC_GEMINI_API_KEY`
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. Click **Deploy** 🎉

### Option B: Vercel CLI

```bash
npm i -g vercel
vercel --prod
```

---

## 📬 Formspree Contact Form

1. Go to [formspree.io](https://formspree.io) and create a free account
2. Create a new form — copy the **Form ID** (looks like `xbljkqpv`)
3. Open `components/ContactForm.tsx` and replace:
   ```ts
   const FORMSPREE_ID = 'YOUR_FORMSPREE_ID';
   // ↓
   const FORMSPREE_ID = 'xbljkqpv'; // your actual ID
   ```

---

## 🗂️ Project Structure

```
cleanlabel-ai/
├── app/
│   ├── layout.tsx          # Root layout (fonts, metadata)
│   ├── page.tsx            # Main dashboard page
│   ├── globals.css         # Global styles + Google Fonts
│   └── api/
│       └── analyze/
│           └── route.ts    # POST /api/analyze (calls Gemini AI)
│
├── components/
│   ├── Navbar.tsx          # Fixed top bar with history button
│   ├── HeroScanner.tsx     # Upload area (drag & drop)
│   ├── AnalysisView.tsx    # Results with animated background
│   ├── RedFlagsList.tsx    # Additive cards
│   ├── SwapCard.tsx        # Cleaner swap suggestion
│   ├── ScanHistory.tsx     # Sidebar with past scans
│   └── ContactForm.tsx     # Formspree-powered feedback form
│
├── lib/
│   ├── supabase.ts         # Supabase client + DB helpers
│   └── gemini.ts           # Gemini AI wrapper + system prompt
│
├── types/
│   └── index.ts            # TypeScript types + score metadata
│
├── .env.local.example      # Environment variable template
└── README.md
```

---

## 🔧 Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Animations | Framer Motion |
| AI | Google Gemini 1.5 Flash |
| Database | Supabase (PostgreSQL) |
| Storage | Supabase Storage |
| Forms | Formspree |
| Hosting | Vercel |

---

## 📸 Glow Score Guide

| Score | Meaning | Background |
|---|---|---|
| **A** | Clean — mostly whole, recognizable ingredients | Sage Green |
| **B** | Good — minimal additives | Pale Yellow |
| **C** | Fair — several processed ingredients | Pale Orange |
| **D** | Avoid — heavy industrial additives | Soft Crimson |

---

## 🐛 Troubleshooting

**"NEXT_PUBLIC_GEMINI_API_KEY is not configured"**
→ Make sure `.env.local` exists and has your Gemini API key.

**"Supabase error: relation 'scans' does not exist"**
→ Run the SQL setup script above in your Supabase SQL editor.

**Analysis returns an error**
→ Make sure the image is clear, well-lit, and the ingredient text is readable.

---

*Made with 🌿 CleanLabel AI*
