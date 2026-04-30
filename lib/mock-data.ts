/**
 * Mock data used until the dashboard is wired to Firestore.
 *
 * Mirrors the Firestore schema we'll use:
 *   users/{uid}/rides/{rideId}  → Ride
 *   users/{uid}/achievements/{key} → Stamp
 *
 * The polyline is `[lat, lng][]` — same shape we'll write from mobile.
 */
export type Ride = {
  id: string;
  startedAtMs: number;
  endedAtMs: number;
  distanceM: number;
  newRoadsM: number;
  mood: string;
  note: string | null;
  polyline: [number, number][];
};

export type Stamp = {
  key: string;
  title: string;
  description: string;
  tier: "bronze" | "silver" | "gold" | "platinum";
  unlockedAtMs: number | null;
  emoji: string;
};

const day = 24 * 60 * 60 * 1000;
const now = 1761857000000; // stable for SSR

function loop(cx: number, cy: number, r: number, n: number): [number, number][] {
  const pts: [number, number][] = [];
  for (let i = 0; i <= n; i++) {
    const t = (i / n) * Math.PI * 2;
    pts.push([
      cy + Math.sin(t) * r * (0.8 + 0.2 * Math.cos(t * 3)),
      cx + Math.cos(t) * r * (0.9 + 0.1 * Math.sin(t * 2)),
    ]);
  }
  return pts;
}

export const mockRides: Ride[] = [
  {
    id: "r1",
    startedAtMs: now - 2 * day,
    endedAtMs: now - 2 * day + 38 * 60 * 1000,
    distanceM: 9_420,
    newRoadsM: 5_840,
    mood: "🌿 Greenest",
    note: "Took the lake loop after work — surprisingly quiet.",
    polyline: loop(77.5946, 12.9716, 0.012, 60),
  },
  {
    id: "r2",
    startedAtMs: now - 4 * day,
    endedAtMs: now - 4 * day + 52 * 60 * 1000,
    distanceM: 14_200,
    newRoadsM: 2_560,
    mood: "🛣 Smoothest",
    note: null,
    polyline: loop(77.605, 12.965, 0.018, 60),
  },
  {
    id: "r3",
    startedAtMs: now - 9 * day,
    endedAtMs: now - 9 * day + 28 * 60 * 1000,
    distanceM: 7_850,
    newRoadsM: 3_200,
    mood: "🎯 Adventurous",
    note: "Took the back lanes near the canal — never knew that bridge existed.",
    polyline: loop(77.58, 12.978, 0.01, 60),
  },
];

export const mockStamps: Stamp[] = [
  { key: "first_ride", title: "First spin", description: "Took your very first ride.",
    tier: "bronze", unlockedAtMs: now - 30 * day, emoji: "🌱" },
  { key: "ten_km", title: "10 km club", description: "Covered 10 km of new roads.",
    tier: "bronze", unlockedAtMs: now - 12 * day, emoji: "🚴" },
  { key: "streak_7", title: "Week-long streak", description: "Rode 7 days in a row.",
    tier: "silver", unlockedAtMs: now - 5 * day, emoji: "🔥" },
  { key: "fifty_km", title: "50 km milestone", description: "Half a hundred. Legs are talking.",
    tier: "silver", unlockedAtMs: null, emoji: "🥈" },
  { key: "explorer", title: "Neighbourhood explorer", description: "20% of your area covered.",
    tier: "gold", unlockedAtMs: null, emoji: "🗺" },
  { key: "completionist", title: "Completionist", description: "Every road in your home zone — done.",
    tier: "platinum", unlockedAtMs: null, emoji: "🏆" },
];
