import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'The Muslim Investor | Akhirah-First Wealth Building',
  description: 'Your portfolio will testify. Either for you or against you. Professional Islamic finance education to purify your wealth, prepare your answer for the Day of Judgment, and maximize your Sadaqah capacity.',
  keywords: 'halal investing, Islamic finance, Muslim investor, Shariah compliant, Sukuk, Akhirah, halal portfolio, Riba free',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="font-poppins">{children}</body>
    </html>
  );
}
