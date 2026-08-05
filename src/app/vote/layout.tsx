import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "作品一覧・投票",
  description: "やまかわてるきの動画編集大会投票・エントリーサイトです。",
  alternates: {
    canonical: "https://event.ymkw.top/vote",
  },
  openGraph: {
    title: "作品一覧・投票 | やまかわ動画編集大会",
    description: "やまかわてるきの動画編集大会投票・エントリーサイトです。",
    url: "https://event.ymkw.top/vote",
  },
  twitter: {
    title: "作品一覧・投票 | やまかわ動画編集大会",
    description: "やまかわてるきの動画編集大会投票・エントリーサイトです。",
  },
};

export default function VoteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
