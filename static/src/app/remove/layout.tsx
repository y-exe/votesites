import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "動画削除申請",
  robots: { index: false, follow: false },
};

export default function RemoveLayout({ children }: { children: React.ReactNode }) {
  return children;
}
