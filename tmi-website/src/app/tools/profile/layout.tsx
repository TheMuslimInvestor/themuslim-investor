import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Discover Your Islamic Investor Profile | The Muslim Investor",
  description:
    "A 35-question assessment that reveals your unique halal investor identity — from Fortress Builder to Growth Seeker. Free. Personalized. Akhirah-first.",
  openGraph: {
    title: "Discover Your Islamic Investor Profile",
    description:
      "A free 35-question assessment that reveals your halal investor identity with personalized Shariah-compliant fund recommendations.",
    type: "website",
    url: "https://themuslim-investor.com/tools/profile",
  },
  twitter: {
    card: "summary_large_image",
    title: "Discover Your Islamic Investor Profile | The Muslim Investor",
    description:
      "A free 35-question assessment that reveals your halal investor identity with personalized Shariah-compliant fund recommendations.",
  },
};

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
