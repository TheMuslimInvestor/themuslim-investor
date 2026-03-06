import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'TMI Mission Pledge — The Muslim Investor',
  description:
    'Sign your covenant with Allah. The TMI Mission Pledge is the first step in preparing your answer for the Day of Judgment through your wealth.',
  openGraph: {
    title: 'TMI Mission Pledge — The Muslim Investor',
    description:
      'Sign your covenant with Allah. The TMI Mission Pledge is the first step in preparing your answer for the Day of Judgment through your wealth.',
    url: 'https://themuslim-investor.com/pledge',
    siteName: 'The Muslim Investor',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TMI Mission Pledge — The Muslim Investor',
    description:
      'Sign your covenant with Allah. The TMI Mission Pledge is the first step in preparing your answer for the Day of Judgment.',
  },
};

export default function PledgeLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
