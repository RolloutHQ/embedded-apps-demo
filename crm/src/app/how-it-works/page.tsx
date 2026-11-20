import type { Metadata } from "next";
import { highlight } from "sugar-high";

import { Topbar } from "@/components/Topbar";
import sources from "@/generated/rollout-sources.json";

export const metadata: Metadata = { title: "How this works" };
// The real files from src/rollout, snapshotted by scripts/snapshot-sources.mjs.

const FILES = [
  {
    file: "src/rollout/user-token.ts",
    title: "Sign the user token",
    about:
      "Signs a ten-minute JWT for the signed-in user with HS256 and the client secret: iss is the tenant id, sub the user's id, and rollout.com carries the scopes and the embed claims (org, user, account, and the contact on screen as person).",
  },
  {
    file: "src/rollout/token-routes.ts",
    title: "The two token endpoints",
    about:
      "GET /api/rollout/apps-token?personId=… checks the user may see that contact, then signs an embed:render token for it. GET /api/rollout/marketplace-token signs embed:enable, plus embed:enable_org for org admins only. The route files under src/app/api/rollout only re-export these.",
  },
  {
    file: "src/rollout/EmbeddedApps.tsx",
    title: "Mount the apps on a contact",
    about:
      "The Apps tab. Calls mountEmbeddedApps() with the marketplace id, the contact as the record, and a getToken that asks our token endpoint. setRecord() follows the contact on screen, unmount() cleans up.",
  },
  {
    file: "src/rollout/Marketplace.tsx",
    title: "Mount the marketplace",
    about:
      "Settings, Apps. Calls mountEmbeddedAppMarketplace() with the marketplace token. Rollout lists the approved apps with a switch for each scope this user may turn them on for. Styled with the --rollout-* custom properties in globals.css.",
  },
  {
    file: "src/rollout/host-library.ts",
    title: "Load Rollout's host library",
    about:
      "Imports host-v1.js from Rollout's origin at runtime. It isn't an npm package, so Rollout ships fixes without a redeploy. The types describe the parts Stoop uses.",
  },
  {
    file: "src/rollout/content-security-policy.ts",
    title: "Allow Rollout in the CSP",
    about:
      "Rollout's origin in script-src (the library), frame-src (the Rollout frame), connect-src (the marketplace's requests) and img-src (the app icons). Nothing from app publishers. Sent on every page from next.config.ts.",
  },
  {
    file: "src/rollout/config.ts",
    title: "Configuration",
    about: "Every Rollout value comes from the environment: ROLLOUT_ORIGIN, ROLLOUT_TENANT_ID, ROLLOUT_CLIENT_SECRET and ROLLOUT_MARKETPLACE_ID.",
  },
];

const read = (file: string) => (sources as Record<string, string>)[file] ?? `// ${file} not found: run npm run dev or npm run build`;
const anchor = (file: string) => file.split("/").pop()!.replace(/\W+/g, "-");

export default function HowItWorksPage() {
  return (
    <>
      <Topbar crumbs={[{ label: "How this works" }]} />
      <main className="page hiw">
        <div className="page-head">
          <div>
            <h1 className="page-title">What Stoop built for Rollout</h1>
          </div>
        </div>
        <p className="hiw-intro">
          Stoop is the marketplace owner. To show other companies&apos; apps on its contacts, it added two token
          endpoints on its server, two components on its pages, and a few lines of CSP. Rollout runs everything else:
          the frame the apps load in, signing each launch, and onboarding the app publishers. All of it lives in{" "}
          <code>src/rollout/</code>.
        </p>

        <ol className="flow">
          <li>
            <b>1. Stoop&apos;s server</b>
            <p>Signs a short-lived token for the agent and the contact on screen.</p>
          </li>
          <li>
            <b>2. The Apps tab</b>
            <p>mountEmbeddedApps() loads Rollout&apos;s frame with that token.</p>
          </li>
          <li>
            <b>3. Rollout</b>
            <p>Finds the apps this agent or office turned on, and signs a context for each.</p>
          </li>
          <li>
            <b>4. Each app</b>
            <p>Checks the signature on its own server and shows what it knows about the contact.</p>
          </li>
        </ol>

        <h2 className="section-title">The files</h2>
        <nav className="filelist" aria-label="Rollout files">
          {FILES.map((f) => (
            <a key={f.file} href={`#${anchor(f.file)}`}>
              <code>{f.file}</code>
              <span>{f.title}</span>
            </a>
          ))}
        </nav>
        <p className="not-built">
          Not built by Stoop: the app frames, the signing of each app&apos;s context, the marketplace&apos;s storage of who
          turned what on, and the review of each app. Rollout runs those.
        </p>

        {FILES.map((f) => (
          <section className="file" id={anchor(f.file)} key={f.file}>
            <h2>
              {f.title} <code>{f.file}</code>
            </h2>
            <p>{f.about}</p>
            <pre className="code">
              <code dangerouslySetInnerHTML={{ __html: highlight(read(f.file)) }} />
            </pre>
          </section>
        ))}
      </main>
    </>
  );
}
