// Lintel's mark: the beam over a doorway.
export function LintelMark({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden className="mark">
      <rect x="2" y="4" width="20" height="4.5" rx="1.2" fill="#2445e0" />
      <rect x="5" y="8.5" width="3.2" height="12" fill="#0f1e36" />
      <rect x="15.8" y="8.5" width="3.2" height="12" fill="#0f1e36" />
      <rect x="8.2" y="12" width="7.6" height="8.5" fill="#f2a33a" opacity="0.9" />
    </svg>
  );
}
