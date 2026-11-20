# Live demo checklist: what Rollout sets up

## Current setup (done)

The live demo runs on two Rollout tenants, as a real CRM and a real app
publisher would:

| Side | Rollout tenant | What's set up there |
| --- | --- | --- |
| Marketplace owner (Stoop) | **Rollout Test** | "Rollout test marketplace", with `https://stoop-crm-demo.vercel.app` and `http://localhost:3000` under Pages that may show the apps. Lintel's listing approved. |
| App publisher (Lintel) | **Rollout Dev** | Lintel registered with App URL `https://lintel-app-demo.vercel.app/embed`, listed in Rollout test marketplace. |

Vercel environment (all set as encrypted variables, none in the repo):

| Project | Variables |
| --- | --- |
| `stoop-crm-demo` | `ROLLOUT_TENANT_ID` and `ROLLOUT_CLIENT_SECRET` from Rollout Test, `ROLLOUT_MARKETPLACE_ID` of Rollout test marketplace |
| `lintel-app-demo` | `ROLLOUT_CLIENT_SECRET`: Rollout Dev's Current secret |

Lintel is turned on for Dana (`usr_dana_okafor`). To demo the org switch,
sign in to Stoop as Marcus and use Enable for my org.

If a secret is rotated in either tenant, update that project's
`ROLLOUT_CLIENT_SECRET` (`vercel env add ROLLOUT_CLIENT_SECRET production
--sensitive --force` in `crm` or `app`) and redeploy it.

The rest of this page is the from-scratch checklist.

Rollout sets up marketplace owners and app publishers itself. For the demo,
that's two Rollout tenants, one for each side, so each has its own client
secret, as real customers would.

The two deployed URLs ([DEPLOY.md](DEPLOY.md)):

| | Value |
| --- | --- |
| Stoop's origin | `https://stoop-crm-demo.vercel.app` |
| Lintel's app URL | `https://lintel-app-demo.vercel.app/embed` |

## 1. Marketplace owner: Stoop

- [ ] Create a tenant for Stoop and turn on its **Marketplace** section.
- [ ] Create Stoop's marketplace, tied to that tenant.
- [ ] **Marketplace → Settings**:
  - [ ] **Name**: Stoop. **Description**: "Apps for Stoop, the CRM for
    Harbor & Pine Realty's agents."
  - [ ] **Visibility**: Public (so the publisher can list in it), or Invite
    only once Lintel is listed.
  - [ ] **Who your users can enable apps for**: both **For themselves** and
    **For their org**, so the demo shows both switches.
  - [ ] **Pages that may show the apps**: Stoop's deployed origin. Add
    `http://localhost:3000` too, to demo from a laptop.
- [ ] Copy into Stoop's environment (Vercel or Cloudflare):
  - [ ] `ROLLOUT_TENANT_ID`: the client id from **API**
  - [ ] `ROLLOUT_CLIENT_SECRET`: a client secret from **API**
  - [ ] `ROLLOUT_MARKETPLACE_ID`: from **Marketplace → Settings**
- [ ] Redeploy Stoop, then open a contact's Apps tab: it should show "No apps
  on yet" (not an error).

## 2. App publisher: Lintel

- [ ] Create a tenant for Lintel and turn on its **Embedded apps** section.
- [ ] Copy its **Current secret** (dashboard → **API**) into Lintel's
  environment as `ROLLOUT_CLIENT_SECRET`, and redeploy Lintel.
- [ ] **Embedded apps → Apps → Register an app**:
  - [ ] **Name**: Lintel
  - [ ] **App URL**: Lintel's app URL, `https://…/embed`
  - [ ] **Tagline**: "See which leads are ready: homes they view, searches
    they save, and what their home is worth."
  - [ ] **Description**: "Lintel tracks what your leads do on your agent
    website. On each contact it shows a lead score, the homes they keep
    reopening and saving, their saved searches, and a value estimate for
    their own home."
  - [ ] **Icon**: [`app/public/lintel-icon.png`](app/public/lintel-icon.png)
    (512×512 PNG)
  - [ ] **Support URL** and **Privacy policy URL**: optional. Lintel's
    `https://lintel-app-demo.vercel.app/how-it-works` works as a support link for the demo.
- [ ] **Test the signature check**: the sample opens Lintel with "Preview with
  sample data". If it says "Open Lintel from your CRM", the secret doesn't
  match or the sample expired.

## 3. List and approve

- [ ] As Lintel: **Embedded apps → Marketplaces**, choose Stoop's marketplace,
  **List an app**, pick Lintel, add a message, **Submit for review**.
- [ ] As Stoop: **Marketplace → Listings**, check the live preview shows
  sample data, then **Approve**.
- [ ] Don't change Lintel's app URL after approval: that sends the listing
  back to review.

## 4. Turn it on for the demo users

The demo's users, in Stoop's tokens:

| User | `sub` | Org (`embed.org`) | Scopes on the marketplace token |
| --- | --- | --- | --- |
| Dana Okafor, agent | `usr_dana_okafor` | `office_harbor_pine` | `embed:enable` |
| Marcus Bell, org admin | `usr_marcus_bell` | `office_harbor_pine` | `embed:enable`, `embed:enable_org` |

- [ ] In Stoop, signed in as **Dana**, go to **Apps** and switch on **Enable
  for me** for Lintel. Or, as **Marcus**, switch on **Enable for my org** to
  turn it on for both.
- [ ] Open **Melissa Hartman → Apps**: Lintel shows with her data.

To reset between demos, turn the switches off again in **Apps**.

## Before each demo

- [ ] Stoop and Lintel production URLs load without a login wall (Vercel
  Deployment Protection off for production).
- [ ] The Apps tab shows Lintel within a few seconds. If it says "Still waiting
  on Rollout", check **Pages that may show the apps** for Stoop's exact
  origin.
- [ ] **Connect Lintel** opens a popup: allow popups for Stoop's domain in the
  demo browser.
