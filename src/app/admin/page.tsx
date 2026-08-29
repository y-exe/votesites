"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

type VoteRanking = {
  videoId: string;
  count: number;
};

type RecentVote = {
  discordUserId: string;
  videoId: string;
  ip: string;
  userAgent: string;
  country: string;
  createdAt: number;
  username: string | null;
  globalName: string | null;
};

type AdminResponse = {
  success?: boolean;
  requiresPasswordUpgrade?: boolean;
  rankings?: VoteRanking[];
  recentVotes?: RecentVote[];
  error?: string;
};

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [rankings, setRankings] = useState<VoteRanking[]>([]);
  const [recentVotes, setRecentVotes] = useState<RecentVote[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [requiresPasswordUpgrade, setRequiresPasswordUpgrade] = useState(false);
  const [newPassword, setNewPassword] = useState("");

  function applyResponse(data: AdminResponse) {
    if (Array.isArray(data.rankings)) setRankings(data.rankings);
    if (Array.isArray(data.recentVotes)) setRecentVotes(data.recentVotes);
    if (typeof data.requiresPasswordUpgrade === "boolean") {
      setRequiresPasswordUpgrade(data.requiresPasswordUpgrade);
    }
  }

  useEffect(() => {
    const controller = new AbortController();
    void (async () => {
      try {
        const response = await fetch("/api/admin", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "list" }),
          signal: controller.signal,
        });
        const data = (await response.json()) as AdminResponse;
        if (response.ok && data.success && Array.isArray(data.rankings)) {
          setAuthenticated(true);
          applyResponse(data);
        }
      } catch {
        // An absent or expired session is the normal logged-out state.
      }
    })();
    return () => controller.abort();
  }, []);

  async function handleLogin(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const response = await fetch("/api/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "login", password }),
      });
      const data = (await response.json()) as AdminResponse;
      if (response.ok && data.success && Array.isArray(data.rankings)) {
        setAuthenticated(true);
        setPassword("");
        applyResponse(data);
      } else {
        setError(
          data.error === "unauthorized"
            ? "パスワードが違います。"
            : data.error === "rate_limited"
              ? "試行回数が多すぎます。しばらく待ってから再試行してください。"
              : "エラーが発生しました。",
        );
      }
    } catch {
      setError("通信エラーが発生しました。");
    } finally {
      setLoading(false);
    }
  }

  async function handleUpgradePassword(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const response = await fetch("/api/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "upgrade-password", newPassword }),
      });
      const data = (await response.json()) as AdminResponse;
      if (response.ok && data.success) {
        applyResponse(data);
        setNewPassword("");
      } else {
        setError(
          data.error === "invalid_password"
            ? "パスワードは11文字以上である必要があります。"
            : "エラーが発生しました。",
        );
      }
    } catch {
      setError("通信エラーが発生しました。");
    } finally {
      setLoading(false);
    }
  }

  async function handleLogout() {
    setError(null);
    try {
      const response = await fetch("/api/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "logout" }),
      });
      if (response.ok) {
        setAuthenticated(false);
        setRankings([]);
        setRecentVotes([]);
      } else {
        setError("エラーが発生しました。");
      }
    } catch {
      setError("通信エラーが発生しました。");
    }
  }

  if (!authenticated) {
    return (
      <main className="min-h-screen bg-white p-8 font-sans text-black">
        <h1 className="mb-2 text-2xl font-bold">投票データ管理ログイン</h1>
        <p className="text-neutral-600">管理用パスワードを入力してください。</p>
        <form onSubmit={handleLogin} className="mt-4 flex items-center gap-2">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
            className="rounded border border-neutral-300 p-2 text-base outline-none focus:ring-2 focus:ring-red-500"
            autoFocus
          />
          <button type="submit" disabled={loading} className="rounded bg-red-600 px-4 py-2 text-base text-white transition-colors hover:bg-red-700 disabled:opacity-50">
            {loading ? "ログイン中..." : "ログイン"}
          </button>
        </form>
        {error && <p className="mt-4 font-semibold text-red-600">{error}</p>}
      </main>
    );
  }

  if (requiresPasswordUpgrade) {
    return (
      <main className="min-h-screen bg-white p-8 font-sans text-black">
        <h1 className="mb-2 text-2xl font-bold">パスワードのアップグレードが必要です</h1>
        <p className="text-neutral-600 mb-6">
          セキュリティ向上のため、パスワードを新しい暗号化形式に更新してください。
          設定済みのパスワード、または新しい11文字以上のパスワードを入力してください。
        </p>
        <form onSubmit={handleUpgradePassword} className="mt-4 flex items-center gap-2">
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            disabled={loading}
            className="rounded border border-neutral-300 p-2 text-base outline-none focus:ring-2 focus:ring-red-500"
            minLength={11}
            autoFocus
          />
          <button type="submit" disabled={loading} className="rounded bg-red-600 px-4 py-2 text-base text-white transition-colors hover:bg-red-700 disabled:opacity-50">
            {loading ? "更新中..." : "パスワードを更新"}
          </button>
        </form>
        {error && <p className="mt-4 font-semibold text-red-600">{error}</p>}
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white p-8 font-sans text-black">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">投票データダッシュボード</h1>
        <button onClick={handleLogout} className="rounded border border-neutral-300 px-4 py-2 text-sm font-medium hover:bg-neutral-100">
          ログアウト
        </button>
      </div>

      {error && <p className="mt-4 font-semibold text-red-600">{error}</p>}

      <section className="mb-12">
        <h2 className="mb-4 text-xl font-bold border-b border-neutral-200 pb-2">
          動画別 投票数ランキング (上位100件)
        </h2>
        {rankings.length === 0 ? (
          <p className="text-neutral-500">まだ投票データがありません。</p>
        ) : (
          <div className="overflow-x-auto rounded border border-neutral-200">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-neutral-50 border-b border-neutral-200">
                <tr>
                  <th className="px-4 py-3 font-semibold">順位</th>
                  <th className="px-4 py-3 font-semibold">動画ID</th>
                  <th className="px-4 py-3 font-semibold text-right">得票数</th>
                  <th className="px-4 py-3 font-semibold">リンク</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200">
                {rankings.map((item, index) => (
                  <tr key={item.videoId} className="hover:bg-neutral-50">
                    <td className="px-4 py-3">{index + 1}</td>
                    <td className="px-4 py-3 font-mono">{item.videoId}</td>
                    <td className="px-4 py-3 text-right font-bold">{item.count}</td>
                    <td className="px-4 py-3">
                      <a 
                        href={`https://youtube.com/watch?v=${item.videoId}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        YouTubeで見る
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section>
        <h2 className="mb-4 text-xl font-bold border-b border-neutral-200 pb-2">
          最近の投票 (最新200件)
        </h2>
        {recentVotes.length === 0 ? (
          <p className="text-neutral-500">まだ投票がありません。</p>
        ) : (
          <div className="overflow-x-auto rounded border border-neutral-200">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-neutral-50 border-b border-neutral-200">
                <tr>
                  <th className="px-4 py-3 font-semibold">日時</th>
                  <th className="px-4 py-3 font-semibold">ユーザー名 (Discord)</th>
                  <th className="px-4 py-3 font-semibold">動画ID</th>
                  <th className="px-4 py-3 font-semibold">IP</th>
                  <th className="px-4 py-3 font-semibold">User Agent</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200">
                {recentVotes.map((vote, i) => (
                  <tr key={i} className="hover:bg-neutral-50">
                    <td className="px-4 py-3">
                      {new Date(vote.createdAt).toLocaleString("ja-JP")}
                    </td>
                    <td className="px-4 py-3">
                      {vote.globalName ? `${vote.globalName} (@${vote.username})` : (vote.username ? `@${vote.username}` : vote.discordUserId)}
                    </td>
                    <td className="px-4 py-3 font-mono">
                      <a href={`https://youtube.com/watch?v=${vote.videoId}`} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">
                        {vote.videoId}
                      </a>
                    </td>
                    <td className="px-4 py-3 font-mono">
                      {vote.ip || "N/A"}
                    </td>
                    <td className="px-4 py-3 max-w-xs truncate" title={vote.userAgent}>
                      {vote.userAgent || "N/A"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}
