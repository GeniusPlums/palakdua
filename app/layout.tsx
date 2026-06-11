import type { Metadata } from "next";
import { loadPortfolioMeta } from "@/lib/portfolio";
import "./globals.css";

const meta = loadPortfolioMeta();

export const metadata: Metadata = {
  title: meta.title,
  description: meta.description,
  openGraph: {
    title: meta.ogTitle || meta.title,
    description: meta.ogDescription || meta.description,
    type: "website",
  },
  ...(meta.icon
    ? {
        icons: {
          icon: meta.icon,
        },
      }
    : {}),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Static CSS avoids Turbopack choking on embedded base64 image URLs */}
        {/* eslint-disable-next-line @next/next/no-css-tags */}
        <link rel="stylesheet" href="/portfolio.css" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Manrope:wght@400;500;600;700;800&family=Caveat:wght@500;600;700&family=Kalam:wght@400;700&family=JetBrains+Mono:wght@500;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
