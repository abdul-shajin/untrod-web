/**
 * Stamp catalog — title/description/emoji/tier for each achievement key.
 *
 * Source of truth lives in mobile `domain/Achievements.kt`. When the user is
 * signed in, Firestore tells us *which* keys are unlocked; this catalog
 * supplies the display metadata. Locked stamps (not yet earned) are still
 * shown greyed out so users see what's possible.
 */
export type StampTier = "bronze" | "silver" | "gold" | "platinum";

export type StampMeta = {
  key: string;
  title: string;
  description: string;
  tier: StampTier;
  emoji: string;
};

export const STAMP_CATALOG: StampMeta[] = [
  { key: "first_ride", title: "First spin", description: "Took your very first ride.",
    tier: "bronze", emoji: "🌱" },
  { key: "ten_km", title: "10 km club", description: "Covered 10 km of new roads.",
    tier: "bronze", emoji: "🚴" },
  { key: "streak_7", title: "Week-long streak", description: "Rode 7 days in a row.",
    tier: "silver", emoji: "🔥" },
  { key: "fifty_km", title: "50 km milestone", description: "Half a hundred. Legs are talking.",
    tier: "silver", emoji: "🥈" },
  { key: "explorer", title: "Neighbourhood explorer", description: "20% of your area covered.",
    tier: "gold", emoji: "🗺" },
  { key: "completionist", title: "Completionist", description: "Every road in your home zone — done.",
    tier: "platinum", emoji: "🏆" },
];
