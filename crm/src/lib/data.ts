// Seeded demo data for Stoop. Dates are stored as "days ago" so the demo
// always looks current.
import type { CrmUser } from "./session";

export type Stage = { id: string; name: string; tone: StageTone };
export type StageTone = "new" | "nurture" | "active" | "listing" | "contract" | "closed";

export const STAGES = [
  { id: "1", name: "New lead", tone: "new" },
  { id: "2", name: "Nurture", tone: "nurture" },
  { id: "3", name: "Active buyer", tone: "active" },
  { id: "4", name: "Active seller", tone: "listing" },
  { id: "5", name: "Under contract", tone: "contract" },
  { id: "6", name: "Closed", tone: "closed" },
] as const satisfies readonly Stage[];

export type Owner = { id: string; name: string; initials: string };

export const OWNERS: Record<string, Owner> = {
  usr_dana_okafor: { id: "usr_dana_okafor", name: "Dana Okafor", initials: "DO" },
  usr_marcus_bell: { id: "usr_marcus_bell", name: "Marcus Bell", initials: "MB" },
  usr_theo_lind: { id: "usr_theo_lind", name: "Theo Lindqvist", initials: "TL" },
};

export type Activity = {
  daysAgo: number;
  kind: "call" | "email" | "text" | "showing" | "note" | "stage";
  text: string;
};

export type Task = { title: string; dueInDays: number; done?: boolean };

export type Deal = {
  name: string;
  side: "Buy" | "Sell";
  value: number;
  stage: "Showing" | "Offer out" | "Under contract" | "Listed" | "Closed";
  closeInDays?: number;
};

export type Contact = {
  id: string;
  firstName: string;
  lastName: string;
  stage: Stage;
  ownerId: string;
  email: string;
  phone: string;
  city: string;
  source: string;
  budget?: [number, number];
  tags: string[];
  lastTouchDays: number;
  createdDays: number;
  summary: string;
  activity: Activity[];
  tasks: Task[];
  deals: Deal[];
};

const stage = (id: (typeof STAGES)[number]["id"]): Stage =>
  STAGES.find((s) => s.id === id)!;

export const CONTACTS: Contact[] = [
  {
    id: "c_melissa_hartman",
    firstName: "Melissa",
    lastName: "Hartman",
    stage: stage("3"),
    ownerId: "usr_dana_okafor",
    email: "melissa.hartman@example.com",
    phone: "(503) 555-0148",
    city: "Portland, OR",
    source: "Website, IDX search",
    budget: [650_000, 780_000],
    tags: ["Pre-approved", "Relocating", "School district"],
    lastTouchDays: 1,
    createdDays: 38,
    summary:
      "Relocating from Denver in March with two kids. Wants 3+ beds near Laurelhurst or Grant Park; pre-approved with Willamette Home Lending.",
    activity: [
      { daysAgo: 1, kind: "showing", text: "Showed 3412 NE Siskiyou St. Loved the kitchen, worried about the yard." },
      { daysAgo: 2, kind: "email", text: "Sent five new Laurelhurst listings." },
      { daysAgo: 4, kind: "call", text: "22 min call. Moved budget ceiling to $780k." },
      { daysAgo: 9, kind: "stage", text: "Stage changed from Nurture to Active buyer." },
      { daysAgo: 38, kind: "note", text: "Registered on the website from a Grant Park search." },
    ],
    tasks: [
      { title: "Send comps for NE Siskiyou", dueInDays: 0 },
      { title: "Book Saturday showings", dueInDays: 2 },
      { title: "Intro to inspector", dueInDays: 6, done: false },
    ],
    deals: [{ name: "Laurelhurst purchase", side: "Buy", value: 735_000, stage: "Showing", closeInDays: 75 }],
  },
  {
    id: "c_jordan_reyes",
    firstName: "Jordan",
    lastName: "Reyes",
    stage: stage("1"),
    ownerId: "usr_dana_okafor",
    email: "jreyes@example.com",
    phone: "(971) 555-0193",
    city: "Beaverton, OR",
    source: "Zillow",
    budget: [420_000, 500_000],
    tags: ["First-time buyer"],
    lastTouchDays: 0,
    createdDays: 2,
    summary: "First-time buyer, renting in Beaverton. Asked about condos near the MAX line.",
    activity: [
      { daysAgo: 0, kind: "text", text: "Replied: free for a call Thursday after 5." },
      { daysAgo: 2, kind: "note", text: "New lead from Zillow inquiry on 1450 SW Jenkins Rd #204." },
    ],
    tasks: [{ title: "First call", dueInDays: 1 }],
    deals: [],
  },
  {
    id: "c_priya_natarajan",
    firstName: "Priya",
    lastName: "Natarajan",
    stage: stage("6"),
    ownerId: "usr_dana_okafor",
    email: "priya.n@example.com",
    phone: "(503) 555-0112",
    city: "Lake Oswego, OR",
    source: "Referral",
    tags: ["Past client", "Referral source"],
    lastTouchDays: 21,
    createdDays: 410,
    summary: "Closed on a Lake Oswego craftsman last year. Has sent two referrals since.",
    activity: [
      { daysAgo: 21, kind: "email", text: "Sent home anniversary note and market update." },
      { daysAgo: 140, kind: "call", text: "Referred her brother, Arjun." },
      { daysAgo: 330, kind: "stage", text: "Stage changed from Under contract to Closed." },
    ],
    tasks: [{ title: "Quarterly check-in", dueInDays: 9 }],
    deals: [{ name: "Lake Oswego craftsman", side: "Buy", value: 912_000, stage: "Closed" }],
  },
  {
    id: "c_samuel_whitaker",
    firstName: "Samuel",
    lastName: "Whitaker",
    stage: stage("4"),
    ownerId: "usr_dana_okafor",
    email: "sam.whitaker@example.com",
    phone: "(503) 555-0177",
    city: "Portland, OR",
    source: "Open house",
    tags: ["Downsizing", "Listing prep"],
    lastTouchDays: 3,
    createdDays: 64,
    summary: "Selling the family home in Sellwood after 22 years. Wants to list after the holidays.",
    activity: [
      { daysAgo: 3, kind: "showing", text: "Walkthrough with stager. Paint and declutter list sent." },
      { daysAgo: 12, kind: "call", text: "Agreed on a January list date." },
      { daysAgo: 64, kind: "note", text: "Met at the SE 13th open house." },
    ],
    tasks: [
      { title: "Pull CMA for Sellwood", dueInDays: 1 },
      { title: "Photographer booking", dueInDays: 14 },
    ],
    deals: [{ name: "Sellwood listing", side: "Sell", value: 845_000, stage: "Listed", closeInDays: 90 }],
  },
  {
    id: "c_aiko_tanaka",
    firstName: "Aiko",
    lastName: "Tanaka",
    stage: stage("5"),
    ownerId: "usr_dana_okafor",
    email: "aiko.tanaka@example.com",
    phone: "(360) 555-0109",
    city: "Vancouver, WA",
    source: "Website, IDX search",
    budget: [550_000, 600_000],
    tags: ["Pre-approved", "VA loan"],
    lastTouchDays: 0,
    createdDays: 96,
    summary: "Under contract on a Felida rambler. Appraisal came in at value; closing in 18 days.",
    activity: [
      { daysAgo: 0, kind: "call", text: "Appraisal at contract price. Lender clearing conditions." },
      { daysAgo: 6, kind: "stage", text: "Stage changed from Active buyer to Under contract." },
      { daysAgo: 7, kind: "note", text: "Offer accepted at $588,000." },
    ],
    tasks: [
      { title: "Confirm final walkthrough", dueInDays: 16 },
      { title: "Send closing gift order", dueInDays: 17 },
    ],
    deals: [{ name: "Felida rambler", side: "Buy", value: 588_000, stage: "Under contract", closeInDays: 18 }],
  },
  {
    id: "c_marcus_oyelaran",
    firstName: "Marcus",
    lastName: "Oyelaran",
    stage: stage("2"),
    ownerId: "usr_dana_okafor",
    email: "m.oyelaran@example.com",
    phone: "(503) 555-0135",
    city: "Portland, OR",
    source: "Website, IDX search",
    budget: [900_000, 1_200_000],
    tags: ["Investor"],
    lastTouchDays: 11,
    createdDays: 150,
    summary: "Looking for a duplex or ADU-ready lot. Not in a hurry; watches the market closely.",
    activity: [
      { daysAgo: 11, kind: "email", text: "Sent two duplexes in Montavilla." },
      { daysAgo: 45, kind: "call", text: "Wants cap rate above 5%." },
    ],
    tasks: [{ title: "Send off-market duplex", dueInDays: 3 }],
    deals: [],
  },
  {
    id: "c_hannah_brooks",
    firstName: "Hannah",
    lastName: "Brooks",
    stage: stage("3"),
    ownerId: "usr_dana_okafor",
    email: "hannah.brooks@example.com",
    phone: "(503) 555-0161",
    city: "Milwaukie, OR",
    source: "Facebook ad",
    budget: [480_000, 560_000],
    tags: ["Pre-approved", "Dog owner"],
    lastTouchDays: 2,
    createdDays: 27,
    summary: "Wants a fenced yard for two dogs. Flexible on area as long as the commute is under 30 minutes.",
    activity: [
      { daysAgo: 2, kind: "showing", text: "Toured two homes in Milwaukie. Second one is a contender." },
      { daysAgo: 8, kind: "text", text: "Sent pre-approval letter." },
    ],
    tasks: [{ title: "Draft offer for Lake Rd", dueInDays: 1 }],
    deals: [{ name: "Milwaukie purchase", side: "Buy", value: 529_000, stage: "Offer out", closeInDays: 40 }],
  },
  {
    id: "c_diego_alvarez",
    firstName: "Diego",
    lastName: "Alvarez",
    stage: stage("1"),
    ownerId: "usr_dana_okafor",
    email: "diego.alvarez@example.com",
    phone: "(971) 555-0124",
    city: "Hillsboro, OR",
    source: "Website, IDX search",
    budget: [600_000, 700_000],
    tags: [],
    lastTouchDays: 1,
    createdDays: 5,
    summary: "Saved three searches in Hillsboro the first day. Hasn't answered calls yet.",
    activity: [
      { daysAgo: 1, kind: "email", text: "Auto-email: welcome and agent intro." },
      { daysAgo: 5, kind: "note", text: "Registered on the website." },
    ],
    tasks: [{ title: "Call attempt #2", dueInDays: 0 }],
    deals: [],
  },
  {
    id: "c_claire_dubois",
    firstName: "Claire",
    lastName: "Dubois",
    stage: stage("2"),
    ownerId: "usr_dana_okafor",
    email: "claire.dubois@example.com",
    phone: "(503) 555-0186",
    city: "Portland, OR",
    source: "Referral",
    tags: ["Spring buyer"],
    lastTouchDays: 18,
    createdDays: 88,
    summary: "Plans to buy in spring once her lease ends. Likes mid-century homes in the West Hills.",
    activity: [{ daysAgo: 18, kind: "email", text: "Sent West Hills mid-century roundup." }],
    tasks: [{ title: "Check in after Thanksgiving", dueInDays: 8 }],
    deals: [],
  },
  {
    id: "c_owen_mcallister",
    firstName: "Owen",
    lastName: "McAllister",
    stage: stage("4"),
    ownerId: "usr_marcus_bell",
    email: "owen.mca@example.com",
    phone: "(503) 555-0157",
    city: "West Linn, OR",
    source: "Past client",
    tags: ["Luxury"],
    lastTouchDays: 4,
    createdDays: 700,
    summary: "Listing a West Linn view home. Broker-managed relationship.",
    activity: [{ daysAgo: 4, kind: "call", text: "Reviewed the first two weeks of showing feedback." }],
    tasks: [{ title: "Price review", dueInDays: 5 }],
    deals: [{ name: "West Linn view home", side: "Sell", value: 1_650_000, stage: "Listed", closeInDays: 60 }],
  },
  {
    id: "c_rosa_lindgren",
    firstName: "Rosa",
    lastName: "Lindgren",
    stage: stage("3"),
    ownerId: "usr_theo_lind",
    email: "rosa.lindgren@example.com",
    phone: "(503) 555-0170",
    city: "Tigard, OR",
    source: "Website, IDX search",
    budget: [500_000, 575_000],
    tags: ["Pre-approved"],
    lastTouchDays: 3,
    createdDays: 40,
    summary: "Theo's buyer. Looking at townhomes in Tigard and Tualatin.",
    activity: [{ daysAgo: 3, kind: "showing", text: "Toured four townhomes." }],
    tasks: [],
    deals: [],
  },
  {
    id: "c_ben_kowalski",
    firstName: "Ben",
    lastName: "Kowalski",
    stage: stage("1"),
    ownerId: "usr_theo_lind",
    email: "ben.k@example.com",
    phone: "(971) 555-0102",
    city: "Gresham, OR",
    source: "Realtor.com",
    tags: [],
    lastTouchDays: 6,
    createdDays: 6,
    summary: "New inquiry on a Gresham split-level.",
    activity: [{ daysAgo: 6, kind: "note", text: "New lead from Realtor.com." }],
    tasks: [],
    deals: [],
  },
];

export const ownerOf = (contact: Contact): Owner =>
  OWNERS[contact.ownerId] ?? { id: contact.ownerId, name: "Unknown", initials: "?" };

/** Agents see their own contacts; an org admin sees the whole office. */
export const canSee = (user: CrmUser, contact: Contact) =>
  user.role === "admin" || contact.ownerId === user.id;

export const contactsForUser = (user: CrmUser) =>
  CONTACTS.filter((contact) => canSee(user, contact));

export function findContactForUser(user: CrmUser, id: string): Contact | undefined {
  const contact = CONTACTS.find((candidate) => candidate.id === id);
  return contact && canSee(user, contact) ? contact : undefined;
}

export const fullName = (c: Pick<Contact, "firstName" | "lastName">) => `${c.firstName} ${c.lastName}`;

export function daysAgoLabel(days: number): string {
  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days} days ago`;
  if (days < 60) return `${Math.round(days / 7)} wk ago`;
  return `${Math.round(days / 30)} mo ago`;
}

export function dueLabel(days: number): string {
  if (days === 0) return "Due today";
  if (days === 1) return "Tomorrow";
  return `In ${days} days`;
}

export function dateFromDaysAgo(days: number): string {
  const date = new Date(Date.now() - days * 86_400_000);
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export const money = (n: number) =>
  n >= 1_000_000
    ? `$${(n / 1_000_000).toFixed(n % 1_000_000 === 0 ? 0 : 2)}M`
    : `$${Math.round(n / 1000)}k`;
