"use client";

import { useState } from "react";

type ReportSummary = {
  videoId: string;
  count: number;
  lastReportedAt: number;
  isHidden: boolean;
};

export default function ReportAdminPage() {
  const [password, setPassword] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [reports, setReports] = useState<ReportSummary[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "list", password }),
      });

      const data = (await res.json()) as {
        success?: boolean;
        reports?: ReportSummary[];
        error?: string;
      };

      if (res.ok && data.success && Array.isArray(data.reports)) {
        setAuthenticated(true);
        setReports(data.reports);
      } else {
        setError(data.error === "unauthorized" ? "パスワードが違います" : "エラーが発生しました");
      }
    } catch {
      setError("通信エラーが発生しました");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleHide = async (videoId: string, currentHidden: boolean) => {
    setError(null);
    try {
      const res = await fetch("/api/report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "toggle-hide",
          password,
          videoId,
          hide: !currentHidden,
        }),
      });

      const data = (await res.json()) as {
        success?: boolean;
        reports?: ReportSummary[];
        error?: string;
      };

      if (res.ok && data.success && Array.isArray(data.reports)) {
        setReports(data.reports);
      } else {
        alert("操作に失敗しました");
      }
    } catch {
      alert("通信エラーが発生しました");
    }
  };

  if (!authenticated) {
    return (
      <div className="p-8 font-sans min-h-screen bg-white text-black">
        <h1 className="text-2xl font-bold mb-2">通報管理ページ</h1>
        <p className="text-neutral-600">管理者パスワードを入力してください。</p>
        <form onSubmit={handleLogin} className="mt-4 flex items-center gap-2">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="パスワード"
            className="p-2 text-base border border-neutral-300 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
          />
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 text-base bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50 transition-colors"
          >
            {loading ? "確認中..." : "ログイン"}
          </button>
        </form>
        {error ? <p className="text-red-600 mt-4 font-semibold">{error}</p> : null}
      </div>
    );
  }

  return (
    <div className="p-8 font-sans bg-white text-black min-h-screen">
      <h1 className="text-2xl font-bold mb-2">通報管理ダッシュボード</h1>
      <p className="text-neutral-600">通報された動画の一覧と表示状態の切り替え</p>
      {reports.length === 0 ? (
        <p className="mt-8 text-neutral-500">現在、通報されている動画はありません。</p>
      ) : (
        <table className="w-full mt-6 border-collapse border border-neutral-300">
          <thead>
            <tr className="bg-neutral-100 border-b border-neutral-300">
              <th className="p-3 text-left">YouTube ID</th>
              <th className="p-3 text-center">通報件数</th>
              <th className="p-3 text-left">最新通報日時</th>
              <th className="p-3 text-center">現在の状態</th>
              <th className="p-3 text-center">操作</th>
            </tr>
          </thead>
          <tbody>
            {reports.map((item) => (
              <tr
                key={item.videoId}
                className={`border-b border-neutral-200 ${item.isHidden ? "bg-red-50" : "bg-white"}`}
              >
                <td className="p-3">
                  <a
                    href={`https://www.youtube.com/watch?v=${item.videoId}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-600 hover:underline font-mono"
                  >
                    {item.videoId}
                  </a>
                </td>
                <td className="p-3 text-center font-bold">{item.count}</td>
                <td className="p-3">{new Date(item.lastReportedAt).toLocaleString("ja-JP")}</td>
                <td className="p-3 text-center font-bold">
                  {item.isHidden ? (
                    <span className="text-red-600">非表示 (非公開中)</span>
                  ) : (
                    <span className="text-green-600">表示中</span>
                  )}
                </td>
                <td className="p-3 text-center">
                  <button
                    type="button"
                    onClick={() => void handleToggleHide(item.videoId, item.isHidden)}
                    className={`px-3 py-1.5 rounded text-white font-medium transition-colors ${
                      item.isHidden
                        ? "bg-green-600 hover:bg-green-700"
                        : "bg-red-600 hover:bg-red-700"
                    }`}
                  >
                    {item.isHidden ? "表示を戻す" : "非表示にする"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <button
        type="button"
        onClick={() => setAuthenticated(false)}
        className="mt-8 px-4 py-2 bg-neutral-200 hover:bg-neutral-300 text-neutral-800 rounded transition-colors font-medium"
      >
        ログアウト
      </button>
    </div>
  );
}
