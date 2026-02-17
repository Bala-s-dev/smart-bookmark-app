// src/app/layout.tsx
import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/navbar';

export const metadata: Metadata = {
  title: 'Smart Bookmark',
  description: 'Secure, real-time link management',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // Add suppressHydrationWarning to handle browser extensions and theme classes
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className="bg-[#020617] text-slate-200 antialiased min-h-screen selection:bg-blue-500/30">
        <Navbar />
        {/* Ensure the structure is stable between server and client */}
        <main className="max-w-6xl mx-auto px-6 py-12">{children}</main>
      </body>
    </html>
  );
}
