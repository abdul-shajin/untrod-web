"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import SiteHeader from "../components/site-header";
import { useAuth } from "@/lib/auth-context";
import { mockRides, mockStamps, type Ride, type Stamp } from "@/lib/mock-data";
import { googleMapsUrl } from "@/lib/maps-url";
import { useFirestoreData } from "@/lib/use-firestore-data";

export default function DashboardPage() {
  const { user, loading, configured, signOut } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!configured) return; // dev preview without Firebase — let it render
    if (!loading && !user) router.replace("/login");
  }, [configured, loading, user, router]);

  const live = useFirestoreData(user);

  // Decide once everything that can settle has settled, to avoid mock→real→mock
  // flicker. Order:
  //   1. Firebase not configured → always mock (dev preview).
  //   2. Auth still resolving → render mock (placeholder) but mark as loading.
  //   3. No user → router will redirect; render mock briefly.
  //   4. Live data still loading → keep last frame stable; show mock (so the
  //      page is never blank during the first snapshot fetch).
  //   5. User has zero rides → mock (onboarding hint).
  //   6. Otherwise → real data.
  const showingMock =
    !configured ||
    loading ||
    !user ||
    live.loading ||
    live.rides.length === 0;
  const rides: Ride[] = showingMock ? mockRides : live.rides;
  const stamps: Stamp[] = showingMock ? mockStamps : live.stamps;
  const totalKm = rides.reduce((s, r) => s + r.distanceM, 0) / 1000;
  const newKm = rides.reduce((s, r) => s + r.newRoadsM, 0) / 1000;
  const unlocked = stamps.filter((s) => s.unlockedAtMs).length;

  return (
    <main className="min-h-dvh">
      <SiteHeader />
      <section className="px-6 sm:px-10 pt-6 pb-20 max-w-5xl mx-auto">
        <div className="flex items-end justify-between flex-wrap gap-4 mb-2">
          <div>
            <p className="eyebrow mb-2">Your diary</p>
            <h2 className="text-ink-high">
              Hey{user?.displayName ? `, ${user.displayName.split(" ")[0]}` : ""} 👋
            </h2>
          </div>
          {user && (
            <button
              onClick={() => signOut().then(() => router.push("/"))}
              className="btn-ghost text-sm py-2.5 px-4"
            >
              Sign out
            </button>
          )}
        </div>

        {!configured && (
          <div
            className="card p-5 my-6"
            style={{ background: "var(--amber-100)", borderColor: "var(--amber-300)" }}
          >
            <p className="text-sm" style={{ color: "var(--amber-900)" }}>
              <strong>Dev preview mode.</strong> Firebase isn&apos;t configured yet —
              you&apos;re seeing mock data. Copy <code>.env.local.example</code> to{" "}
              <code>.env.local</code> and fill in your Firebase project to enable real
              auth + Firestore.
            </p>
          </div>
        )}
        {configured && user && live.rides.length === 0 && !live.loading && (
          <div
            className="card p-5 my-6"
            style={{ background: "var(--amber-100)", borderColor: "var(--amber-300)" }}
          >
            <p className="text-sm" style={{ color: "var(--amber-900)" }}>
              <strong>No rides yet.</strong> Open the Untrod app on your phone and
              finish a ride — it&apos;ll show up here automatically. Sample data
              shown below in the meantime.
            </p>
          </div>
        )}

        {/* At-a-glance */}
        <div className="grid grid-cols-3 gap-4 my-6">
          <Stat label="Rides" value={String(rides.length)} />
          <Stat label="Total km" value={totalKm.toFixed(1)} />
          <Stat label="New km" value={newKm.toFixed(1)} accent />
        </div>

        {/* Rides */}
        <div className="flex items-center justify-between mt-10 mb-4">
          <h3 className="text-ink-high">Recent rides</h3>
          <span className="text-sm text-ink-soft">tap any ride to open it in Google Maps</span>
        </div>
        <div className="grid sm:grid-cols-2 gap-5">
          {rides.map((r) => (
            <RideCard key={r.id} ride={r} />
          ))}
        </div>

        {/* Stamps */}
        <div className="flex items-center justify-between mt-12 mb-4">
          <h3 className="text-ink-high">Stamps</h3>
          <span className="text-sm text-ink-soft">
            {unlocked} of {stamps.length} unlocked
          </span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {stamps.map((s) => (
            <StampCard key={s.key} stamp={s} />
          ))}
        </div>

        <p className="text-center text-ink-soft text-sm mt-12">
          Want more?{" "}
          <Link href="/" className="font-semibold" style={{ color: "var(--teal-700)" }}>
            Read what Untrod is →
          </Link>
        </p>
      </section>
    </main>
  );
}

function Stat({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="card p-5">
      <p className="eyebrow mb-2">{label}</p>
      <p
        className="text-3xl font-extrabold tracking-tight"
        style={{ color: accent ? "var(--teal-700)" : "var(--ink-high)" }}
      >
        {value}
      </p>
    </div>
  );
}

function RideCard({ ride }: { ride: Ride }) {
  const date = new Date(ride.startedAtMs).toLocaleString(undefined, {
    weekday: "short",
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
  const km = (ride.distanceM / 1000).toFixed(2);
  const mins = Math.round((ride.endedAtMs - ride.startedAtMs) / 60_000);
  const duration = mins >= 60 ? `${Math.floor(mins / 60)}h ${mins % 60}m` : `${mins}m`;
  const newPct = Math.round((ride.newRoadsM / Math.max(1, ride.distanceM)) * 100);

  return (
    <a
      href={googleMapsUrl(ride)}
      target="_blank"
      rel="noopener noreferrer"
      className="card p-5 block transition hover:-translate-y-0.5"
    >
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm font-semibold text-ink-high">{date}</p>
        <span
          className="text-xs px-2.5 py-1 rounded-full font-semibold"
          style={{ background: "var(--sand)", color: "var(--ink-mid)" }}
        >
          {ride.mood}
        </span>
      </div>
      <RoutePreview polyline={ride.polyline} />
      <div className="grid grid-cols-3 mt-4 gap-3">
        <Stat label="DIST" value={`${km} km`} />
        <Stat label="TIME" value={duration} />
        <Stat label="NEW" value={`${newPct}%`} accent={newPct >= 30} />
      </div>
      {ride.note && (
        <p
          className="mt-3 text-sm italic px-3.5 py-2.5 rounded-xl"
          style={{ background: "rgba(0, 96, 110, 0.06)", color: "var(--ink-mid)" }}
        >
          &ldquo;{ride.note}&rdquo;
        </p>
      )}
      <p
        className="mt-3 text-sm font-semibold inline-flex items-center gap-1"
        style={{ color: "var(--teal-700)" }}
      >
        Open in Google Maps →
      </p>
    </a>
  );
}

function StampCard({ stamp }: { stamp: Stamp }) {
  const tierColor = {
    bronze: "#CD7F32",
    silver: "#B0B0B0",
    gold: "#E0A800",
    platinum: "#008294",
  }[stamp.tier];
  const locked = stamp.unlockedAtMs === null;
  return (
    <div
      className="card p-5 text-center"
      style={{ opacity: locked ? 0.55 : 1, borderColor: locked ? "var(--sand)" : tierColor }}
    >
      <div className="text-3xl mb-2" style={{ filter: locked ? "grayscale(0.8)" : "none" }}>
        {locked ? "🔒" : stamp.emoji}
      </div>
      <p className="font-bold text-ink-high text-sm mb-1">{stamp.title}</p>
      <p className="text-xs text-ink-mid leading-snug">{stamp.description}</p>
      <p
        className="eyebrow mt-2"
        style={{ color: locked ? "var(--ink-soft)" : tierColor }}
      >
        {stamp.tier}
      </p>
    </div>
  );
}

/** Pure-SVG mini-map polyline. Same visual language as the mobile route preview. */
function RoutePreview({ polyline }: { polyline: [number, number][] }) {
  if (polyline.length < 2) return null;
  const lats = polyline.map((p) => p[0]);
  const lngs = polyline.map((p) => p[1]);
  const minLat = Math.min(...lats), maxLat = Math.max(...lats);
  const minLng = Math.min(...lngs), maxLng = Math.max(...lngs);
  const W = 320, H = 130, pad = 14;
  const spanLat = Math.max(1e-6, maxLat - minLat);
  const spanLng = Math.max(1e-6, maxLng - minLng);
  const scale = Math.min((W - pad * 2) / spanLng, (H - pad * 2) / spanLat);
  const offX = pad + ((W - pad * 2) - spanLng * scale) / 2;
  const offY = pad + ((H - pad * 2) - spanLat * scale) / 2;
  const project = (lat: number, lng: number) => {
    const x = offX + (lng - minLng) * scale;
    const y = offY + ((H - pad * 2) - (lat - minLat) * scale);
    return [x, y] as const;
  };
  const d = polyline
    .map((p, i) => {
      const [x, y] = project(p[0], p[1]);
      return `${i === 0 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)}`;
    })
    .join(" ");
  const [sx, sy] = project(polyline[0][0], polyline[0][1]);
  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{ background: "var(--sand)", border: "1px solid var(--border)" }}
    >
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto block">
        <path d={d} stroke="var(--sand)" strokeWidth={8} strokeLinecap="round"
              strokeLinejoin="round" fill="none" />
        <path d={d} stroke="var(--teal-700)" strokeWidth={4} strokeLinecap="round"
              strokeLinejoin="round" fill="none" />
        <circle cx={sx} cy={sy} r={5} fill="var(--amber-700)" stroke="white" strokeWidth={2} />
      </svg>
    </div>
  );
}
