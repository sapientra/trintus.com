import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Trintus — Autonomous Operations Software",
  description:
    "AI operators that investigate operational incidents automatically — gathering evidence, analyzing activity, and preparing recommendations across risk, compliance, and security workflows.",
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.className} dark`}>
      <head>
        <script type="text/javascript" src="https://assets.calendly.com/assets/external/widget.js" async />
      </head>
      <body>{children}</body>
    </html>
  );
}
