<div align="center">
<h1>
  編集大会投票サイト

  [![Next.js 16.3.0](https://img.shields.io/badge/Next.js-16.3.0-000000?style=flat-square&logo=next.js&logoColor=white)](https://nextjs.org/)
  [![React 19.2.8](https://img.shields.io/badge/React-19.2.8-61DAFB?style=flat-square&logo=react&logoColor=white)](https://react.dev/)
  [![Cloudflare Workers](https://img.shields.io/badge/Cloudflare-Workers-F38020?style=flat-square&logo=cloudflare&logoColor=white)](https://workers.cloudflare.com/)
  [![Cloudflare D1](https://img.shields.io/badge/Cloudflare-D1-F38020?style=flat-square&logo=cloudflare&logoColor=white)](https://developers.cloudflare.com/d1/)
  [![License GPL-3.0](https://img.shields.io/badge/LICENSE-GPL--3.0-green.svg?style=flat-square)](LICENSE)
</h1>
期間限定の大会のサイトです！！<br>
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

投票システムを全てWebで完結させるための仕組みが欲しかったため<br>
大会の説明だけでなく、素材配布・Googleフォームでのエントリー・応募作品の投票まで、このサイトだけで完結できるようにしてます

## 特徴など...

- **大会ページ:** 開催要項、賞金、Q&A、使用可能な編集ソフトなどを掲載。
- **自動作品掲載:** Googleフォームに送信されたYouTube動画を、GAS経由で反映。
- **OAuth2:** Discordでログインしたユーザーのみ投票可。
- **DB:** 投票先はD1に保存され、あとから別の作品へ移動できます。
- **通報・削除申請:** 通報した動画や、`/remove` でメール認証して削除申請された動画は、スプレッドシートを変更せずD1側で非表示にできます。削除済み動画は`/report`の通報管理ダッシュボードから確認できます。

## 投票仕組み

OAuth2で本人確認した後IDと投票したYouTube動画IDのみをD1へ保存します。<br>
投票APIは署名済みセッション、同一Origin、動画ID、実在する応募作品を検証してから書き込みます。D1へブラウザーから直接接続する公開経路はありません。

削除申請では、Googleフォームに入力したメールアドレスへ5桁の確認コードを送信します。確認できた応募動画のみが非表示になります。

## ディレクトリ構成

```text
src/
├── app/                    # ホーム・投票ページ・Route Handlers
├── data/                   # 大会情報
└── lib/                    # Discord認証・応募作品取得・通報/削除処理
migrations/                 # Cloudflare D1のマイグレーション
public/                     # 画像・動画・編集ソフトのアイコン
wrangler.jsonc              # Cloudflare Workers / D1設定
open-next.config.ts          # OpenNext for Cloudflare設定
```

## 導入手順

### 環境変数

```bash
cp .env.example .env.local
```

```env
ENTRY_FEED_URL=
ENTRY_LOOKUP_SECRET=
YOUTUBE_API_KEY=（任意・YouTube Data API v3）
REMOVE_CODE_SECRET=（32文字以上のランダムな値）
RESEND_API_KEY=
RESEND_EMAIL_FROM=event@ymkw.top
DISCORD_CLIENT_ID=
DISCORD_CLIENT_SECRET=
AUTH_SECRET=（32文字以上のランダムな値）
REPORT_PASSWORD_HASH=
DISCORD_REDIRECT_URI=http://localhost:3000/api/auth/discord/callback
```

## Workersへデプロイ

```bash
npx wrangler d1 migrations apply votesites-db --remote
npm run deploy
```

## ライセンス

[GPL-3.0](LICENSE)

---

© 2026 ymkw.top
