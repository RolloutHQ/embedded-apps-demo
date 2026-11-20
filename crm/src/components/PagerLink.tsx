"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

// Previous/next contact, keeping whatever ?tab and ?apps the page has now
// (they change on the client without a navigation).
export function PagerLink(props: { contactId?: string; label: string; children: React.ReactNode }) {
  const router = useRouter();
  if (!props.contactId) {
    return (
      <span className="icon-btn" aria-disabled="true" aria-label={props.label}>
        {props.children}
      </span>
    );
  }
  const base = `/contacts/${props.contactId}`;
  return (
    <Link
      className="icon-btn"
      href={base}
      aria-label={props.label}
      onClick={(event) => {
        event.preventDefault();
        router.push(`${base}${window.location.search}`);
      }}
    >
      {props.children}
    </Link>
  );
}
