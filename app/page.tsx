import Link from "next/link";
import SiteHeader from "./components/site-header";

const features = [
  {
    icon: "🌿",
    title: "Pick a mood",
    body: "Tired? Adventurous? Just want a quick spin? Tap a mood, get a loop that matches.",
  },
  {
    icon: "🎲",
    title: "Surprise me",
    body: "Five different routes, five different vibes. Swipe through, take the one that calls.",
  },
  {
    icon: "📔",
    title: "Quiet diary",
    body: "Every ride lands here as a tiny entry. Add a note. Watch your map fill in over months.",
  },
];

const vehicles = ["🚲 Cycle", "🛴 Scooter", "🏍 Motorcycle", "🚗 Car"];

export default function Home() {
  return (
    <main className="min-h-dvh">
      <SiteHeader />

      {/* Hero */}
      <section className="px-6 sm:px-10 pt-10 sm:pt-16 pb-20 max-w-5xl mx-auto">
        <p className="eyebrow mb-5">A small daily ritual</p>
        <h1 className="text-ink-high mb-6">
          Drive every road
          <br />
          <span style={{ color: "var(--teal-700)" }}>around you.</span>
        </h1>
        <p className="text-lg sm:text-xl text-ink-mid max-w-2xl leading-relaxed mb-10">
          Aimless rides — on a cycle, bike, motorcycle, or car — are how people unwind, reset
          and rediscover their own neighbourhood. Untrod plans a short round-trip loop over
          roads you haven&apos;t ridden yet. Take a lap. Clear your head. Come back home.
        </p>

        <div className="flex flex-wrap items-center gap-3 mb-12">
          <Link href="/register" className="btn-primary">
            Start free →
          </Link>
          <Link href="/login" className="btn-ghost">
            I already have an account
          </Link>
        </div>

        <div className="flex flex-wrap gap-2.5 text-sm text-ink-mid">
          {vehicles.map((v) => (
            <span
              key={v}
              className="px-3.5 py-1.5 rounded-full border"
              style={{ borderColor: "var(--sand)", background: "var(--surface)" }}
            >
              {v}
            </span>
          ))}
        </div>
      </section>

      {/* Why */}
      <section
        className="px-6 sm:px-10 py-16"
        style={{ background: "linear-gradient(180deg, transparent, var(--sand) 60%)" }}
      >
        <div className="max-w-5xl mx-auto">
          <p className="eyebrow mb-4">Why a round trip?</p>
          <h2 className="text-ink-high mb-8 max-w-3xl">
            The ride that ends where it started is the one your brain actually needs.
          </h2>
          <div className="grid sm:grid-cols-3 gap-5">
            <ReasonCard
              title="No destination, no stress"
              body="You don't have to be anywhere. The loop will bring you back. That's the whole point."
            />
            <ReasonCard
              title="Roads you forgot existed"
              body="Live two years in a place, you've still ridden 30% of it. We help you fill in the rest."
            />
            <ReasonCard
              title="A reason to step out"
              body="Streak chips, badges, a slowly-filling map. Tiny rewards that add up."
            />
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="px-6 sm:px-10 py-20 max-w-5xl mx-auto">
        <p className="eyebrow mb-4">In the app</p>
        <h2 className="text-ink-high mb-10 max-w-2xl">
          Three small ideas that make going for a ride feel new again.
        </h2>
        <div className="grid sm:grid-cols-3 gap-5">
          {features.map((f) => (
            <article key={f.title} className="card p-6">
              <div className="text-3xl mb-3">{f.icon}</div>
              <h3 className="mb-2 text-ink-high">{f.title}</h3>
              <p className="text-ink-mid leading-relaxed">{f.body}</p>
            </article>
          ))}
        </div>
      </section>

      {/* CTA strip */}
      <section className="px-6 sm:px-10 pb-20">
        <div
          className="max-w-5xl mx-auto card p-8 sm:p-12 text-center"
          style={{ background: "var(--teal-700)", borderColor: "var(--teal-900)" }}
        >
          <h2 className="mb-4" style={{ color: "var(--cream)" }}>
            Your map is waiting to fill in.
          </h2>
          <p className="text-lg mb-7" style={{ color: "var(--teal-100)" }}>
            Sign up, install on your phone, take a loop. We&apos;ll keep the diary.
          </p>
          <Link
            href="/register"
            className="btn-primary"
            style={{ background: "var(--cream)", color: "var(--teal-700)" }}
          >
            Create an account →
          </Link>
        </div>
      </section>

      <footer className="px-6 sm:px-10 py-10 text-center text-ink-soft text-sm">
        Built for people who like the long way home. © {new Date().getFullYear()} Untrod.
      </footer>
    </main>
  );
}

function ReasonCard({ title, body }: { title: string; body: string }) {
  return (
    <div className="card p-6">
      <h3 className="mb-2 text-ink-high">{title}</h3>
      <p className="text-ink-mid leading-relaxed">{body}</p>
    </div>
  );
}
