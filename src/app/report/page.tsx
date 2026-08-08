"use client";

import { useState } from "react";

type ReportSummary = {
  videoId: string;
  count: number;
  lastReportedAt: number;
  isHidden: boolean;
};

type RemovalSummary = {
  videoId: string;
  removedAt: number;
  isHidden: boolean;
};

type AdminResponse = {
  success?: boolean;
  reports?: ReportSummary[];
  removals?: RemovalSummary[];
  error?: string;
};

export default function ReportAdminPage() {
  const [password, setPassword] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [reports, setReports] = useState<ReportSummary[]>([]);
  const [removals, setRemovals] = useState<RemovalSummary[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function applyResponse(data: AdminResponse) {
    if (Array.isArray(data.reports)) setReports(data.reports);
    if (Array.isArray(data.removals)) setRemovals(data.removals);
  }

  async function handleLogin(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const response = await fetch("/api/report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "list", password }),
      });
      const data = (await response.json()) as AdminResponse;
      if (response.ok && data.success && Array.isArray(data.reports)) {
        setAuthenticated(true);
        applyResponse(data);
      } else {
        setError(data.error === "unauthorized" ? "パスワードが違います。" : "エラーが発生しました。");
      }
    } catch {
      setError("通信エラーが発生しました。");
    } finally {
      setLoading(false);
    }
  }

  async function handleToggleHide(videoId: string, currentHidden: boolean) {
    setError(null);
    try {
      const response = await fetch("/api/report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "toggle-hide",
          password,
          videoId,
          hide: !currentHidden,
        }),
      });
      const data = (await response.json()) as AdminResponse;
      if (response.ok && data.success) applyResponse(data);
      else window.alert("操作に失敗しました。");
    } catch {
      window.alert("通信エラーが発生しました。");
    }
  }

  if (!authenticated) {
    return (
      <main className="min-h-screen bg-white p-8 font-sans text-black">
        <h1 className="mb-2 text-2xl font-bold">通報管理ページ</h1>
        <p className="text-neutral-600">管理用パスワードを入力してください。</p>
        <form onSubmit={handleLogin} className="mt-4 flex items-center gap-2">
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="パスワード"
            className="rounded border border-neutral-300 p-2 text-base outline-none focus:ring-2 focus:ring-red-500"
          />
          <button
            type="submit"
            disabled={loading}
            className="rounded bg-red-600 px-4 py-2 text-base text-white transition-colors hover:bg-red-700 disabled:opacity-50"
          >
            {loading ? "確認中…" : "ログイン"}
          </button>
        </form>
        {error && <p className="mt-4 font-semibold text-red-600">{error}</p>}
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white p-8 font-sans text-black">
      <h1 className="mb-2 text-2xl font-bold">通報管理ダッシュボード</h1>
      <p className="text-neutral-600">通報された動画の一覧と表示状態を切り替えます。</p>

      <section className="mt-6 overflow-x-auto">
        {reports.length === 0 ? (
          <p className="py-6 text-neutral-500">現在、通報されている動画はありません。</p>
        ) : (
          <table className="w-full border-collapse border border-neutral-300">
            <thead>
              <tr className="border-b border-neutral-300 bg-neutral-100">
                <th className="p-3 text-left">YouTube ID</th>
                <th className="p-3 text-center">通報件数</th>
                <th className="p-3 text-left">最新通報日時</th>
                <th className="p-3 text-center">現在の状態</th>
                <th className="p-3 text-center">操作</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((item) => (
                <tr key={item.videoId} className={`border-b border-neutral-200 ${item.isHidden ? "bg-red-50" : "bg-white"}`}>
                  <VideoCell videoId={item.videoId} />
                  <td className="p-3 text-center font-bold">{item.count}</td>
                  <td className="p-3">{new Date(item.lastReportedAt).toLocaleString("ja-JP")}</td>
                  <StatusCell isHidden={item.isHidden} />
                  <td className="p-3 text-center">
                    <ToggleButton item={item} onToggle={handleToggleHide} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      <section className="mt-14 border-t border-neutral-300 pt-8">
        <h2 className="text-2xl font-bold">動画削除申請</h2>
        <p className="mt-2 text-neutral-600">応募者本人のメール認証により削除された動画です。</p>
        <div className="mt-6 overflow-x-auto">
          {removals.length === 0 ? (
            <p className="py-6 text-neutral-500">現在、削除申請された動画はありません。</p>
          ) : (
            <table className="w-full border-collapse border border-neutral-300">
              <thead>
                <tr className="border-b border-neutral-300 bg-neutral-100">
                  <th className="p-3 text-left">YouTube ID</th>
                  <th className="p-3 text-left">削除申請日時</th>
                  <th className="p-3 text-center">現在の状態</th>
                  <th className="p-3 text-center">操作</th>
                </tr>
              </thead>
              <tbody>
                {removals.map((item) => (
                  <tr key={item.videoId} className={`border-b border-neutral-200 ${item.isHidden ? "bg-red-50" : "bg-white"}`}>
                    <VideoCell videoId={item.videoId} />
                    <td className="p-3">{new Date(item.removedAt).toLocaleString("ja-JP")}</td>
                    <StatusCell isHidden={item.isHidden} />
                    <td className="p-3 text-center">
                      <ToggleButton item={item} onToggle={handleToggleHide} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </section>

      <button
        type="button"
        onClick={() => setAuthenticated(false)}
        className="mt-8 rounded bg-neutral-200 px-4 py-2 font-medium text-neutral-800 transition-colors hover:bg-neutral-300"
      >
        ログアウト
      </button>
    </main>
  );
}

function VideoCell({ videoId }: { videoId: string }) {
  return (
    <td className="p-3">
      <a href={`https://www.youtube.com/watch?v=${videoId}`} target="_blank" rel="noreferrer" className="font-mono text-blue-600 hover:underline">
        {videoId}
      </a>
    </td>
  );
}

function StatusCell({ isHidden }: { isHidden: boolean }) {
  return (
    <td className="p-3 text-center font-bold">
      {isHidden ? <span className="text-red-600">非表示（非公開中）</span> : <span className="text-green-600">表示中</span>}
    </td>
  );
}

function ToggleButton({
  item,
  onToggle,
}: {
  item: { videoId: string; isHidden: boolean };
  onToggle: (videoId: string, currentHidden: boolean) => Promise<void>;
}) {
  return (
    <button
      type="button"
      onClick={() => void onToggle(item.videoId, item.isHidden)}
      className={`rounded px-3 py-1.5 font-medium text-white transition-colors ${
        item.isHidden ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"
      }`}
    >
      {item.isHidden ? "表示を戻す" : "非表示にする"}
    </button>
  );
}
