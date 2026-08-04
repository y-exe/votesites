import localFont from "next/font/local";
import Image from "next/image";
import Link from "next/link";

const lineSeedExtraBold = localFont({
  src: "../fonts/LINESeedJP-ExtraBold.ttf",
  display: "swap",
});

export const metadata = {
  title: "プライバシーポリシー | やまかわてるき動画編集大会",
  description: "やまかわてるき動画編集大会投票サイトのプライバシーポリシーです。",
};

export default function PolicyPage() {
  return (
    <>
      <main
        className={lineSeedExtraBold.className}
        style={{
          minHeight: "100vh",
          backgroundColor: "#000000",
          color: "#ffffff",
          padding: "4rem 1.5rem 6rem",
          lineHeight: 1.8,
          fontFamily: lineSeedExtraBold.style.fontFamily,
        }}
      >
        <div style={{ maxWidth: "800px", margin: "0 auto" }}>
          <h1
            className={lineSeedExtraBold.className}
            style={{
              fontSize: "2.2rem",
              marginBottom: "2rem",
              borderBottom: "1px solid #333333",
              paddingBottom: "1rem",
              fontFamily: "inherit",
            }}
          >
            プライバシーポリシー
          </h1>

          <section style={{ marginBottom: "2.5rem" }}>
            <h2
              className={lineSeedExtraBold.className}
              style={{ fontSize: "1.3rem", marginBottom: "1rem", fontFamily: "inherit" }}
            >
              1. 個人情報の収集・取得
            </h2>
            <p style={{ opacity: 0.9, fontFamily: "inherit" }}>
              本サイト（やまかわてるき動画編集大会投票サイト）では、公平な投票実施および不正防止、お問い合わせ対応等のため、以下の情報を取得する場合があります。
            </p>
            <ul style={{ paddingLeft: "1.5rem", marginTop: "0.5rem", opacity: 0.85, fontFamily: "inherit" }}>
              <li>Discord連携ログイン時に提供されるアカウント情報（ユーザーID、ユーザー名、アバター画像URL等）</li>
              <li>アクセスログ、IPアドレス、ブラウザ情報</li>
              <li>投票履歴および通報履歴</li>
            </ul>
          </section>

          <section style={{ marginBottom: "2.5rem" }}>
            <h2
              className={lineSeedExtraBold.className}
              style={{ fontSize: "1.3rem", marginBottom: "1rem", fontFamily: "inherit" }}
            >
              2. 情報の利用目的
            </h2>
            <p style={{ opacity: 0.9, fontFamily: "inherit" }}>取得した情報は、以下の目的のみに使用します。</p>
            <ul style={{ paddingLeft: "1.5rem", marginTop: "0.5rem", opacity: 0.85, fontFamily: "inherit" }}>
              <li>投票の重複防止および不正投票の監視・防止のため</li>
              <li>エントリー動画への通報機能における重複制限および適切なサイト管理のため</li>
              <li>サイトの利用状況の把握および保守管理・サービス向上のため</li>
            </ul>
          </section>

          <section style={{ marginBottom: "2.5rem" }}>
            <h2
              className={lineSeedExtraBold.className}
              style={{ fontSize: "1.3rem", marginBottom: "1rem", fontFamily: "inherit" }}
            >
              3. データの安全管理と第三者提供
            </h2>
            <p style={{ opacity: 0.9, fontFamily: "inherit" }}>
              取得した個人情報およびアクセスデータは、漏洩や不正アクセスの防止に努め、厳重に管理します。法令に基づく場合を除き、事前の同意を得ることなく第三者に提供することはありません。
            </p>
          </section>

          <section style={{ marginBottom: "2.5rem" }}>
            <h2
              className={lineSeedExtraBold.className}
              style={{ fontSize: "1.3rem", marginBottom: "1rem", fontFamily: "inherit" }}
            >
              4. Cookieおよびローカルストレージの利用
            </h2>
            <p style={{ opacity: 0.9, fontFamily: "inherit" }}>
              本サイトでは、ログイン状態の維持や適切なサービス提供のため、Cookieおよびローカルストレージを使用しています。ブラウザの設定により拒否することも可能ですが、一部機能がご利用いただけなくなる場合があります。
            </p>
          </section>

          <section style={{ marginBottom: "2.5rem" }}>
            <h2
              className={lineSeedExtraBold.className}
              style={{ fontSize: "1.3rem", marginBottom: "1rem", fontFamily: "inherit" }}
            >
              5. 免責事項
            </h2>
            <p style={{ opacity: 0.9, fontFamily: "inherit" }}>
              本サイトに掲載されているコンテンツや情報について、可能な限り正確な情報を掲載するよう努めておりますが、正確性や安全性を保証するものではありません。本サイトの利用によって生じた損害等について、運営側は一切の責任を負いかねます。
            </p>
          </section>

          <section style={{ marginBottom: "3rem" }}>
            <h2
              className={lineSeedExtraBold.className}
              style={{ fontSize: "1.3rem", marginBottom: "1rem", fontFamily: "inherit" }}
            >
              6. お問い合わせ
            </h2>
            <p style={{ opacity: 0.9, fontFamily: "inherit" }}>
              プライバシーポリシーに関するお問い合わせは、やまかわてるき（@YamakawaTeruki）のXのDMまでご連絡ください。
            </p>
          </section>

          <div style={{ marginTop: "4rem", paddingTop: "2rem", borderTop: "1px solid #333333" }}>
            <Link
              href="/"
              className={lineSeedExtraBold.className}
              style={{
                color: "#ffffff",
                textDecoration: "underline",
                fontSize: "1rem",
                fontFamily: "inherit",
              }}
            >
              ← トップページに戻る
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
