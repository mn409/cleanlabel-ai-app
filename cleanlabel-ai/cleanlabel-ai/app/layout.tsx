// app/layout.tsx
// Root layout — wraps every page. Includes Navbar and font config.

import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'CleanLabel AI — Know What You Eat',
  description:
    'Instantly decode any food ingredient list. Get a Glow Score, identify hidden additives, and discover cleaner swaps — powered by AI.',
  keywords: ['food label', 'ingredient analysis', 'clean eating', 'food additives', 'nutrition'],
  openGraph: {
    title: 'CleanLabel AI',
    description: 'Decode food labels instantly with AI',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="grain">
        {children}
      </body>
    </html>
  );
}
