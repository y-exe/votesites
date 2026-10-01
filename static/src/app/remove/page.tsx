import Link from "next/link";

export default function RemovePage() {
  return (
    <main className="min-h-screen bg-[#111] px-6 py-24 text-white">
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-sm tracking-[0.2em] text-white/55">YAMAKAWA VIDEO EDITING CONTEST</p>
        <h1 className="mt-5 text-4xl font-black">動画削除申請</h1>
        <p className="mt-8 text-lg leading-8 text-white/80">大会は終了したため、この静的アーカイブでは削除申請の受付を終了しています。</p>
        <Link href="/" className="mt-10 inline-block rounded-full bg-white px-6 py-3 font-bold text-black">トップページへ戻る</Link>
      </div>
    </main>
  );
}
