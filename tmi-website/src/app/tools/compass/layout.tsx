import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Akhirah Financial Compass — Islamic Investment Readiness Score | The Muslim Investor",
  description:
    "Discover your Islamic Investment Readiness Score (IISR). Built on three pillars: Zero Riba, a Financial Fortress, and a Strong Savings Rate. 100% private — your data never leaves your device.",
  keywords: [
    "Islamic finance",
    "halal investing",
    "Muslim investor",
    "Riba free",
    "Islamic investment readiness",
    "Shariah compliant",
    "halal portfolio",
    "Zakat calculator",
    "emergency fund Islam",
    "financial compass",
  ],
  openGraph: {
    title: "What's Your Islamic Investment Readiness Score?",
    description:
      "The TMI Akhirah Financial Compass measures whether your financial foundation is solid enough to begin halal investing. Zero Riba. Financial Fortress. Strong Savings.",
    url: "https://themuslim-investor.com/tools/compass",
    siteName: "The Muslim Investor",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "https://themuslim-investor.com/og-compass.png",
        width: 1200,
        height: 630,
        alt: "TMI Akhirah Financial Compass — Islamic Investment Readiness Score",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "What's Your Islamic Investment Readiness Score?",
    description:
      "Built on three non-negotiable pillars: Zero Riba, a Financial Fortress, and a Strong Savings Rate.",
    images: ["https://themuslim-investor.com/og-compass.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "https://themuslim-investor.com/tools/compass",
  },
};

export default function CompassLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
