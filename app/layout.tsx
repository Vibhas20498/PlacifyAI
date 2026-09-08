import type { Metadata } from 'next';
import './globals.css';
import { UserProvider } from '@/lib/store/user-context';

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
    <html lang="en" className="bg-white text-black">
      <body className="min-h-screen bg-white text-black antialiased">
        <UserProvider>
          {children}
        </UserProvider>
      </body>
    </html>
  );
}
