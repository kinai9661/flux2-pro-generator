import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'FLUX.2 Pro Generator - AI Image Generation',
  description: 'Advanced AI image generation powered by Cloudflare Workers AI and FLUX.2',
  keywords: 'AI, image generation, FLUX.2, Cloudflare Workers AI',
};

export default function RootLayout({
  children,
}: {
  children: React.Node;
}) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
