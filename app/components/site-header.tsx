"use client";

import Link from "next/link";
import { useAuth } from "@/lib/auth-context";

export default function SiteHeader() {
  const { user, loading } = useAuth();
  return (
    <header className="w-full px-6 sm:px-10 py-5 flex items-center justify-between">
      <Link href="/" className="flex items-center gap-2.5 group">
        <span
          aria-hidden
          className="w-9 h-9 rounded-2xl grid place-items-center text-cream font-extrabold text-lg"
          style={{ background: "var(--teal-700)", color: "var(--cream)" }}
        >
          U
        </span>
        <span className="font-extrabold tracking-tight text-xl text-ink-high">untrod.in</span>
      </Link>
      <nav className="flex items-center gap-2.5">
        {!loading && user ? (
          <Link href="/dashboard" className="btn-primary text-sm py-2.5 px-5">
            Dashboard
          </Link>
        ) : (
          <>
            <Link href="/login" className="btn-ghost text-sm py-2.5 px-5">
              Sign in
            </Link>
            <Link href="/register" className="btn-primary text-sm py-2.5 px-5">
              Get started
            </Link>
          </>
        )}
      </nav>
    </header>
  );
}
