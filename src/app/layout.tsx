import type { Metadata } from "next";
import "lenis/dist/lenis.css";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "やまかわ動画編集大会 | 投票・エントリーサイト",
    template: "%s | やまかわ動画編集大会",
  },
  description:
    "やまかわてるき主催の動画編集大会・切り抜きコンテスト公式サイト。投稿された個性豊かな編集動画を視聴し、応援したい作品に投票しましょう！",
  keywords: [
    "やまかわてるき",
    "動画編集大会",
    "動画コンテスト",
    "切り抜き動画",
    "YouTube",
    "動画編集",
    "投票",
    "エントリー",
  ],
  metadataBase: new URL("https://event.ymkw.top"),
  alternates: {
    canonical: "https://event.ymkw.top",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    title: "やまかわ動画編集大会 | 投票・エントリーサイト",
    description:
      "やまかわてるき主催の動画編集大会・切り抜きコンテスト公式サイト。投稿された作品を視聴し、推しの動画に投票しよう！",
    url: "https://event.ymkw.top",
    siteName: "やまかわ動画編集大会",
    images: [
      {
        url: "/ogp/ogp.png",
        width: 1200,
        height: 630,
        alt: "やまかわ動画編集大会 メインビジュアル",
      },
    ],
    locale: "ja_JP",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "やまかわ動画編集大会 | 投票・エントリーサイト",
    description:
      "やまかわてるき主催の動画編集大会・切り抜きコンテスト公式サイト。投稿された作品を視聴し、推しの動画に投票しよう！",
    images: ["/ogp/ogp.png"],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": "https://event.ymkw.top/#website",
      "url": "https://event.ymkw.top",
      "name": "やまかわ動画編集大会",
      "description": "やまかわてるきの動画編集大会投票・エントリーサイトです。",
      "inLanguage": "ja-JP",
    },
    {
      "@type": "Event",
      "@id": "https://event.ymkw.top/#event",
      "name": "やまかわ動画編集大会",
      "description": "やまかわてるきの動画素材を使用した動画編集コンテスト＆ユーザー投票イベント",
      "eventAttendanceMode": "https://schema.org/OnlineEventAttendanceMode",
      "eventStatus": "https://schema.org/EventScheduled",
      "location": {
        "@type": "VirtualLocation",
        "url": "https://event.ymkw.top",
      },
      "organizer": {
        "@type": "Person",
        "name": "やまかわてるき",
        "url": "https://x.com/YamakawaTeruki",
      },
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
