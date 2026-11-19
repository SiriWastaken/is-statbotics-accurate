import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

const title = "Is Statbotics Accurate? (Asking for a Drive Team)";
const description =
  "Enter an FRC event key and get a straight answer: did Statbotics call the qualification matches or not?";

export const metadata: Metadata = {
  metadataBase: new URL("https://is-statbotics-accurate.vercel.app"),
  title,
  description,
  openGraph: { title, description, url: "/", siteName: "Is Statbotics Accurate?", type: "website" },
  twitter: { card: "summary", title, description },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
      <body className="min-h-dvh font-sans">{children}</body>
    </html>
  );
}
