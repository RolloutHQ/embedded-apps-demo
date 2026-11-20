"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { BookIcon, GridIcon, PeopleIcon, StoopMark } from "./icons";
import { UserSwitcher } from "./UserSwitcher";

export function Sidebar(props: {
  contactCount: number;
  user: { key: string; name: string; initials: string; title: string };
}) {
  const path = usePathname();
  const current = (prefix: string) => (path.startsWith(prefix) ? "page" : undefined);

  return (
    <nav className="sidebar" aria-label="Main">
      <Link href="/contacts" className="brand">
        <StoopMark className="brand-mark" />
        Stoop
      </Link>
      <div className="nav-group">
        <div className="nav-heading">Workspace</div>
        <Link href="/contacts" className="nav-link" aria-current={current("/contacts")}>
          <PeopleIcon /> Contacts <span className="count">{props.contactCount}</span>
        </Link>
        <Link href="/settings/apps" className="nav-link" aria-current={current("/settings")}>
          <GridIcon /> Apps
        </Link>
      </div>
      <div className="nav-group">
        <div className="nav-heading">For the demo</div>
        <Link href="/how-it-works" className="nav-link" aria-current={current("/how-it-works")}>
          <BookIcon /> How this works
        </Link>
      </div>
      <div className="sidebar-foot">
        <UserSwitcher user={props.user} />
      </div>
    </nav>
  );
}
