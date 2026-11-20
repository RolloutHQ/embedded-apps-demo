import { readFileSync } from "node:fs";
import path from "node:path";

import type { Metadata } from "next";
import { highlight } from "sugar-high";

import { SiteNav } from "@/components/SiteNav";

export const metadata: Metadata = { title: "How this works" };
// Rendered once at build time, reading the real files from src/rollout.
export const dynamic = "force-static";

const FILES = [
  {
    file: "src/rollout/verify-context.ts",
    title: "Verify the context",
    about:
      "Every launch arrives as /embed?context=…&signature=…. The server computes HMAC-SHA256 of the raw context with the client secret, compares it to the signature in constant time, decodes the base64url JSON, refuses it once x.exp has passed, and refuses an x.jti it has already seen.",
  },
  {
    file: "src/rollout/replay-store.ts",
    title: "Remember each context id",
    about: "Keeps every accepted x.jti until it expires, so a copied URL can't be opened twice. In memory for the demo; Redis or a table in production.",
  },
  {
    file: "src/rollout/AppScript.tsx",
    title: "The script tag",
    about:
      "Loads app-v1.js from Rollout. It answers Rollout's handshake so the frame is shown, and reports the page's height whenever it changes. It's only rendered after the context checks out, so a bad link never shows in a CRM.",
  },
  {
    file: "src/rollout/framing-headers.ts",
    title: "Let Rollout frame the page",
    about:
      "No X-Frame-Options, ever. If ROLLOUT_FRAME_ANCESTORS is set, Lintel sends frame-ancestors with those CRM origins plus Rollout's origin and the dashboard, which reviewers' previews load from.",
  },
  {
    file: "src/rollout/ConnectButton.tsx",
    title: "Connect, then reload()",
    about:
      "Sign-in happens in a popup, outside Rollout's frame. When the popup says it's done, reload() from the app script asks Rollout for a freshly signed context, and the page reloads connected.",
  },
  {
    file: "src/rollout/connect-token.ts",
    title: "The popup's single-use token",
    about: "Issued only for an agent in a verified context, good for ten minutes and one use, so the popup knows which agent to link.",
  },
  {
    file: "src/rollout/agent-links.ts",
    title: "Link the agent",
    about: "Remembers which Lintel account an agent is, keyed by (x.marketplaceId, user.id), because CRM user ids are only unique within one marketplace.",
  },
  {
    file: "src/rollout/connect-actions.ts",
    title: "The popup's sign-in",
    about: "Spends the token and saves the link. A real app signs the agent in first.",
  },
  {
    file: "src/rollout/NotifyOpener.tsx",
    title: "Tell the frame",
    about: "Posts lintel:signed-in to the frame that opened the popup, on Lintel's own origin only, then closes.",
  },
  {
    file: "src/app/embed/page.tsx",
    title: "The app URL",
    about:
      "Ties it together: verify, show nothing (and no script) when the check fails, show sample data and no Connect button on a preview (x.preview), and otherwise the lead for crm.personId.",
  },
  {
    file: "src/rollout/config.ts",
    title: "Configuration",
    about: "ROLLOUT_CLIENT_SECRET for the check, and ROLLOUT_ORIGIN for where the app script lives.",
  },
];

const read = (file: string) => readFileSync(path.join(/* turbopackIgnore: true */ process.cwd(), file), "utf8");
const anchor = (file: string) => path.basename(file).replace(/\W+/g, "-");

export default function HowItWorks() {
  return (
    <main className="site hiw">
      <SiteNav />
      <h1>What Lintel built for Rollout</h1>
      <p className="hiw-lede">
        Lintel is the app publisher. To show up on contacts in any CRM that runs a Rollout marketplace, it built one page
        that checks Rollout&apos;s signature and loads one script. Everything Rollout-specific is in{" "}
        <code>src/rollout/</code>, plus the page at <code>src/app/embed</code>.
      </p>

      <ol className="checks" aria-label="What happens on every launch">
        <li>
          <b>Signature</b>
          <span>HMAC-SHA256 of the raw context with the client secret, compared in constant time.</span>
        </li>
        <li>
          <b>Decode</b>
          <span>URL-safe base64 without padding, then JSON.</span>
        </li>
        <li>
          <b>Expiry</b>
          <span>Refused once x.exp has passed. Contexts last five minutes.</span>
        </li>
        <li>
          <b>Replay</b>
          <span>Refused if x.jti was already used.</span>
        </li>
      </ol>

      <ul className="hiw-files">
        {FILES.map((f) => (
          <li key={f.file}>
            <a href={`#${anchor(f.file)}`}>
              <code>{f.file}</code>
              <span>{f.title}</span>
            </a>
          </li>
        ))}
      </ul>

      {FILES.map((f) => (
        <section className="hiw-file" id={anchor(f.file)} key={f.file}>
          <h2>{f.title}</h2>
          <p className="path">{f.file}</p>
          <p>{f.about}</p>
          <pre className="code">
            <code dangerouslySetInnerHTML={{ __html: highlight(read(f.file)) }} />
          </pre>
        </section>
      ))}
    </main>
  );
}
