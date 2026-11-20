import type { Facade as FacadeSpec } from "@/lib/leads";

// A small illustrated house front, drawn from the listing's seed, standing in
// for a listing photo.
export function Facade({ spec, label }: { spec: FacadeSpec; label: string }) {
  const w = 160;
  const h = 112;
  const ground = 98;
  const bodyW = spec.stories === 2 ? 84 : 104;
  const bodyH = spec.stories === 2 ? 50 : 32;
  const x = (w - bodyW) / 2;
  const top = ground - bodyH;

  const roof = (() => {
    switch (spec.roof) {
      case "hip":
        return `M${x - 6} ${top} L${x + 16} ${top - 18} L${x + bodyW - 16} ${top - 18} L${x + bodyW + 6} ${top} Z`;
      case "flat":
        return `M${x - 4} ${top} L${x - 4} ${top - 6} L${x + bodyW + 4} ${top - 6} L${x + bodyW + 4} ${top} Z`;
      case "gambrel":
        return `M${x - 6} ${top} L${x + 8} ${top - 14} L${x + bodyW / 2} ${top - 24} L${x + bodyW - 8} ${top - 14} L${x + bodyW + 6} ${top} Z`;
      default:
        return `M${x - 8} ${top} L${x + bodyW / 2} ${top - 28} L${x + bodyW + 8} ${top} Z`;
    }
  })();

  const windowRow = (y: number, count: number) =>
    Array.from({ length: count }, (_, i) => {
      const gap = bodyW / (count + 1);
      const cx = x + gap * (i + 1);
      return <rect key={`${y}-${i}`} x={cx - 7} y={y} width={14} height={13} rx={1} fill="#dfe7ff" stroke={spec.trim} strokeWidth={2} />;
    });

  const doorX = x + bodyW / 2 - 7;

  return (
    <svg viewBox={`0 0 ${w} ${h}`} role="img" aria-label={label} className="facade">
      <rect width={w} height={h} fill="#eef2fe" />
      <circle cx={132} cy={22} r={9} fill="#fff4d6" />
      <rect x={0} y={ground} width={w} height={h - ground} fill="#d6e2cf" />
      <path d={roof} fill={spec.trim === "#ffffff" || spec.trim === "#f7f6f2" ? "#46505c" : spec.trim} />
      <rect x={x} y={top} width={bodyW} height={bodyH} fill={spec.body} />
      {spec.stories === 2 && windowRow(top + 6, 3)}
      {windowRow(ground - 22, 2)}
      <rect x={doorX} y={ground - 20} width={14} height={20} fill={spec.door} />
      <circle cx={doorX + 11} cy={ground - 10} r={1} fill="#fff" />
      {spec.porch && (
        <>
          <rect x={doorX - 12} y={ground - 26} width={38} height={3} fill={spec.trim} />
          <rect x={doorX - 11} y={ground - 23} width={2} height={23} fill={spec.trim} />
          <rect x={doorX + 23} y={ground - 23} width={2} height={23} fill={spec.trim} />
        </>
      )}
      <rect x={doorX - 4} y={ground} width={22} height={3} fill="#c6ccd4" />
      <ellipse cx={x - 14} cy={ground - 6} rx={10} ry={9} fill="#7fa38a" />
      <ellipse cx={x + bodyW + 16} cy={ground - 9} rx={12} ry={12} fill="#6b9378" />
    </svg>
  );
}
