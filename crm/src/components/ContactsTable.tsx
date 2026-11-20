"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

import type { Stage } from "@/lib/data";

export type Row = {
  id: string;
  name: string;
  initials: string;
  stage: Stage;
  owner: string;
  ownerInitials: string;
  source: string;
  city: string;
  budget: string;
  lastTouch: string;
  lastTouchDays: number;
  nextTask: string;
  nextDue: string;
  nextDueToday: boolean;
};

export function ContactsTable(props: { rows: Row[]; stages: Stage[]; showOwner: boolean }) {
  const router = useRouter();
  const [stageId, setStageId] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  const counts = useMemo(() => {
    const map = new Map<string, number>();
    for (const row of props.rows) map.set(row.stage.id, (map.get(row.stage.id) ?? 0) + 1);
    return map;
  }, [props.rows]);

  const visible = props.rows.filter(
    (row) =>
      (!stageId || row.stage.id === stageId) &&
      (!query || `${row.name} ${row.city} ${row.source}`.toLowerCase().includes(query.toLowerCase())),
  );

  return (
    <>
      <div className="toolbar">
        <button type="button" className="chip" aria-pressed={stageId === null} onClick={() => setStageId(null)}>
          All <span>{props.rows.length}</span>
        </button>
        {props.stages
          .filter((stage) => counts.has(stage.id))
          .map((stage) => (
            <button
              key={stage.id}
              type="button"
              className="chip"
              aria-pressed={stageId === stage.id}
              onClick={() => setStageId(stageId === stage.id ? null : stage.id)}
            >
              {stage.name} <span>{counts.get(stage.id)}</span>
            </button>
          ))}
        <input
          className="search"
          type="search"
          placeholder="Search name, city, source"
          aria-label="Search contacts"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>
      <div className="table-wrap">
        <table className="grid">
          <thead>
            <tr>
              <th>Name</th>
              <th>Stage</th>
              {props.showOwner && <th>Owner</th>}
              <th>City</th>
              <th>Source</th>
              <th>Budget</th>
              <th>Last touch</th>
              <th>Next task</th>
            </tr>
          </thead>
          <tbody>
            {visible.map((row) => (
              <tr key={row.id} onClick={() => router.push(`/contacts/${row.id}`)}>
                <td>
                  <div className="name-cell">
                    <span className="avatar" data-tone={row.stage.tone}>{row.initials}</span>
                    <Link href={`/contacts/${row.id}`} onClick={(e) => e.stopPropagation()}>{row.name}</Link>
                  </div>
                </td>
                <td><span className="pill" data-tone={row.stage.tone}>{row.stage.name}</span></td>
                {props.showOwner && (
                  <td>
                    <span className="name-cell" style={{ fontWeight: 400 }}>
                      <span className="avatar ink" style={{ width: 20, height: 20, fontSize: 9.5 }}>{row.ownerInitials}</span>
                      {row.owner}
                    </span>
                  </td>
                )}
                <td className="muted">{row.city}</td>
                <td className="muted">{row.source}</td>
                <td>{row.budget || <span className="faint">None set</span>}</td>
                <td className={row.lastTouchDays > 14 ? "faint" : undefined}>{row.lastTouch}</td>
                <td>
                  {row.nextTask ? (
                    <>
                      {row.nextTask}{" "}
                      <span className={row.nextDueToday ? "overdue" : "faint"}>{row.nextDue}</span>
                    </>
                  ) : (
                    <span className="faint">Nothing scheduled</span>
                  )}
                </td>
              </tr>
            ))}
            {visible.length === 0 && (
              <tr className="empty-row">
                <td colSpan={props.showOwner ? 8 : 7}>No contacts match. Clear the search or pick another stage.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
