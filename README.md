# YAMAKAWA編集大会

編集大会の案内・エントリー作品・投票を提供する Next.js サイトです。

本番URL: https://event.ymkw.top

## ローカル開発

```bash
npm install
cp .env.example .env.local
npm run dev
```

`.env.local` に Google Apps Script の応募作品フィードと Discord OAuth2 の設定を入力してください。実値はGitへコミットしません。

## 検証

```bash
npm run lint
npm run build
npm run preview
```

`preview` は OpenNext でビルドし、Cloudflare Workers と同じ `workerd` 環境で起動します。

## Cloudflare Workers

フロントエンドの静的ファイルは Workers Static Assets、Next.js の Route Handlers は同一のWorkerで配信します。

```bash
npm run deploy
```

本番環境では `ENTRY_FEED_URL`、`DISCORD_CLIENT_ID`、`DISCORD_CLIENT_SECRET`、`AUTH_SECRET`、`DISCORD_REDIRECT_URI` をWorkerの環境変数またはSecretとして設定してください。
