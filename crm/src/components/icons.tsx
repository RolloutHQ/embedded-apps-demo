import type { SVGProps } from "react";

const base = {
  viewBox: "0 0 16 16",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

export const StoopMark = (p: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 22 22" aria-hidden {...p}>
    <rect width="22" height="22" rx="5" fill="#23604b" />
    <path d="M4 17h4v-3h4v-3h4V7h2" stroke="#e3eee8" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PeopleIcon = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base} {...p}><circle cx="6" cy="5.5" r="2.5" /><path d="M1.5 13.5c.6-2.4 2.3-3.5 4.5-3.5s3.9 1.1 4.5 3.5" /><path d="M10.5 3.2a2.5 2.5 0 0 1 0 4.6M12 10.3c1.3.5 2.1 1.6 2.5 3.2" /></svg>
);
export const GridIcon = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base} {...p}><rect x="2" y="2" width="5" height="5" rx="1" /><rect x="9" y="2" width="5" height="5" rx="1" /><rect x="2" y="9" width="5" height="5" rx="1" /><path d="M11.5 9v5M9 11.5h5" /></svg>
);
export const BookIcon = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base} {...p}><path d="M3 2.5h7.5a2 2 0 0 1 2 2v9H5a2 2 0 0 1-2-2z" /><path d="M3 11.5a2 2 0 0 1 2-2h7.5" /></svg>
);
export const ChevronLeft = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base} width="14" height="14" {...p}><path d="M10 3 5 8l5 5" /></svg>
);
export const ChevronRight = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base} width="14" height="14" {...p}><path d="m6 3 5 5-5 5" /></svg>
);

export const ActivityIcon = ({ kind }: { kind: string }) => {
  switch (kind) {
    case "call":
      return <svg {...base}><path d="M3 2.5h2.5l1 3-1.5 1a8 8 0 0 0 4.5 4.5l1-1.5 3 1V13a1 1 0 0 1-1 1A11 11 0 0 1 2 3.5a1 1 0 0 1 1-1z" /></svg>;
    case "email":
      return <svg {...base}><rect x="2" y="3.5" width="12" height="9" rx="1.5" /><path d="m2.5 4.5 5.5 4 5.5-4" /></svg>;
    case "text":
      return <svg {...base}><path d="M2.5 3.5h11v7h-6l-3 2.5v-2.5h-2z" /></svg>;
    case "showing":
      return <svg {...base}><path d="M2.5 7.5 8 3l5.5 4.5V13h-11z" /><path d="M6.5 13V9.5h3V13" /></svg>;
    case "stage":
      return <svg {...base}><path d="M2.5 13h3v-3h3V7h3V3.5h2" /></svg>;
    default:
      return <svg {...base}><path d="M4 2.5h8v11H4z" /><path d="M6 6h4M6 8.5h4" /></svg>;
  }
};
