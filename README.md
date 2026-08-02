<div align="center">
<h1>
  YAMAKAWA 編集大会 投票サイト

  [![Next.js 16.2.12](https://img.shields.io/badge/Next.js-16.2.12-000000?style=flat-square&logo=next.js&logoColor=white)](https://nextjs.org/)
  [![React 19.2.4](https://img.shields.io/badge/React-19.2.4-61DAFB?style=flat-square&logo=react&logoColor=white)](https://react.dev/)
  [![Cloudflare Workers](https://img.shields.io/badge/Cloudflare-Workers-F38020?style=flat-square&logo=cloudflare&logoColor=white)](https://workers.cloudflare.com/)
  [![Cloudflare D1](https://img.shields.io/badge/Cloudflare-D1-F38020?style=flat-square&logo=cloudflare&logoColor=white)](https://developers.cloudflare.com/d1/)
  [![License GPL-3.0](https://img.shields.io/badge/LICENSE-GPL--3.0-green.svg?style=flat-square)](LICENSE)
</h1>
指定された動画を、自由な世界観でおもしろく編集する大会の公式サイト！！<br>
開催要項、エントリー、応募動画の閲覧・投票までを1つにまとめています。<br>
<br>

<a href="https://event.ymkw.top">
  <img src="public/site.png" alt="YAMAKAWA 編集大会 投票サイト">
</a>
<br>
<sub><a href="https://event.ymkw.top">event.ymkw.top</a></sub>
</div>
<br/>

## なんのためにつくった...?

動画編集が好きな人たちの作品を集め、面白い編集者を見つけるため！！<br>
大会の説明だけでなく、素材配布・Googleフォームでのエントリー・応募作品の投票まで、このサイトだけで完結できるように作りました。

## 特徴など...

- **大会ページ:** 開催要項、賞金、Q&A、使用可能な編集ソフトなどを掲載。
- **自動作品掲載:** Googleフォームに送信されたYouTube動画を、Google Apps Script経由で投票ページへ反映。
- **動画プレビュー:** サムネイルを押すとYouTube動画をポップアップで再生。
- **Discord OAuth2:** Discordアカウントでログインしたユーザーだけが投票可能。
- **1アカウント1票:** 投票先はCloudflare D1に保存され、あとから別の作品へ移動できます。
- **アニメーション:** Three.jsの3Dモデル、スクロール演出、動画を使った文字などをPC・スマホの両方に対応。

## 投票の仕組み

Discord OAuth2で本人確認したあと、Discord IDと投票したYouTube動画IDのみをD1へ保存します。<br>
投票APIは署名済みセッション、同一Origin、動画ID、実在する応募作品を検証してから書き込みます。D1へブラウザーから直接接続する公開経路はありません。

## ディレクトリ構成

```text
src/
├── app/                    # ホーム・投票ページ・Route Handlers
├── data/                   # 大会情報
└── lib/                    # Discord認証・応募作品取得
migrations/                # Cloudflare D1のマイグレーション
public/                     # 画像・動画・編集ソフトのアイコン
wrangler.jsonc             # Cloudflare Workers / D1設定
open-next.config.ts        # OpenNext for Cloudflare設定
```

## 導入手順

### ライブラリ

```bash
npm install
```

### 環境変数

```bash
cp .env.example .env.local
```

```env
ENTRY_FEED_URL=
DISCORD_CLIENT_ID=
DISCORD_CLIENT_SECRET=
AUTH_SECRET=
DISCORD_REDIRECT_URI=http://localhost:3000/api/auth/discord/callback
```

`AUTH_SECRET`には32文字以上のランダムな値を設定します。実値はGitへコミットしないでください。

### 開発

```bash
npm run dev
```

Cloudflare Workersと同じ環境で確認する場合は、OpenNextのプレビューを使用します。

```bash
npm run preview
```

## Cloudflare Workersへデプロイ

D1のマイグレーションを適用してからデプロイします。

```bash
npx wrangler d1 migrations apply votesites-db --remote
npm run deploy
```

本番用のOAuth2情報と`AUTH_SECRET`は、Cloudflare Workersの環境変数またはSecretとして設定してください。

## ライセンス

[GPL-3.0](LICENSE)

---

© 2026 ymkw.top
