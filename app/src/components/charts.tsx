// Small, dependency-free charts for the lead panel.

export function ScoreDial({ score, temperature }: { score: number; temperature: string }) {
  const r = 58;
  const circumference = Math.PI * r;
  const filled = (score / 100) * circumference;
  return (
    <div className="dial" data-temp={temperature.toLowerCase()}>
      <svg viewBox="0 0 140 80" aria-hidden>
        <defs>
          <linearGradient id="heat" x1="0" x2="1">
            <stop offset="0" stopColor="#6c8cff" />
            <stop offset="0.55" stopColor="#f2a33a" />
            <stop offset="1" stopColor="#f0562e" />
          </linearGradient>
        </defs>
        <path d="M12 74 A58 58 0 0 1 128 74" fill="none" stroke="#e7ebf5" strokeWidth="11" strokeLinecap="round" />
        <path
          d="M12 74 A58 58 0 0 1 128 74"
          fill="none"
          stroke="url(#heat)"
          strokeWidth="11"
          strokeLinecap="round"
          strokeDasharray={`${filled} ${circumference}`}
        />
      </svg>
      <div className="dial-value">
        <strong>{score}</strong>
        <span>{temperature}</span>
      </div>
    </div>
  );
}

export function TrendLine({ values, label }: { values: number[]; label: string }) {
  const w = 240;
  const h = 56;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min || 1;
  const points = values.map((v, i) => [(i / (values.length - 1)) * w, h - 6 - ((v - min) / span) * (h - 14)] as const);
  const line = points.map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)}`).join(" ");
  const last = points[points.length - 1];
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="trend" role="img" aria-label={label} preserveAspectRatio="none">
      <path d={`${line} L${w} ${h} L0 ${h} Z`} fill="#ebeffe" />
      <path d={line} fill="none" stroke="#2445e0" strokeWidth="2" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
      <circle cx={last[0] - 3} cy={last[1]} r="3.5" fill="#2445e0" />
    </svg>
  );
}

export function VisitBars({ values }: { values: number[] }) {
  const max = Math.max(1, ...values);
  return (
    <div className="bars" role="img" aria-label={`Site sessions per day for 30 days, up to ${max} a day`}>
      {values.map((v, i) => (
        <i key={i} style={{ height: `${Math.max(4, (v / max) * 100)}%` }} data-zero={v === 0 || undefined} data-recent={i >= values.length - 7 || undefined} />
      ))}
    </div>
  );
}
