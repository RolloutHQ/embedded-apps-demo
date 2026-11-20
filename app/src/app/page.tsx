import Link from "next/link";

import { LeadPanel } from "@/components/LeadPanel";
import { SiteNav } from "@/components/SiteNav";
import { leadIntel } from "@/lib/leads";

export default function Home() {
  return (
    <main className="site">
      <SiteNav />
      <section className="hero">
        <div>
          <h1>Know which leads are ready before they call.</h1>
          <p>
            Lintel watches what your leads do on your website: the homes they keep reopening, the searches they save,
            what their own home is worth. Now it shows up right on the contact in your CRM.
          </p>
          <div className="hero-actions">
            <Link className="button" href="/how-it-works">
              See what Lintel built for Rollout
            </Link>
          </div>
        </div>
        <div className="hero-shot" aria-label="Lintel on a contact, as agents see it in their CRM">
          <LeadPanel
            intel={leadIntel("c_melissa_hartman", "Melissa")}
            agentName="Dana Okafor"
            preview={false}
            account={<span className="chip connected">Connected to Dana&apos;s site</span>}
          />
        </div>
      </section>
      <section className="demo-steps">
        <div>
          <h2>Registered once</h2>
          <p>
            Lintel&apos;s app URL, <code>/embed</code>, is registered with Rollout and listed in each CRM&apos;s
            marketplace.
          </p>
        </div>
        <div>
          <h2>Checked on every launch</h2>
          <p>Rollout signs who&apos;s looking at which contact. Lintel&apos;s server checks that signature before it shows anything.</p>
        </div>
        <div>
          <h2>Same page everywhere</h2>
          <p>One page, one script tag. Rollout shows it and sizes it in every CRM that approves it.</p>
        </div>
      </section>
    </main>
  );
}
