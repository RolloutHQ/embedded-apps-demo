# Lintel, the demo embedded app

Lintel is a made-up lead-intelligence app for agent websites. In the Embedded
Apps Marketplace it's the **app publisher**: Rollout loads its page on a
contact in any CRM that approved it, with a signed context saying who is
looking at which contact.

On a contact, Lintel shows a lead score, the homes the lead keeps viewing and
saving, their saved searches, site visits, and a value estimate for their own
home. It's all generated from the context's `crm.personId`, so a contact
always shows the same story.

## What Lintel built for Rollout

Everything Rollout-specific is in [`src/rollout/`](src/rollout), plus the app
URL page, [`src/app/embed/page.tsx`](src/app/embed/page.tsx):

| File | What it does |
| --- | --- |
| [`verify-context.ts`](src/rollout/verify-context.ts) | The check from "Verify the context": HMAC-SHA256 hex of the raw `context` with `ROLLOUT_CLIENT_SECRET`, constant-time compare, base64url decode, `x.exp`, `x.jti` replay. |
| [`replay-store.ts`](src/rollout/replay-store.ts) | Remembers accepted `x.jti` values until they expire. In memory. |
| [`AppScript.tsx`](src/rollout/AppScript.tsx) | `<script type="module" src="https://universal.rollout.com/api/embedded-apps/app-v1.js">`: the handshake and the height reports. |
| [`framing-headers.ts`](src/rollout/framing-headers.ts) | No `X-Frame-Options`. With `ROLLOUT_FRAME_ANCESTORS` set, a CSP `frame-ancestors` with Rollout's origin, the dashboard (for previews) and those CRM origins. |
| [`ConnectButton.tsx`](src/rollout/ConnectButton.tsx), [`connect-token.ts`](src/rollout/connect-token.ts), [`connect-actions.ts`](src/rollout/connect-actions.ts), [`agent-links.ts`](src/rollout/agent-links.ts), [`NotifyOpener.tsx`](src/rollout/NotifyOpener.tsx) | Optional **Connect** flow from "Build the page": a popup with a short-lived single-use token, link `(x.marketplaceId, user.id)`, tell the frame, and `reload()`. |
| [`config.ts`](src/rollout/config.ts) | Reads `ROLLOUT_CLIENT_SECRET` and `ROLLOUT_ORIGIN`. |

What `/embed` does on each launch:

- **Bad, expired or reused context**: a short "Open Lintel from your CRM"
  page and **no app script**, so inside a CRM Rollout keeps the frame hidden.
- **Preview** (`x.preview: true`, from the dashboard's signed sample or a
  CRM's review): sample data, a "Preview with sample data" note, and no
  Connect button. The preview's made-up agent is never linked.
- **Real launch**: the lead for `crm.personId`, named with `person.firstName`.
  A **Connect Lintel** button until the agent links their account.

**Any width.** The panel lays itself out by its own width with CSS container
queries: two columns from 560px, stacked below that, and a compact layout
under 420px for CRM sidebars like Follow Up Boss's. Rollout sizes the frame's
height to the content at every width.

The app has a **How this works** page (`/how-it-works`) that shows these files
with their real code.

## Run it

```bash
cp .env.example .env.local   # set ROLLOUT_CLIENT_SECRET
npm install
npm run dev                  # http://localhost:3001
```

| Variable | |
| --- | --- |
| `ROLLOUT_CLIENT_SECRET` | Rollout dashboard → **API** → **Current secret**. Server only. |
| `ROLLOUT_ORIGIN` | Defaults to `https://universal.rollout.com`. |
| `ROLLOUT_FRAME_ANCESTORS` | Optional. CRM page origins, to restrict framing. Read by `next.config.ts`, so set it at build time. |
| `ROLLOUT_DASHBOARD_ORIGIN` | Optional. Defaults to `https://dashboard.universal.rollout.com`. |

## Test the signature check

**With Rollout:** register the app with App URL `http://localhost:3001/embed`
(http is allowed on localhost), then choose **Test the signature check** on the
app's page in the dashboard and open the URL it gives you. Contexts last five
minutes, and each opens once: opening the same URL again is refused.

**Without Rollout:** sign a sample with any test secret, the same one the app
runs with:

```bash
ROLLOUT_CLIENT_SECRET=test-secret npm run sample                # a real-looking launch
ROLLOUT_CLIENT_SECRET=test-secret npm run sample -- --preview   # a preview
```

In development, `http://localhost:3001/dev/sample` (add `?preview` for a
preview) signs one with `ROLLOUT_CLIENT_SECRET` and redirects to it. It answers
404 in production.

`/sample` is the panel on its own with sample data: no context, no app script,
nothing verified. It's public, so a docs page can frame it to show what the app
looks like (live at <https://lintel-app-demo.vercel.app/sample>). It isn't the
app URL, and `/embed` still refuses anything unsigned.

## Demo limits

The replay store, the agent links and the used connect tokens live in memory.
That's fine on one server. On serverless hosts each instance has its own
memory, so a replayed URL might be accepted by another instance, and a
connected agent might see **Connect Lintel** again. A real app keeps these in
Redis or its database. The Connect popup's sign-in is a demo with no password.

## Checks

```bash
npm run typecheck
npm run lint
npm run build
```
