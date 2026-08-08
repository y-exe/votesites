"use client";

import { useState } from "react";
import styles from "./remove.module.css";

type Step = "email" | "code" | "select" | "none" | "done";

export default function RemovePage() {
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [requestId, setRequestId] = useState("");
  const [sessionToken, setSessionToken] = useState("");
  const [videoIds, setVideoIds] = useState<string[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function requestCode(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/remove/request-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = (await response.json()) as { requestId?: string; error?: string };
      if (!response.ok || !data.requestId) {
        setError(
          data.error === "rate_limited"
            ? "しばらく時間をおいてから、もう一度お試しください。"
            : data.error === "invalid_email"
              ? "メールアドレスを正しく入力してください。"
              : "現在、確認メールを送信できません。時間をおいてお試しください。",
        );
        return;
      }
      setRequestId(data.requestId);
      setStep("code");
    } catch {
      setError("通信に失敗しました。時間をおいてお試しください。");
    } finally {
      setLoading(false);
    }
  }

  async function verifyCode(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/remove/verify-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ requestId, code }),
      });
      const data = (await response.json()) as {
        sessionToken?: string;
        videoIds?: string[];
      };
      if (!response.ok || !data.sessionToken || !Array.isArray(data.videoIds)) {
        setError("確認コードが違うか、有効期限が切れています。");
        return;
      }
      setSessionToken(data.sessionToken);
      setVideoIds(data.videoIds);
      setSelected(data.videoIds);
      setStep(data.videoIds.length === 0 ? "none" : "select");
    } catch {
      setError("通信に失敗しました。時間をおいてお試しください。");
    } finally {
      setLoading(false);
    }
  }

  async function confirmRemoval(event: React.FormEvent) {
    event.preventDefault();
    if (selected.length === 0 || !window.confirm("選択した動画を削除しますか？この操作は元に戻せません。")) return;
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/remove/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionToken, videoIds: selected }),
      });
      if (!response.ok) {
        setError("削除セッションの有効期限が切れました。最初からやり直してください。");
        return;
      }
      setStep("done");
    } catch {
      setError("通信に失敗しました。時間をおいてお試しください。");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className={styles.page}>
      <h1>動画削除申請</h1>

      {step === "email" && (
        <form onSubmit={requestCode} className={styles.form}>
          <p className={styles.field}>
            <label htmlFor="email">
              Googleフォームで送信したメールアドレスを入力してください
              <br />
              <input
                id="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className={styles.input}
                placeholder="name@example.com"
              />
            </label>
          </p>
          <p className={styles.help}>5文字の確認コードをメールで送ります。</p>
          <SubmitButton loading={loading}>確認コードを送信</SubmitButton>
        </form>
      )}

      {step === "code" && (
        <form onSubmit={verifyCode} className={styles.form}>
          <p className={styles.help}>確認コードを送りました。コードは10分間有効です。</p>
          <p className={styles.field}>
            <label htmlFor="code">
              5文字の確認コード
              <br />
              <input
                id="code"
                inputMode="text"
                autoComplete="one-time-code"
                maxLength={5}
                required
                value={code}
                onChange={(event) => setCode(event.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ""))}
                className={`${styles.input} ${styles.codeInput}`}
              />
            </label>
          </p>
          <SubmitButton loading={loading}>確認する</SubmitButton>
        </form>
      )}

      {step === "select" && (
        <form onSubmit={confirmRemoval} className={styles.form}>
          <h2>削除する動画を選択</h2>
          <p>削除した動画は投票画面に表示されなくなります。</p>
          <ul className={styles.list}>
            {videoIds.map((videoId) => (
              <li key={videoId}>
                <label>
                  <input
                    type="checkbox"
                    checked={selected.includes(videoId)}
                    onChange={(event) =>
                      setSelected((current) =>
                        event.target.checked
                          ? [...current, videoId]
                          : current.filter((item) => item !== videoId),
                      )
                    }
                  />{" "}
                  {videoId}
                </label>{" "}
                <a
                  href={`https://www.youtube.com/watch?v=${videoId}`}
                  target="_blank"
                  rel="noreferrer"
                  className={styles.link}
                >
                  YouTubeで確認
                </a>
              </li>
            ))}
          </ul>
          <SubmitButton loading={loading} disabled={selected.length === 0}>
            選択した動画を削除
          </SubmitButton>
        </form>
      )}

      {step === "none" && (
        <div>
          <h2>削除できる動画はありません</h2>
          <p>このメールアドレスで応募した、現在公開中の動画は見つかりませんでした。</p>
        </div>
      )}

      {step === "done" && (
        <div>
          <h2>削除が完了しました</h2>
          <p>選択した動画を投票対象から削除しました。</p>
        </div>
      )}

      {error && <p role="alert" className={styles.error}>{error}</p>}
    </main>
  );
}

function SubmitButton({
  children,
  loading,
  disabled = false,
}: {
  children: React.ReactNode;
  loading: boolean;
  disabled?: boolean;
}) {
  return (
    <button type="submit" disabled={loading || disabled} className={styles.button}>
      {loading ? "処理中…" : children}
    </button>
  );
}
