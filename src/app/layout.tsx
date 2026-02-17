import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/navbar';


export const metadata: Metadata = {
  title: {
    default: 'Smart Bookmark',
    template: '%s | Smart Bookmark',
  },
  description: 'A secure, real-time manager for your favorite links.',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-8">
          {children}
        </main>
      </body>
    </html>
  );
}
