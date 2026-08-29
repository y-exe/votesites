import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "投票データ管理",
  robots: {
    index: false,
    follow: false,
    googleBot: { index: false, follow: false },
  },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return children;
}
