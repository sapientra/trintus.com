import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Trintus — Investigation infrastructure for financial institutions",
  description:
    "Trintus identifies liquidity risk, coordinated accounts, suspicious activity, and account takeovers — then delivers investigation-ready findings analysts can review, defend, and act on.",
  openGraph: {
    title: "Trintus — Investigation infrastructure for financial institutions",
    description:
      "Risk Operations Intelligence for regulated finance. Built for brokers, prop firms, and fintechs.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Trintus — Investigation infrastructure for financial institutions",
    description:
      "Risk Operations Intelligence for regulated finance. Built for brokers, prop firms, and fintechs.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="color-scheme" content="dark" />
        <meta name="theme-color" content="#1a1a1d" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
        <link
          rel="icon"
          href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'><rect width='32' height='32' rx='6' fill='%231a1a1d'/><rect x='8' y='8' width='16' height='16' rx='3' fill='none' stroke='%23e85d3a' stroke-width='2'/><circle cx='16' cy='16' r='3' fill='%23e85d3a'/></svg>"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
