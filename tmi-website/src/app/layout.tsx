import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'The Muslim Investor | Akhirah-First Wealth Building — Prepare Your Answer for the Day of Judgment',
  description: 'Your portfolio will testify. Either for you or against you. Professional Islamic finance education from a $500M fund manager to purify your wealth, prepare your answer for the Day of Judgment, and maximize your Sadaqah capacity. $9/month.',
  keywords: 'halal investing, Islamic finance, Muslim investor, Shariah compliant, Sukuk, Akhirah, halal portfolio, Riba free, Zakat calculator',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="font-poppins">{children}</body>
    </html>
  );
}
