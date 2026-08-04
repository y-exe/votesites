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
      <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
        <h1>通報管理ページ</h1>
        <p>管理者パスワードを入力してください。</p>
        <form onSubmit={handleLogin} style={{ marginTop: "1rem" }}>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="パスワード"
            style={{ padding: "0.5rem", fontSize: "1rem", marginRight: "0.5rem" }}
          />
          <button type="submit" disabled={loading} style={{ padding: "0.5rem 1rem", fontSize: "1rem" }}>
            {loading ? "確認中..." : "ログイン"}
          </button>
        </form>
        {error ? <p style={{ color: "red", marginTop: "1rem" }}>{error}</p> : null}
      </div>
    );
  }

  return (
    <div style={{ padding: "2rem", fontFamily: "sans-serif", background: "#fff", color: "#000", minHeight: "100vh" }}>
      <h1>通報管理ダッシュボード</h1>
      <p>通報された動画の一覧と表示状態の切り替え</p>
      {reports.length === 0 ? (
        <p style={{ marginTop: "2rem" }}>現在、通報されている動画はありません。</p>
      ) : (
        <table border={1} cellPadding={8} cellSpacing={0} style={{ width: "100%", marginTop: "1.5rem", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#eee" }}>
              <th>YouTube ID</th>
              <th>通報件数</th>
              <th>最新通報日時</th>
              <th>現在の状態</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            {reports.map((item) => (
              <tr key={item.videoId} style={{ background: item.isHidden ? "#ffe6e6" : "#fff" }}>
                <td>
                  <a
                    href={`https://www.youtube.com/watch?v=${item.videoId}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {item.videoId}
                  </a>
                </td>
                <td style={{ textAlign: "center" }}>{item.count}</td>
                <td>{new Date(item.lastReportedAt).toLocaleString("ja-JP")}</td>
                <td style={{ textAlign: "center", fontWeight: "bold" }}>
                  {item.isHidden ? "非表示 (非公開中)" : "表示中"}
                </td>
                <td style={{ textAlign: "center" }}>
                  <button
                    type="button"
                    onClick={() => void handleToggleHide(item.videoId, item.isHidden)}
                    style={{
                      padding: "0.4rem 0.8rem",
                      cursor: "pointer",
                      background: item.isHidden ? "#4CAF50" : "#f44336",
                      color: "#fff",
                      border: "none",
                      borderRadius: "4px",
                    }}
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
        style={{ marginTop: "2rem", padding: "0.5rem 1rem" }}
      >
        ログアウト
      </button>
    </div>
  );
}
