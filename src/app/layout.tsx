import type { Metadata } from "next";
import "lenis/dist/lenis.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "やまかわ動画編集大会",
  description: "やまかわてるきの動画編集大会投票・エントリーサイトです。",
  metadataBase: new URL("https://event.ymkw.top"),
  openGraph: {
    title: "やまかわ動画編集大会",
    description: "やまかわてるきの動画編集大会投票・エントリーサイトです。",
    url: "https://event.ymkw.top",
    siteName: "やまかわ動画編集大会",
    images: [
      {
        url: "/ogp/ogp.png",
        width: 1200,
        height: 630,
        alt: "やまかわ動画編集大会",
      },
    ],
    locale: "ja_JP",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "やまかわ動画編集大会",
    description: "やまかわてるきの動画編集大会投票・エントリーサイトです。",
    images: ["/ogp/ogp.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
