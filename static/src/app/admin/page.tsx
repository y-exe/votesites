import Link from "next/link";

export const metadata = { robots: { index: false, follow: false } };

export default function AdminPage() {
  return (
    <main className="min-h-screen bg-[#111] px-6 py-24 text-white">
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="text-4xl font-black">管理画面</h1>
        <p className="mt-8 text-lg leading-8 text-white/80">この公開用の静的サイトでは、投票者情報・管理機能は公開していません。</p>
        <Link href="/" className="mt-10 inline-block rounded-full bg-white px-6 py-3 font-bold text-black">トップページへ戻る</Link>
      </div>
    </main>
  );
}
