import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { UserProvider } from '@/lib/store/user-context';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
  weight: ['300', '400', '500', '600', '700', '800'],
});

export const metadata: Metadata = {
  title: 'Placify AI — Precision Career Intelligence & Placement Analytics',
  description: 'AI-powered, explainable placement probability estimation, skill gap analysis, and grounded career roadmaps.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen bg-white text-black antialiased font-sans">
        <UserProvider>
          {children}
        </UserProvider>
      </body>
    </html>
  );
}
