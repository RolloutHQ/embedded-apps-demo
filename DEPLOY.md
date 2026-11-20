# Deploying the demo

Deploy **two separate projects** from this one repository:

| Project | Root directory | Suggested name | URL you'll get |
| --- | --- | --- | --- |
| Stoop, the CRM | `crm` | `stoop-demo` | `https://stoop-demo.vercel.app` |
| Lintel, the app | `app` | `lintel-demo` | `https://lintel-demo.vercel.app` |

Deploy **Lintel first**: Rollout needs its URL to register the app. Then
deploy Stoop and give Rollout its origin for the marketplace.

Never commit `.env.local` or real secrets. Both `.gitignore` files exclude
them. Put secrets in the host's environment settings.

## Vercel

The free Hobby plan is enough for a demo.

1. Push this repository to GitHub, GitLab or Bitbucket.
2. **Lintel**: in Vercel, **Add New → Project**, import the repository, and set:
   - **Root Directory**: `app`
   - **Framework Preset**: Next.js (detected)
   - **Environment Variables**:
     - `ROLLOUT_CLIENT_SECRET`: the publisher's **Current secret**, from the
       publisher's Rollout dashboard → **API**
     - `ROLLOUT_ORIGIN`: leave unset for `https://universal.rollout.com`
   - Deploy. Note the URL. The app URL for Rollout is `https://<lintel-domain>/embed`.
3. **Stoop**: **Add New → Project** again, import the same repository, and set:
   - **Root Directory**: `crm`
   - **Environment Variables**: `ROLLOUT_TENANT_ID`, `ROLLOUT_CLIENT_SECRET`
     and `ROLLOUT_MARKETPLACE_ID` from the marketplace owner's Rollout
     dashboard (**API**, and **Marketplace → Settings**).
   - Deploy. Note the origin, such as `https://stoop-demo.vercel.app`.
4. Give Rollout both URLs (see [the checklist](LIVE-DEMO-CHECKLIST.md)).

Or from the command line, in each folder:

```bash
npx vercel link        # pick or create the project; set its root directory to this folder
npx vercel env add ROLLOUT_CLIENT_SECRET production
npx vercel --prod
```

### Things to know on Vercel

- **Turn off Deployment Protection for production**, or at least make sure
  the production domains are public (**Settings → Deployment Protection**).
  Rollout's frame can't load a page behind Vercel's login, and neither can the
  dashboard's preview.
- **Use the production domain**, not a per-deployment URL. Rollout matches
  the CRM's exact origin, and the app URL is fixed per app. Changing the app
  URL sends the listing back to review.
- **Changing env vars needs a redeploy.** `ROLLOUT_ORIGIN` (Stoop's CSP) and
  `ROLLOUT_FRAME_ANCESTORS` (Lintel's framing) are read by `next.config.ts` at
  build time.
- **In-memory stores.** Lintel's replay check and Connect links live in each
  serverless instance's memory. For a demo that's fine; see "Demo limits" in
  [app/README.md](app/README.md).

## Cloudflare Workers (free alternative)

Cloudflare's free Workers plan runs Next.js through the OpenNext adapter
(`@opennextjs/cloudflare`, which supports this repository's Next.js 16.4.6).
These steps follow OpenNext's guide; check
[opennext.js.org/cloudflare](https://opennext.js.org/cloudflare) if a command
has changed. Do this in each of `app` and `crm`:

1. Add the adapter and Wrangler:

   ```bash
   npm install @opennextjs/cloudflare
   npm install -D wrangler
   ```

2. Add `open-next.config.ts`:

   ```ts
   import { defineCloudflareConfig } from "@opennextjs/cloudflare";

   export default defineCloudflareConfig();
   ```

3. Add `wrangler.jsonc` (use `stoop-demo` in `crm`):

   ```jsonc
   {
     "name": "lintel-demo",
     "main": ".open-next/worker.js",
     "compatibility_date": "2026-11-01",
     "compatibility_flags": ["nodejs_compat", "global_fetch_strictly_public"],
     "assets": { "directory": ".open-next/assets", "binding": "ASSETS" }
   }
   ```

4. Add scripts to `package.json`:

   ```json
   "preview:cf": "opennextjs-cloudflare build && opennextjs-cloudflare preview",
   "deploy:cf": "opennextjs-cloudflare build && opennextjs-cloudflare deploy"
   ```

   In `crm`, run `node scripts/snapshot-sources.mjs` first (or make
   `deploy:cf` start with it), so the How this works page has the code.

5. Set the secrets, then deploy:

   ```bash
   npx wrangler login
   npx wrangler secret put ROLLOUT_CLIENT_SECRET
   # crm only:
   npx wrangler secret put ROLLOUT_TENANT_ID
   npx wrangler secret put ROLLOUT_MARKETPLACE_ID
   npm run deploy:cf
   ```

   Variables `next.config.ts` reads at build time (`ROLLOUT_ORIGIN`,
   `ROLLOUT_FRAME_ANCESTORS`) must be in the shell environment when you run
   the build, not only Worker secrets.

You'll get `https://lintel-demo.<your-subdomain>.workers.dev` and
`https://stoop-demo.<your-subdomain>.workers.dev`. Add `.dev.vars` and
`.open-next/` to `.gitignore` (already listed).

Workers isolates have their own memory too, so the same "Demo limits" apply.

The Cloudflare steps are written from OpenNext's documented setup and were
not run against this repository yet; the Vercel path is the simpler one.

## After deploying

1. Open `https://<lintel-domain>/embed` with no parameters: you should see
   "Open Lintel from your CRM".
2. In the publisher's Rollout dashboard, **Test the signature check** on the
   app: the sample should show Lintel with "Preview with sample data". Opening
   the same sample URL a second time should be refused (replay check).
3. Open Stoop, a contact, and the **Apps** tab. If it stays on "Still waiting
   on Rollout", the browser console will show a `frame-ancestors` error: add
   Stoop's exact origin under **Pages that may show the apps**.
