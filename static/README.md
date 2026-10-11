# 結果発表サイト

保存済みの結果・作品データを静的ページとして配信します。結果表示にDBやAPIは使いません。

## 開発

Bun 1.3.14を使用します。

```bash
bun install --frozen-lockfile
bun run dev
bun run build:bun
```

`build:bun` は `src/data/` の保存済みデータを使用します。結果を更新する場合は、ローカルDBとCSVを用意して `bun run snapshot` を実行し、更新したJSONをコミットします。`private-data/` は公開しません。

## Cloudflare

- ビルドルート: `static`
- ビルド: `npm run build:cloudflare`
- デプロイ: `npx wrangler deploy`

依存変更時は `bun.lock` と `package-lock.json` を更新してください。
