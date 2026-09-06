export const metadata = {
  title: "投票結果",
  description: "やまかわ動画編集大会の投票結果です。",
  alternates: {
    canonical: "https://event.ymkw.top/results",
  },
  openGraph: {
    title: "投票結果 | やまかわ動画編集大会",
    description: "やまかわ動画編集大会の投票結果です。",
    url: "https://event.ymkw.top/results",
    images: [
      {
        url: "/ogp/ogp2.png",
        width: 1200,
        height: 630,
        alt: "やまかわ動画編集大会 投票結果",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/ogp/ogp2.png"],
  },
};

export default function ResultsLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
