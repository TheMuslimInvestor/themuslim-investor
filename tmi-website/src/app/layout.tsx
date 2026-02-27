import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'The Muslim Investor | Akhirah-First Wealth Building',
  description: 'Prepare for the Day of Judgment with confidence. Learn to build Halal wealth, purify your portfolio from Riba, and use your money as a tool for your Akhirah.',
  keywords: 'halal investing, Islamic finance, Muslim investor, Shariah compliant, Sukuk, Akhirah, halal portfolio',
  openGraph: {
    title: 'The Muslim Investor | Akhirah-First Wealth Building',
    description: 'Your wealth is an Amanah. Learn to invest it purely, profitably, and with purpose.',
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
      <body>{children}</body>
    </html>
  );
}
