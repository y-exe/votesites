import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "作品一覧・投票",
  description:
    "やまかわ動画編集大会のエントリー作品一覧と投票ページ。エントリーされた素晴らしい編集動画を視聴し、お気に入りの作品に投票しましょう！",
  alternates: {
    canonical: "https://event.ymkw.top/vote",
  },
  openGraph: {
    title: "作品一覧・投票 | やまかわ動画編集大会",
    description:
      "やまかわ動画編集大会のエントリー作品一覧と投票ページ。エントリーされた作品を視聴し、応援したい動画に投票しましょう！",
    url: "https://event.ymkw.top/vote",
  },
  twitter: {
    title: "作品一覧・投票 | やまかわ動画編集大会",
    description:
      "やまかわ動画編集大会のエントリー作品一覧と投票ページ。エントリーされた作品を視聴し、応援したい動画に投票しましょう！",
  },
};

export default function VoteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
