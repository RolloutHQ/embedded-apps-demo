import Link from "next/link";

export function Topbar(props: { crumbs: { label: string; href?: string }[]; right?: React.ReactNode }) {
  return (
    <header className="topbar">
      <nav className="crumbs" aria-label="Breadcrumb">
        {props.crumbs.map((crumb, i) => (
          <span key={crumb.label} style={{ display: "contents" }}>
            {i > 0 && <span aria-hidden>/</span>}
            {crumb.href ? <Link href={crumb.href}>{crumb.label}</Link> : <strong>{crumb.label}</strong>}
          </span>
        ))}
      </nav>
      {props.right && <div className="topbar-right">{props.right}</div>}
    </header>
  );
}
