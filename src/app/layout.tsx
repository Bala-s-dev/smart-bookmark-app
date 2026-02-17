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
    <html lang="en" className="dark">
      <body className="bg-[#020617] text-slate-200 antialiased min-h-screen">
        <Navbar />
        <main className="max-w-6xl mx-auto px-4 py-12">{children}</main>
      </body>
    </html>
  );
}
