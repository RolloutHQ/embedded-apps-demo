import Link from "next/link";

import { Topbar } from "@/components/Topbar";

export default function ContactNotFound() {
  return (
    <>
      <Topbar crumbs={[{ label: "Contacts", href: "/contacts" }, { label: "Not found" }]} />
      <main className="page">
        <h1 className="page-title">This contact isn&apos;t yours to see</h1>
        <p className="page-sub">
          It doesn&apos;t exist, or it belongs to another agent. Switch to the org admin to see every contact in the
          office, or go back to <Link href="/contacts" style={{ color: "var(--accent)" }}>your contacts</Link>.
        </p>
      </main>
    </>
  );
}
