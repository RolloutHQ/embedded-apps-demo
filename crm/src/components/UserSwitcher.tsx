"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";

import { switchUser } from "@/lib/actions";

const OPTIONS = [
  { key: "dana", label: "Agent" },
  { key: "marcus", label: "Org admin" },
];

export function UserSwitcher(props: {
  user: { key: string; name: string; initials: string; title: string };
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  return (
    <div className="switcher" aria-busy={pending}>
      <div className="switcher-who">
        <span className="avatar lg ink">{props.user.initials}</span>
        <div>
          <strong>{props.user.name}</strong>
          <span>{props.user.title}</span>
        </div>
      </div>
      <div className="segmented" role="group" aria-label="Sign in as">
        {OPTIONS.map((option) => (
          <button
            key={option.key}
            type="button"
            aria-pressed={props.user.key === option.key}
            onClick={() =>
              startTransition(async () => {
                await switchUser(option.key);
                router.refresh();
              })
            }
          >
            {option.label}
          </button>
        ))}
      </div>
      <p className="switcher-note">Demo sign-in. Both work at Harbor &amp; Pine Realty.</p>
    </div>
  );
}
