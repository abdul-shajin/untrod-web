"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState, type FormEvent } from "react";
import { useAuth } from "@/lib/auth-context";
import SiteHeader from "../components/site-header";

export default function LoginPage() {
  return <AuthPage mode="login" />;
}

export function AuthPage({ mode }: { mode: "login" | "register" }) {
  const router = useRouter();
  const auth = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!auth.configured) {
      setError("Firebase isn't configured yet — copy .env.local.example to .env.local and fill it in.");
      return;
    }
    setBusy(true);
    setError(null);
    try {
      if (mode === "login") await auth.signInEmail(email, password);
      else await auth.registerEmail(email, password);
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setBusy(false);
    }
  }

  async function onGoogle() {
    if (!auth.configured) {
      setError("Firebase isn't configured yet — copy .env.local.example to .env.local and fill it in.");
      return;
    }
    setBusy(true);
    setError(null);
    try {
      await auth.signInWithGoogle();
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setBusy(false);
    }
  }

  const title = mode === "login" ? "Welcome back" : "Create an account";
  const sub =
    mode === "login"
      ? "Sign in to see your rides, badges and that map slowly filling in."
      : "It takes ten seconds. We don't email you, we just keep your diary.";
  const switchHref = mode === "login" ? "/register" : "/login";
  const switchLabel = mode === "login" ? "Need an account? Register" : "Already have one? Sign in";
  const submitLabel = mode === "login" ? "Sign in" : "Create account";

  return (
    <main className="min-h-dvh">
      <SiteHeader />
      <section className="px-6 sm:px-10 pt-6 pb-20 max-w-md mx-auto">
        <div className="card p-7 sm:p-9">
          <p className="eyebrow mb-3">{mode === "login" ? "Sign in" : "Register"}</p>
          <h2 className="text-ink-high mb-2">{title}</h2>
          <p className="text-ink-mid mb-7 leading-relaxed">{sub}</p>

          <button
            type="button"
            onClick={onGoogle}
            disabled={busy}
            className="btn-ghost w-full justify-center mb-4"
          >
            <span aria-hidden>🇬</span> Continue with Google
          </button>

          <div className="flex items-center gap-3 my-5 text-ink-soft text-xs uppercase tracking-widest">
            <div className="flex-1 h-px" style={{ background: "var(--sand)" }} />
            or email
            <div className="flex-1 h-px" style={{ background: "var(--sand)" }} />
          </div>

          <form onSubmit={onSubmit} className="space-y-3">
            <input
              type="email"
              autoComplete="email"
              required
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="field"
            />
            <input
              type="password"
              autoComplete={mode === "login" ? "current-password" : "new-password"}
              required
              minLength={6}
              placeholder="Password (min 6 characters)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="field"
            />
            {error && (
              <p
                className="text-sm rounded-xl px-3 py-2"
                style={{ background: "rgba(179, 38, 30, 0.08)", color: "var(--danger)" }}
              >
                {error}
              </p>
            )}
            <button type="submit" disabled={busy} className="btn-primary w-full justify-center mt-2">
              {busy ? "Working..." : submitLabel}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link
              href={switchHref}
              className="text-sm font-semibold"
              style={{ color: "var(--teal-700)" }}
            >
              {switchLabel}
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
