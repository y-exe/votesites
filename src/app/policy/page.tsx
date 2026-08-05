import localFont from "next/font/local";
import Image from "next/image";
import Link from "next/link";

const lineSeedExtraBold = localFont({
  src: "../fonts/LINESeedJP-ExtraBold.ttf",
  display: "swap",
});

export const metadata = {
  title: "プライバシーポリシー",
  description: "やまかわ動画編集大会投票サイトのプライバシーポリシー（個人情報の収集・利用目的・免責事項等）です。",
  alternates: {
    canonical: "https://event.ymkw.top/policy",
  },
  openGraph: {
    title: "プライバシーポリシー | やまかわ動画編集大会",
    description: "やまかわ動画編集大会投票サイトのプライバシーポリシーです。",
    url: "https://event.ymkw.top/policy",
  },
};

export default function PolicyPage() {
  return (
    <>
      <main
        className={`${lineSeedExtraBold.className} min-h-screen bg-black text-white px-6 pt-16 pb-24 leading-[1.8]`}
      >
        <div className="max-w-[800px] mx-auto">
          <h1
            className={`${lineSeedExtraBold.className} text-[2.2rem] mb-8 border-b border-[#333333] pb-4 font-inherit`}
          >
            プライバシーポリシー
          </h1>

          <section className="mb-10">
            <h2
              className={`${lineSeedExtraBold.className} text-[1.3rem] mb-4 font-inherit`}
            >
              1. 個人情報の収集・取得
            </h2>
            <p className="opacity-90 font-inherit">
              本サイト（やまかわてるき動画編集大会投票サイト）では、公平な投票実施および不正防止、お問い合わせ対応等のため、以下の情報を取得する場合があります。
            </p>
            <ul className="pl-6 mt-2 opacity-85 font-inherit list-disc">
              <li>Discord連携ログイン時に提供されるアカウント情報（ユーザーID、ユーザー名、アバター画像URL等）</li>
              <li>アクセスログ、IPアドレス、ブラウザ情報</li>
              <li>GoogleAnalyticsにより収集されるトラフィックデータおよびCookie情報</li>
              <li>投票履歴および通報履歴</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2
              className={`${lineSeedExtraBold.className} text-[1.3rem] mb-4 font-inherit`}
            >
              2. 情報の利用目的
            </h2>
            <p className="opacity-90 font-inherit">取得した情報は、以下の目的のみに使用します。</p>
            <ul className="pl-6 mt-2 opacity-85 font-inherit list-disc">
              <li>投票の重複防止および不正投票の監視・防止のため</li>
              <li>エントリー動画への通報機能における重複制限および適切なサイト管理のため</li>
              <li>サイトのアクセス状況の計測・分析および保守管理・サービス向上のため</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2
              className={`${lineSeedExtraBold.className} text-[1.3rem] mb-4 font-inherit`}
            >
              3. データの安全管理と第三者提供
            </h2>
            <p className="opacity-90 font-inherit">
              取得した個人情報およびアクセスデータは、漏洩や不正アクセスの防止に努め、厳重に管理します。法令に基づく場合を除き、事前の同意を得ることなく第三者に提供することはありません。
            </p>
          </section>

          <section className="mb-10">
            <h2
              className={`${lineSeedExtraBold.className} text-[1.3rem] mb-4 font-inherit`}
            >
              4. Cookieおよびアクセス解析ツールの利用
            </h2>
            <p className="opacity-90 font-inherit">
              本サイトでは、ログイン状態の維持やコンテンツの適切な提供、およびサイトの利用状況把握のために Cookie およびローカルストレージを使用しています。
            </p>
            <p className="opacity-90 mt-3 font-inherit">
              また、サイトの利用状況の計測・分析のため、GoogleAnalyticsを利用しています。
            </p>
            <p className="opacity-90 mt-3 font-inherit">
              お客様はブラウザの設定によりCookieを無効にすることで、データ収集を拒否することができます。GoogleAnalyticsのデータ収集・処理の仕組みやプライバシーポリシーの詳細は、
              <a
                href="https://policies.google.com/technologies/partner-sites?hl=ja"
                target="_blank"
                rel="noreferrer"
                className="text-white underline mx-1"
              >
                Googleポリシーと規約ページ
              </a>
              および
              <a
                href="https://marketingplatform.google.com/about/analytics/terms/jp/"
                target="_blank"
                rel="noreferrer"
                className="text-white underline ml-1"
              >
                Google アナリティクス利用規約
              </a>
              をご確認ください。
            </p>
          </section>

          <section className="mb-10">
            <h2
              className={`${lineSeedExtraBold.className} text-[1.3rem] mb-4 font-inherit`}
            >
              5. 免責事項
            </h2>
            <p className="opacity-90 font-inherit">
              本サイトに掲載されているコンテンツや情報について、可能な限り正確な情報を掲載するよう努めておりますが、正確性や安全性を保証するものではありません。本サイトの利用によって生じた損害等について、運営・管理側は一切の責任を負いかねます。
            </p>
          </section>

          <section className="mb-12">
            <h2
              className={`${lineSeedExtraBold.className} text-[1.3rem] mb-4 font-inherit`}
            >
              6. お問い合わせ
            </h2>
            <p className="opacity-90 font-inherit">
              プライバシーポリシーに関するお問い合わせは、やまかわてるき（@YamakawaTeruki）のXのDMまでご連絡ください。
            </p>
          </section>

          <div className="mt-16 pt-8 border-t border-[#333333]">
            <Link
              href="/"
              className={`${lineSeedExtraBold.className} text-white underline text-base font-inherit`}
            >
              ← トップページに戻る
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
