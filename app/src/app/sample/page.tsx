// Demo helper, not part of a real app: the panel on its own, with sample data
// and no Rollout context, so a docs page can frame it and show what an
// embedded app looks like. It is not the app URL. /embed is, and /embed still
// refuses anything without a signed context.
//
// It verifies nothing and links nobody, so it shows only made-up data, and it
// doesn't load Rollout's app script: no Rollout frame is around it to answer.
import type { Metadata } from "next";

import { LeadPanel } from "@/components/LeadPanel";
import { leadIntel } from "@/lib/leads";

export const metadata: Metadata = { title: "Sample", robots: { index: false } };

export default function SamplePage() {
  return (
    <LeadPanel
      intel={leadIntel("c_melissa_hartman", "Melissa")}
      agentName="Dana Okafor"
      preview
      account={<span className="chip">Sample data</span>}
    />
  );
}
