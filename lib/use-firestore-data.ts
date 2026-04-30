"use client";

import { useEffect, useState } from "react";
import {
  collection,
  limit,
  onSnapshot,
  orderBy,
  query,
  type DocumentData,
} from "firebase/firestore";
import type { User } from "firebase/auth";
import { getDb } from "./firebase";
import type { Ride, Stamp } from "./mock-data";
import { STAMP_CATALOG } from "./stamp-catalog";

type State = {
  rides: Ride[];
  stamps: Stamp[];
  loading: boolean;
  error: string | null;
};

const empty: State = { rides: [], stamps: [], loading: true, error: null };

/**
 * Live Firestore subscription for the signed-in user's rides + achievements.
 * Returns mock-shape data so the dashboard UI doesn't care where it came from.
 */
export function useFirestoreData(user: User | null): State {
  const [state, setState] = useState<State>(empty);

  useEffect(() => {
    const db = getDb();
    if (!db || !user) {
      setState({ ...empty, loading: false });
      return;
    }
    setState((s) => ({ ...s, loading: true, error: null }));

    const userRef = collection(db, "users", user.uid, "rides");
    // Cap the live subscription so a power user with hundreds of rides doesn't
    // download the whole history into the client. Pagination can be added
    // later if anyone scrolls past 50.
    const ridesQ = query(userRef, orderBy("startedAtMs", "desc"), limit(50));
    const achievementsRef = collection(db, "users", user.uid, "achievements");

    let rides: Ride[] = [];
    let unlocked: Map<string, number> = new Map();

    const emit = () => {
      const stamps: Stamp[] = STAMP_CATALOG.map((meta) => ({
        ...meta,
        unlockedAtMs: unlocked.get(meta.key) ?? null,
      }));
      setState({ rides, stamps, loading: false, error: null });
    };

    const unsubRides = onSnapshot(
      ridesQ,
      (snap) => {
        rides = snap.docs.map((d) => parseRide(d.id, d.data()));
        emit();
      },
      (err) => setState((s) => ({ ...s, loading: false, error: err.message })),
    );

    const unsubAch = onSnapshot(
      achievementsRef,
      (snap) => {
        unlocked = new Map(
          snap.docs.map((d) => [d.id, Number(d.data().unlockedAtMs ?? 0)]),
        );
        emit();
      },
      (err) => setState((s) => ({ ...s, loading: false, error: err.message })),
    );

    return () => {
      unsubRides();
      unsubAch();
    };
    // Only re-subscribe when uid changes, not on every User object identity churn.
  }, [user?.uid]); // eslint-disable-line react-hooks/exhaustive-deps

  return state;
}

function parseRide(id: string, raw: DocumentData): Ride {
  const polyline: [number, number][] = Array.isArray(raw.polyline)
    ? raw.polyline
        .map((p: unknown) => {
          if (
            p &&
            typeof p === "object" &&
            typeof (p as { lat?: unknown }).lat === "number" &&
            typeof (p as { lng?: unknown }).lng === "number"
          ) {
            const o = p as { lat: number; lng: number };
            return [o.lat, o.lng] as [number, number];
          }
          return null;
        })
        .filter((x): x is [number, number] => x !== null)
    : [];
  return {
    id,
    startedAtMs: Number(raw.startedAtMs ?? 0),
    endedAtMs: Number(raw.endedAtMs ?? raw.startedAtMs ?? 0),
    distanceM: Number(raw.distanceM ?? 0),
    newRoadsM: Number(raw.newRoadsM ?? 0),
    mood: (typeof raw.mood === "string" && raw.mood) || "🛣 Ride",
    note: typeof raw.note === "string" ? raw.note : null,
    polyline,
  };
}
