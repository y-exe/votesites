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
  isExcluded: number;
  username: string | null;
  globalName: string | null;
};

type SuspiciousVote = RecentVote & {
  matchValue: string;
};

type AdminResponse = {
  success?: boolean;
  requiresPasswordUpgrade?: boolean;
  rankings?: VoteRanking[];
  recentVotes?: RecentVote[];
  suspiciousVotes?: SuspiciousVote[];
  liveResults?: { publishedCount: number; updatedAt: number };
  error?: string;
};

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [rankings, setRankings] = useState<VoteRanking[]>([]);
  const [recentVotes, setRecentVotes] = useState<RecentVote[]>([]);
  const [suspiciousVotes, setSuspiciousVotes] = useState<SuspiciousVote[]>([]);
  const [updatingVoteId, setUpdatingVoteId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [requiresPasswordUpgrade, setRequiresPasswordUpgrade] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [publishedCount, setPublishedCount] = useState(0);
  const [resettingReveal, setResettingReveal] = useState(false);

  function applyResponse(data: AdminResponse) {
    if (Array.isArray(data.rankings)) setRankings(data.rankings);
    if (Array.isArray(data.recentVotes)) setRecentVotes(data.recentVotes);
    if (Array.isArray(data.suspiciousVotes)) setSuspiciousVotes(data.suspiciousVotes);
    if (data.liveResults && Number.isInteger(data.liveResults.publishedCount)) {
      setPublishedCount(data.liveResults.publishedCount);
    }
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
        setSuspiciousVotes([]);
      } else {
        setError("エラーが発生しました。");
      }
    } catch {
      setError("通信エラーが発生しました。");
    }
  }

  async function handleResetResultsReveal() {
    if (!window.confirm("生放送の順位公開を1位からやり直します。よろしいですか？")) return;
    setError(null);
    setResettingReveal(true);
    try {
      const response = await fetch("/api/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "reset-results-reveal" }),
      });
      const data = (await response.json()) as AdminResponse;
      if (response.ok && data.success) applyResponse(data);
      else setError("公開状態をリセットできませんでした。");
    } catch {
      setError("通信エラーが発生しました。");
    } finally {
      setResettingReveal(false);
    }
  }

  async function handleVoteExclusion(discordUserId: string, isExcluded: boolean) {
    setError(null);
    setUpdatingVoteId(discordUserId);
    try {
      const response = await fetch("/api/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "set-vote-excluded", discordUserId, isExcluded }),
      });
      const data = (await response.json()) as AdminResponse;
      if (response.ok && data.success) {
        applyResponse(data);
      } else {
        setError(data.error === "vote_not_found" ? "投票データが見つかりません。" : "更新に失敗しました。");
      }
    } catch {
      setError("通信エラーが発生しました。");
    } finally {
      setUpdatingVoteId(null);
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

      <section className="mb-12 rounded border border-neutral-200 bg-neutral-50 p-5">
        <h2 className="text-xl font-bold">生放送の順位公開</h2>
        <p className="mt-2 text-neutral-700">現在、<strong>{publishedCount}位</strong>まで公開済みです。</p>
        <button
          type="button"
          onClick={handleResetResultsReveal}
          disabled={resettingReveal}
          className="mt-4 rounded bg-neutral-900 px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-neutral-700 disabled:opacity-50"
        >
          {resettingReveal ? "リセット中..." : "公開状態をリセット"}
        </button>
      </section>

      <section className="mb-12">
        <h2 className="mb-2 text-xl font-bold border-b border-neutral-200 pb-2">
          不正投票の疑い
        </h2>
        <p className="mb-4 text-sm text-neutral-600">
          同じ作品に、別の Discord ユーザーが同一 IP で投票している候補です。自動判定ではないため、内容を確認してから集計対象を切り替えてください。
        </p>
        {suspiciousVotes.length === 0 ? (
          <p className="text-neutral-500">該当する候補はありません。</p>
        ) : (
          <div className="overflow-x-auto rounded border border-neutral-200">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-neutral-50 border-b border-neutral-200">
                <tr>
                  <th className="px-4 py-3 font-semibold">一致した IP</th>
                  <th className="px-4 py-3 font-semibold">動画ID</th>
                  <th className="px-4 py-3 font-semibold">ユーザー名 (Discord)</th>
                  <th className="px-4 py-3 font-semibold">日時</th>
                  <th className="px-4 py-3 font-semibold">IP</th>
                  <th className="px-4 py-3 font-semibold">User Agent</th>
                  <th className="px-4 py-3 font-semibold">集計状態</th>
                  <th className="px-4 py-3 font-semibold">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200">
                {suspiciousVotes.map((vote) => {
                  const isExcluded = vote.isExcluded === 1;
                  const isUpdating = updatingVoteId === vote.discordUserId;
                  return (
                    <tr key={`${vote.matchValue}:${vote.discordUserId}`} className={isExcluded ? "bg-amber-50 hover:bg-amber-100" : "hover:bg-neutral-50"}>
                      <td className="px-4 py-3">
                        <span className="block font-mono">{vote.matchValue}</span>
                      </td>
                      <td className="px-4 py-3 font-mono">
                        <a href={`https://youtube.com/watch?v=${vote.videoId}`} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">{vote.videoId}</a>
                      </td>
                      <td className="px-4 py-3">
                        {vote.globalName ? `${vote.globalName} (@${vote.username})` : (vote.username ? `@${vote.username}` : vote.discordUserId)}
                      </td>
                      <td className="px-4 py-3">{new Date(vote.createdAt).toLocaleString("ja-JP")}</td>
                      <td className="px-4 py-3 font-mono">{vote.ip || "N/A"}</td>
                      <td className="px-4 py-3 max-w-xs truncate" title={vote.userAgent}>{vote.userAgent || "N/A"}</td>
                      <td className="px-4 py-3 font-medium">{isExcluded ? "除外中" : "集計中"}</td>
                      <td className="px-4 py-3">
                        <button
                          type="button"
                          onClick={() => void handleVoteExclusion(vote.discordUserId, !isExcluded)}
                          disabled={isUpdating}
                          className={isExcluded ? "rounded border border-neutral-300 px-3 py-1.5 font-medium hover:bg-white disabled:opacity-50" : "rounded bg-red-600 px-3 py-1.5 font-medium text-white hover:bg-red-700 disabled:opacity-50"}
                        >
                          {isUpdating ? "更新中..." : isExcluded ? "集計に戻す" : "集計から除外"}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>

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
