# Rollout Embedded Apps Marketplace demo

Two small products that show Rollout's Embedded Apps Marketplace end to end,
for sales demos.

**Live:** Stoop, the CRM, at <https://stoop-crm-demo.vercel.app>, and Lintel,
the app, at <https://lintel-app-demo.vercel.app>. Each has a **How this
works** page with its Rollout code:
[Stoop's](https://stoop-crm-demo.vercel.app/how-it-works),
[Lintel's](https://lintel-app-demo.vercel.app/how-it-works).

| | Folder | Plays | What it built for Rollout |
| --- | --- | --- | --- |
| **Stoop** | [`crm/`](crm) | The **marketplace owner**: a real-estate CRM that shows other companies' apps on its contacts. | Two token endpoints, `mountEmbeddedApps()` on the contact's Apps tab, `mountEmbeddedAppMarketplace()` on Settings → Apps, and a CSP. All in [`crm/src/rollout/`](crm/src/rollout). |
| **Lintel** | [`app/`](app) | The **app publisher**: a lead-intelligence app for agent websites that shows up inside the CRM. | One page that verifies Rollout's signed context and loads Rollout's app script, plus an optional Connect popup. All in [`app/src/rollout/`](app/src/rollout) and [`app/src/app/embed/`](app/src/app/embed). |

Each is its own Next.js app with its own `package.json`, `.env.example` and
README. They share no code. Each has a **How this works** page that shows its
Rollout files with their real code, for the "here's all they had to build"
part of the demo.

```
Agent opens Melissa in Stoop
  → Stoop's server signs a user token for Dana and Melissa      (crm/src/rollout/user-token.ts)
  → Stoop's Apps tab: mountEmbeddedApps() loads Rollout's frame  (crm/src/rollout/EmbeddedApps.tsx)
  → Rollout finds the apps Dana or her office turned on, signs a context for each
  → Rollout loads Lintel's /embed?context=…&signature=…
  → Lintel's server checks the signature, expiry and replay      (app/src/rollout/verify-context.ts)
  → Lintel's page loads app-v1.js; Rollout shows it, sized to fit (app/src/rollout/AppScript.tsx)
```

## Run both locally

You need Node 20 or later.

```bash
cd crm && cp .env.example .env.local && npm install && npm run dev   # http://localhost:3000
```

```bash
cd app && cp .env.example .env.local && npm install && npm run dev   # http://localhost:3001
```

Fill in the `.env.local` files first (see each README). Without Rollout
credentials:

- Stoop runs, and its Apps tab and Settings → Apps say what to configure.
- Lintel runs, and you can check its verification with a sample you sign
  yourself: `ROLLOUT_CLIENT_SECRET=<the app's secret> npm run sample`, or
  `http://localhost:3001/dev/sample` in development.

To see Lintel **inside** Stoop locally, Rollout's side has to be set up as in
[the checklist](LIVE-DEMO-CHECKLIST.md), with `http://localhost:3000` under
the marketplace's **Pages that may show the apps** and
`http://localhost:3001/embed` as the app URL.

## Deploy

Two separate projects, root directories `crm` and `app`. See
[DEPLOY.md](DEPLOY.md) for Vercel, and Cloudflare Workers as a free
alternative.

## Set up Rollout for the live demo

[LIVE-DEMO-CHECKLIST.md](LIVE-DEMO-CHECKLIST.md) lists what Rollout has to
create: the marketplace, the publisher account, the app, its listing and
approval, and turning it on for the demo user.

## Running the demo

1. Open Stoop as **Dana** (agent). Open **Melissa Hartman**, then the **Apps**
   tab: Lintel shows her lead score, the homes she keeps reopening, and her
   home's value.
2. Use the arrows to go to the next contact: Lintel follows with that lead.
3. Choose **Connect Lintel** to show the popup sign-in and the frame reloading
   connected.
4. Switch to **Marcus** (org admin), go to **Apps**, and turn Lintel on with
   **Enable for my org**. Switch back to **Dana**: her card shows Lintel on,
   "Enabled by your org", and only an admin can turn it off.
5. Open **How this works** in each app to show how little each side built.
