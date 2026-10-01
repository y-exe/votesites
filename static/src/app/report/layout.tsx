import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "通報管理",
  robots: {
    index: false,
    follow: false,
    googleBot: { index: false, follow: false },
  },
};

export default function ReportLayout({ children }: { children: React.ReactNode }) {
  return children;
}
