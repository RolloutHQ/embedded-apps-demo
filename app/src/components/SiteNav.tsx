import Link from "next/link";

import { LintelMark } from "./LintelMark";

export function SiteNav() {
  return (
    <nav className="site-nav" aria-label="Lintel">
      <Link href="/" className="wordmark">
        <LintelMark /> Lintel
      </Link>
      <Link href="/how-it-works">How this works</Link>
    </nav>
  );
}
