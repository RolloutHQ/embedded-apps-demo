import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { ContactTabs } from "@/components/ContactTabs";
import { ChevronLeft, ChevronRight } from "@/components/icons";
import { Topbar } from "@/components/Topbar";
import {
  contactsForUser,
  dateFromDaysAgo,
  daysAgoLabel,
  dueLabel,
  findContactForUser,
  fullName,
  money,
  ownerOf,
  STAGES,
} from "@/lib/data";
import { getSignedInUser } from "@/lib/session";
import { hostLibraryUrl, isConfigured, marketplaceId } from "@/rollout/config";

type Props = { params: Promise<{ id: string }>; searchParams: Promise<{ tab?: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const user = await getSignedInUser();
  const contact = findContactForUser(user, (await params).id);
  return { title: contact ? fullName(contact) : "Contact" };
}

export default async function ContactPage({ params, searchParams }: Props) {
  const [{ id }, { tab }, user] = await Promise.all([params, searchParams, getSignedInUser()]);
  const contact = findContactForUser(user, id);
  if (!contact) notFound();

  const list = contactsForUser(user);
  const index = list.findIndex((c) => c.id === contact.id);
  const prev = list[index - 1];
  const next = list[index + 1];
  const tabQuery = tab ? `?tab=${encodeURIComponent(tab)}` : "";
  const stageIndex = STAGES.findIndex((s) => s.id === contact.stage.id);
  const owner = ownerOf(contact);
  const openTasks = contact.tasks.filter((t) => !t.done);
  const pipeline = contact.deals.filter((d) => d.stage !== "Closed").reduce((sum, d) => sum + d.value, 0);

  return (
    <>
      <Topbar
        crumbs={[{ label: "Contacts", href: "/contacts" }, { label: fullName(contact) }]}
        right={
          <span>
            {index + 1} of {list.length}
          </span>
        }
      />
      <main className="page">
        <div className="contact">
          <div>
            <div className="contact-head">
              <div style={{ minWidth: 0, flex: 1 }}>
                <h1 className="contact-name">{fullName(contact)}</h1>
                <div className="contact-meta">
                  <span className="pill" data-tone={contact.stage.tone}>{contact.stage.name}</span>
                  <span>{contact.city}</span>
                  <span>Owned by {owner.name}</span>
                  <span>Last touch {daysAgoLabel(contact.lastTouchDays).toLowerCase()}</span>
                </div>
              </div>
              <div className="pager">
                <Link
                  className="icon-btn"
                  href={prev ? `/contacts/${prev.id}${tabQuery}` : "#"}
                  aria-disabled={!prev}
                  aria-label={prev ? `Previous: ${fullName(prev)}` : "No previous contact"}
                >
                  <ChevronLeft />
                </Link>
                <Link
                  className="icon-btn"
                  href={next ? `/contacts/${next.id}${tabQuery}` : "#"}
                  aria-disabled={!next}
                  aria-label={next ? `Next: ${fullName(next)}` : "No next contact"}
                >
                  <ChevronRight />
                </Link>
              </div>
            </div>

            <div className="ladder" data-tone={contact.stage.tone} aria-label={`Stage ${stageIndex + 1} of ${STAGES.length}: ${contact.stage.name}`}>
              {STAGES.map((stage, i) => (
                <div
                  key={stage.id}
                  className={`rung${i < stageIndex ? " past" : ""}${i === stageIndex ? " current" : ""}`}
                >
                  <span>{stage.name}</span>
                  <i style={{ height: 6 + i * 4 }} />
                </div>
              ))}
            </div>

            <p className="contact-summary">{contact.summary}</p>

            <ContactTabs
              key={contact.id}
              initialTab={tab === "apps" || tab === "activity" ? tab : "overview"}
              contact={{ id: contact.id, firstName: contact.firstName }}
              activity={contact.activity.map((a) => ({ ...a, when: daysAgoLabel(a.daysAgo) }))}
              stats={[
                { label: "Open pipeline", value: pipeline ? money(pipeline) : "None" },
                { label: "Open tasks", value: String(openTasks.length) },
                { label: "In Stoop since", value: dateFromDaysAgo(contact.createdDays) },
              ]}
              rollout={
                isConfigured()
                  ? { configured: true, hostLibraryUrl, marketplaceId: marketplaceId() }
                  : { configured: false }
              }
            />
          </div>

          <aside className="rail">
            <section className="panel">
              <h3>Details</h3>
              <dl className="props">
                <dt>Email</dt>
                <dd>{contact.email}</dd>
                <dt>Phone</dt>
                <dd>{contact.phone}</dd>
                <dt>Source</dt>
                <dd>{contact.source}</dd>
                <dt>Budget</dt>
                <dd>{contact.budget ? `${money(contact.budget[0])} to ${money(contact.budget[1])}` : "None set"}</dd>
                <dt>Tags</dt>
                <dd style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                  {contact.tags.length ? contact.tags.map((t) => <span className="tag" key={t}>{t}</span>) : <span className="faint">None</span>}
                </dd>
              </dl>
            </section>
            <section className="panel">
              <h3>
                Deals <span className="faint">{contact.deals.length}</span>
              </h3>
              {contact.deals.length === 0 && <p className="faint" style={{ margin: 0 }}>No deals yet.</p>}
              {contact.deals.map((deal) => (
                <div className="deal" key={deal.name}>
                  <strong>{deal.name}</strong>
                  <span>
                    {deal.side} side, {money(deal.value)}, {deal.stage}
                    {deal.closeInDays ? `, closes in ${deal.closeInDays} days` : ""}
                  </span>
                </div>
              ))}
            </section>
            <section className="panel">
              <h3>
                Tasks <span className="faint">{openTasks.length}</span>
              </h3>
              {openTasks.length === 0 && <p className="faint" style={{ margin: 0 }}>Nothing scheduled.</p>}
              {openTasks.map((task) => (
                <label className="task" key={task.title}>
                  <input type="checkbox" />
                  <div>
                    {task.title}
                    <span className={task.dueInDays === 0 ? "overdue" : undefined}>{dueLabel(task.dueInDays)}</span>
                  </div>
                </label>
              ))}
            </section>
          </aside>
        </div>
      </main>
    </>
  );
}
