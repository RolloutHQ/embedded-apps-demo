import type { Metadata } from "next";

import { ContactsTable, type Row } from "@/components/ContactsTable";
import { Topbar } from "@/components/Topbar";
import { contactsForUser, daysAgoLabel, dueLabel, fullName, money, ownerOf, STAGES } from "@/lib/data";
import { getSignedInUser } from "@/lib/session";

export const metadata: Metadata = { title: "Contacts" };

export default async function ContactsPage() {
  const user = await getSignedInUser();
  const contacts = contactsForUser(user);

  const rows: Row[] = contacts.map((c) => {
    const next = c.tasks.filter((t) => !t.done).sort((a, b) => a.dueInDays - b.dueInDays)[0];
    const owner = ownerOf(c);
    return {
      id: c.id,
      name: fullName(c),
      initials: `${c.firstName[0]}${c.lastName[0]}`,
      stage: c.stage,
      owner: owner.name,
      ownerInitials: owner.initials,
      source: c.source,
      city: c.city,
      budget: c.budget ? `${money(c.budget[0])} to ${money(c.budget[1])}` : "",
      lastTouch: daysAgoLabel(c.lastTouchDays),
      lastTouchDays: c.lastTouchDays,
      nextTask: next ? next.title : "",
      nextDue: next ? dueLabel(next.dueInDays) : "",
      nextDueToday: next?.dueInDays === 0,
    };
  });

  return (
    <>
      <Topbar crumbs={[{ label: "Contacts" }]} right={<span>{user.office.name}</span>} />
      <main className="page">
        <div className="page-head">
          <div>
            <h1 className="page-title">Contacts</h1>
            <p className="page-sub">
              {user.role === "admin"
                ? `Everyone at ${user.office.name}. You see every agent's contacts as an org admin.`
                : "Your buyers, sellers and leads. Open one to see its activity and apps."}
            </p>
          </div>
        </div>
        <ContactsTable rows={rows} stages={[...STAGES]} showOwner={user.role === "admin"} />
      </main>
    </>
  );
}
