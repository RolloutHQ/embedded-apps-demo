// Lintel's lead intelligence, generated deterministically from the CRM's
// contact id (crm.personId), so the same contact always shows the same story.
// A real Lintel would read this from its IDX site's tracking database.

function hash(input: string): number {
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function rng(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const NEIGHBORHOODS = [
  { name: "Laurelhurst", city: "Portland", zip: "97232", ppsf: 455 },
  { name: "Grant Park", city: "Portland", zip: "97212", ppsf: 470 },
  { name: "Sellwood", city: "Portland", zip: "97202", ppsf: 430 },
  { name: "Alberta Arts", city: "Portland", zip: "97211", ppsf: 410 },
  { name: "Montavilla", city: "Portland", zip: "97215", ppsf: 360 },
  { name: "Westmoreland", city: "Portland", zip: "97202", ppsf: 445 },
  { name: "Hosford-Abernethy", city: "Portland", zip: "97214", ppsf: 425 },
  { name: "Concordia", city: "Portland", zip: "97211", ppsf: 395 },
  { name: "Lake Oswego", city: "Lake Oswego", zip: "97034", ppsf: 480 },
  { name: "Milwaukie", city: "Milwaukie", zip: "97222", ppsf: 330 },
];

const STREETS = [
  "NE Siskiyou St", "SE Harold St", "NE Klickitat St", "SE Lambert St", "NE Going St",
  "SE Ankeny St", "NE Tillamook St", "SE Ogden St", "NE Brazee St", "SE Spokane St",
  "NE Mason St", "SE Tenino St", "NE Hancock St", "SE Clinton St", "NE Alameda Dr",
  "SE Carlton St", "NE Thompson St", "SE Rex St", "NE Fremont St", "SE Lexington St",
];

const SEARCH_NAMES = ["Close-in craftsman", "Room for the dogs", "Walk to school", "Under $750k, 3 bed", "Mid-century with light", "ADU potential"];

export type Facade = {
  roof: "gable" | "hip" | "flat" | "gambrel";
  body: string;
  trim: string;
  door: string;
  stories: 1 | 2;
  porch: boolean;
};

export type Home = {
  id: string;
  address: string;
  neighborhood: string;
  price: number;
  beds: number;
  baths: number;
  sqft: number;
  views: number;
  lastViewedHours: number;
  saved: boolean;
  status: "New" | "Active" | "Price drop" | "Pending";
  facade: Facade;
};

export type SavedSearch = { name: string; criteria: string; alerts: "Instant" | "Daily" | "Weekly"; newMatches: number };

export type ScoreFactor = { label: string; points: number };

export type LeadIntel = {
  firstName: string;
  score: number;
  temperature: "Hot" | "Warm" | "Cool";
  factors: ScoreFactor[];
  lastVisitHours: number;
  visitsThisWeek: number;
  daily: number[]; // site sessions, last 30 days, oldest first
  topNeighborhood: string;
  priceBand: [number, number];
  homes: Home[];
  searches: SavedSearch[];
  valuation: {
    address: string;
    cityLine: string;
    estimate: number;
    low: number;
    high: number;
    change12mo: number; // fraction
    monthly: number[]; // 12 values, oldest first
    beds: number;
    baths: number;
    sqft: number;
    confidence: "High" | "Medium";
  };
};

const BODY = ["#b9c7b4", "#c98d73", "#8a9bb0", "#e7d6a3", "#a67b5b", "#d9dfe6", "#6e8a7a", "#c2b6a3"];
const TRIM = ["#f7f6f2", "#2f3a45", "#ffffff", "#3e4a3f"];
const DOOR = ["#2445e0", "#c2452d", "#1f6f5c", "#e3a33a", "#2f3a45"];

const pick = <T,>(r: () => number, list: readonly T[]): T => list[Math.floor(r() * list.length)];
const between = (r: () => number, lo: number, hi: number) => lo + r() * (hi - lo);
const roundTo = (n: number, step: number) => Math.round(n / step) * step;

export function leadIntel(personId: string, firstName?: string): LeadIntel {
  const r = rng(hash(personId));
  const home = pick(r, NEIGHBORHOODS);

  // Their own home, for the valuation.
  const ownSqft = roundTo(between(r, 1350, 2700), 10);
  const estimate = roundTo(ownSqft * home.ppsf * between(r, 0.92, 1.1), 1000);
  const change = between(r, -0.02, 0.07);
  const monthly = Array.from({ length: 12 }, (_, i) => {
    const t = i / 11;
    const wobble = (r() - 0.5) * 0.012;
    return roundTo(estimate / (1 + change) * (1 + change * t + wobble), 500);
  });
  monthly[11] = estimate;

  // Shopping behavior.
  const center = roundTo(between(r, 520_000, 880_000), 5000);
  const priceBand: [number, number] = [roundTo(center * 0.88, 5000), roundTo(center * 1.08, 5000)];
  const homeCount = 5 + Math.floor(r() * 3);
  const homes: Home[] = Array.from({ length: homeCount }, (_, i) => {
    const n = pick(r, NEIGHBORHOODS);
    const sqft = roundTo(between(r, 1200, 2600), 10);
    const price = roundTo(between(r, priceBand[0], priceBand[1]), 1000);
    return {
      id: `${personId}-h${i}`,
      address: `${1000 + Math.floor(r() * 8900)} ${pick(r, STREETS)}`,
      neighborhood: n.name,
      price,
      beds: 2 + Math.floor(r() * 3),
      baths: pick(r, [1, 1.5, 2, 2, 2.5, 3]),
      sqft,
      views: 1 + Math.floor(r() * (i < 2 ? 9 : 4)),
      lastViewedHours: Math.floor(between(r, 1, 30 * 24) * (i < 2 ? 0.05 : 0.4)),
      saved: i < 2 || r() > 0.7,
      status: pick(r, ["New", "Active", "Active", "Active", "Price drop", "Pending"] as const),
      facade: {
        roof: pick(r, ["gable", "gable", "hip", "flat", "gambrel"] as const),
        body: pick(r, BODY),
        trim: pick(r, TRIM),
        door: pick(r, DOOR),
        stories: (r() > 0.45 ? 2 : 1) as 1 | 2,
        porch: r() > 0.4,
      },
    };
  }).sort((a, b) => b.views - a.views || a.lastViewedHours - b.lastViewedHours);

  const daily = Array.from({ length: 30 }, (_, i) => {
    const ramp = 0.3 + (i / 29) * 1.4;
    return Math.max(0, Math.round(r() * 4 * ramp - 0.6));
  });
  const visitsThisWeek = daily.slice(-7).reduce((a, b) => a + b, 0);
  const savedCount = homes.filter((h) => h.saved).length;
  const repeatViews = homes.filter((h) => h.views >= 3).length;
  const lastVisitHours = Math.max(1, Math.min(...homes.map((h) => h.lastViewedHours)));

  const factors: ScoreFactor[] = [
    { label: `${visitsThisWeek} site visits this week`, points: Math.min(30, visitsThisWeek * 3) },
    { label: `Saved ${savedCount} home${savedCount === 1 ? "" : "s"}`, points: Math.min(22, savedCount * 6) },
    { label: `Went back to ${repeatViews} listing${repeatViews === 1 ? "" : "s"} three or more times`, points: Math.min(20, repeatViews * 7) },
    { label: lastVisitHours < 24 ? "Active in the last day" : `Last active ${Math.round(lastVisitHours / 24)} days ago`, points: lastVisitHours < 24 ? 18 : lastVisitHours < 72 ? 9 : 2 },
    { label: "Searches stay in one price band", points: 10 },
  ];
  const score = Math.min(99, Math.max(12, factors.reduce((a, f) => a + f.points, 0)));

  const searchNames = [...SEARCH_NAMES].sort(() => r() - 0.5);
  const searches: SavedSearch[] = Array.from({ length: 2 + Math.floor(r() * 2) }, (_, i) => {
    const n = pick(r, NEIGHBORHOODS);
    const beds = 2 + Math.floor(r() * 3);
    return {
      name: searchNames[i],
      criteria: `${n.name}, ${beds}+ beds, ${money(priceBand[0])} to ${money(priceBand[1])}`,
      alerts: pick(r, ["Instant", "Daily", "Daily", "Weekly"] as const),
      newMatches: Math.floor(r() * 6),
    };
  });

  const counts = new Map<string, number>();
  for (const h of homes) counts.set(h.neighborhood, (counts.get(h.neighborhood) ?? 0) + h.views);
  const topNeighborhood = [...counts.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? home.name;

  return {
    firstName: firstName || "This lead",
    score,
    temperature: score >= 75 ? "Hot" : score >= 50 ? "Warm" : "Cool",
    factors: factors.sort((a, b) => b.points - a.points),
    lastVisitHours,
    visitsThisWeek,
    daily,
    topNeighborhood,
    priceBand,
    homes,
    searches,
    valuation: {
      address: `${1000 + Math.floor(r() * 8900)} ${pick(r, STREETS)}`,
      cityLine: home.name === home.city ? `${home.city}, OR ${home.zip}` : `${home.name}, ${home.city}, OR ${home.zip}`,
      estimate,
      low: roundTo(estimate * 0.95, 1000),
      high: roundTo(estimate * 1.05, 1000),
      change12mo: change,
      monthly,
      beds: 2 + Math.floor(r() * 3),
      baths: pick(r, [1.5, 2, 2.5]),
      sqft: ownSqft,
      confidence: r() > 0.35 ? "High" : "Medium",
    },
  };
}

export function money(n: number): string {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`;
  return `$${Math.round(n / 1000)}k`;
}

export const dollars = (n: number) => `$${n.toLocaleString("en-US")}`;

export function ago(hours: number): string {
  if (hours < 1) return "just now";
  if (hours < 24) return `${hours}h ago`;
  const days = Math.round(hours / 24);
  return days === 1 ? "yesterday" : `${days}d ago`;
}
