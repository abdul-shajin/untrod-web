import type { Ride } from "./mock-data";

/**
 * Build a Google Maps directions URL for a ride.
 *
 * Maps caps total stops at ~10 (1 origin + 1 destination + up to 8 waypoints),
 * so we Douglas–Peucker-simplify the polyline and then evenly subsample to fit.
 * For a round-trip, origin == destination == polyline[0].
 *
 * Mirrors the mobile-side `GpxShare` reduction so web and Android open the
 * same loop.
 */
export function googleMapsUrl(ride: Ride): string {
  const pts = ride.polyline;
  if (pts.length === 0) return "https://www.google.com/maps";
  const start = pts[0];
  const simplified = simplify(pts, 0.00012);
  const middle = subsample(simplified, 8);
  const params = new URLSearchParams({
    api: "1",
    travelmode: "driving",
    origin: `${start[0]},${start[1]}`,
    destination: `${start[0]},${start[1]}`,
  });
  if (middle.length > 0) {
    params.set("waypoints", middle.map(([lat, lng]) => `${lat},${lng}`).join("|"));
  }
  return `https://www.google.com/maps/dir/?${params.toString()}`;
}

/** Douglas–Peucker on lat/lng. Tolerance is in degrees (~10 m at the equator). */
function simplify(pts: [number, number][], tol: number): [number, number][] {
  if (pts.length < 3) return pts.slice();
  const keep = new Array(pts.length).fill(false);
  keep[0] = keep[pts.length - 1] = true;
  const stack: [number, number][] = [[0, pts.length - 1]];
  while (stack.length) {
    const [s, e] = stack.pop()!;
    let maxD = 0;
    let idx = -1;
    for (let i = s + 1; i < e; i++) {
      const d = perp(pts[i], pts[s], pts[e]);
      if (d > maxD) { maxD = d; idx = i; }
    }
    if (idx >= 0 && maxD > tol) {
      keep[idx] = true;
      stack.push([s, idx], [idx, e]);
    }
  }
  return pts.filter((_, i) => keep[i]);
}

function perp(p: [number, number], a: [number, number], b: [number, number]): number {
  const [px, py] = p, [ax, ay] = a, [bx, by] = b;
  const dx = bx - ax, dy = by - ay;
  if (dx === 0 && dy === 0) {
    const ex = px - ax, ey = py - ay;
    return Math.hypot(ex, ey);
  }
  const t = ((px - ax) * dx + (py - ay) * dy) / (dx * dx + dy * dy);
  const tc = Math.max(0, Math.min(1, t));
  const cx = ax + tc * dx, cy = ay + tc * dy;
  return Math.hypot(px - cx, py - cy);
}

function subsample<T>(arr: T[], n: number): T[] {
  if (arr.length <= 2 || n <= 0) return [];
  const inner = arr.slice(1, -1);
  if (inner.length <= n) return inner;
  const step = inner.length / n;
  const out: T[] = [];
  for (let i = 0; i < n; i++) out.push(inner[Math.floor(i * step)]);
  return out;
}
