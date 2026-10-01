# Vote-static

結果確定後のための完全静的な結果発表サイトです。

- 結果データは `src/data/results.json` にビルド時スナップショットとして保存されます。
- 作品一覧は、メールアドレス等を含まない `src/data/entries.json` に保存されます。
- 全D1テーブルと提供CSV原本は、公開対象外の `private-data/` にのみ保存されます。`out/` には含まれません。
- `/results` は D1、Worker、WebSocket、結果APIを呼び出しません。
- `npm run build` 後の `out/` を Cloudflare Workers の静的アセットとして配信します。

更新したい場合だけ、元データを持つ `C:\Code\Vote` の `votes.db` を更新してから `npm run snapshot` を実行します。

Cloudflare Workers Buildsでは、リポジトリのルートディレクトリを `static`、ビルドコマンドを `npm run build:cloudflare`、デプロイコマンドを `npx wrangler deploy` に設定します。Workers上ではローカルの投票DBを使えないため、結果を更新したときはローカルで `npm run snapshot` を実行し、更新された `src/data/results.json` と `src/data/entries.json` をコミットしてからプッシュしてください。
