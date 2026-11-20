# Stoop, the demo CRM

Stoop is a made-up real-estate CRM for Harbor & Pine Realty. In the Embedded
Apps Marketplace it's the **marketplace owner**: it shows other companies'
apps on its contacts, and lets agents and admins turn them on.

## What Stoop built for Rollout

Everything Rollout-specific is in [`src/rollout/`](src/rollout):

| File | What it does |
| --- | --- |
| [`user-token.ts`](src/rollout/user-token.ts) | Signs the user token: HS256 with `ROLLOUT_CLIENT_SECRET`, `iss` = `ROLLOUT_TENANT_ID`, `sub` = the user's id, `rollout.com.scopes`, and the embed claims (`org`, `user`, `account`, and `person` for the contact on screen). Ten minutes. |
| [`token-routes.ts`](src/rollout/token-routes.ts) | `GET /api/rollout/apps-token?personId=…` checks the user may see that contact, then signs `embed:render` for it. `GET /api/rollout/marketplace-token` signs `embed:enable`, plus `embed:enable_org` for the org admin. |
| [`EmbeddedApps.tsx`](src/rollout/EmbeddedApps.tsx) | The contact's Apps tab: `mountEmbeddedApps()`, `setRecord()` on another contact, `unmount()`. |
| [`Marketplace.tsx`](src/rollout/Marketplace.tsx) | Settings → Apps: `mountEmbeddedAppMarketplace()`, styled with the `--rollout-*` properties in `globals.css`. |
| [`host-library.ts`](src/rollout/host-library.ts) | Imports `host-v1.js` from Rollout's origin at runtime, with types for what Stoop uses. |
| [`content-security-policy.ts`](src/rollout/content-security-policy.ts) | Rollout's origin in `script-src`, `frame-src`, `connect-src` and `img-src`. Sent from `next.config.ts`. |
| [`config.ts`](src/rollout/config.ts) | Reads the `ROLLOUT_*` variables. |

**Two placements, one mount.** A contact's apps show either in the wide Apps
tab or in a narrow panel at the top of the right sidebar, as Follow Up Boss
places embedded apps (toggle on the Apps tab, or `?apps=sidebar` in the URL).
Both use the same `EmbeddedApps.tsx`; only the container differs. The
placement code lives in `src/components/` (`AppsPlacement.tsx`,
`AppsMount.tsx`, `RailApps.tsx`), because nothing about it is Rollout-specific.

The two files under `src/app/api/rollout/` are one-line route files that
re-export the handlers. Everything else in `src/` is the CRM itself. The app
has a **How this works** page (`/how-it-works`) that shows these files with
their real code.

## Run it

```bash
cp .env.example .env.local   # then fill in the three Rollout values
npm install
npm run dev                  # http://localhost:3000
```

| Variable | |
| --- | --- |
| `ROLLOUT_ORIGIN` | Defaults to `https://universal.rollout.com`. |
| `ROLLOUT_TENANT_ID` | Rollout dashboard → **API**: the client id. |
| `ROLLOUT_CLIENT_SECRET` | Rollout dashboard → **API**: a client secret. Server only. |
| `ROLLOUT_MARKETPLACE_ID` | Rollout dashboard → **Marketplace → Settings**. |

Without them the CRM still runs, and the Apps tab and Settings → Apps say
what's missing. For apps to actually load locally, the marketplace must list
`http://localhost:3000` under **Pages that may show the apps**.

`ROLLOUT_ORIGIN` is also read by `next.config.ts` for the CSP header, so set it
at build time too if you change it.

## Demo users

The sidebar switches between two users at Harbor & Pine Realty (a cookie, not
real sign-in):

- **Dana Okafor**, agent (`usr_dana_okafor`). Sees her own contacts. Her
  marketplace token has `embed:enable` only.
- **Marcus Bell**, org admin (`usr_marcus_bell`). Sees every contact in the
  office. His marketplace token adds `embed:enable_org`, so he gets the
  **Enable for my org** switch.

Both tokens carry `org: office_harbor_pine`, so an app Marcus turns on for the
org shows for Dana too. Dana opening another agent's contact by URL gets a 404
from the page and from the token endpoint.

## Checks

```bash
npm run typecheck
npm run lint
npm run build
```
