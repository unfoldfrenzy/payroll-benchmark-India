```markdown
# SMB Payroll Benchmark — GitHub Pages + Actions + Formspree (Beginner setup)

What this repo contains
- A React frontend (frontend/) that renders a comparison UI and a lead form (Formspree).
- A lightweight scraper script (scripts/scrape-sources.js) that writes canonical data to data/benchmarks.json. (Starter: mock/simple adapter; replace with real adapters later.)
- A GitHub Actions workflow (.github/workflows/sync-benchmarks.yml) that:
  - Runs the scraper on schedule (nightly) and on workflow_dispatch,
  - Builds the React app and places build output in docs/,
  - Commits updated docs/ and data/benchmarks.json to the repo so GitHub Pages can serve the site.
- docs/ is the publish directory for GitHub Pages (automatically created by the workflow).

Quick benefits
- Free for public repositories.
- Everything versioned in git (audit trail of data changes).
- No server to manage. Use Formspree to capture leads (or substitute your form provider / Zapier).

Before you start (placeholders to replace)
- Formspree form endpoint: replace YOUR_FORMSPREE_ID in frontend/src/components/LeadForm.jsx with your Formspree form ID (e.g. https://formspree.io/f/mnqrxyz).
- Scraper: scripts/scrape-sources.js currently writes sample data. Replace adapter logic with real scraping or API fetching as you’re allowed to (respect robots.txt and ToS).
- Competitors: add vendor URLs to the scraper list.

How to try locally
1. Install Node (>=16 recommended).
2. Clone repo and run the scraper and build flow locally:
   - npm ci
   - npm run scrape   # generates data/benchmarks.json (sample)
   - npm run build    # builds frontend and copies to docs/
3. Serve docs/ locally to sanity-check (e.g., serve with a static server or use the React dev server for local dev):
   - cd frontend && npm ci && npm start (for dev hot reload, frontend will fetch /data/benchmarks.json from the repo root in production; in dev you can copy data/benchmarks.json to frontend/public/data/).

Enable GitHub Pages
1. In your repository, go to Settings → Pages.
2. Source: Branch: main (or your default) / folder: /docs.
3. Save — GitHub Pages will serve the site at https://<owner>.github.io/<repo>/ once the docs/ folder exists (the first run of the workflow will create it).

GitHub Actions workflow
- Located at .github/workflows/sync-benchmarks.yml.
- Runs nightly at 02:00 UTC and on manual dispatch.
- Steps: checkout, node setup, npm ci, npm run scrape, npm run build, commit & push docs/ and data/benchmarks.json.

Formspree lead form behavior
- The frontend posts lead data to Formspree endpoint and shows success / error message.
- Keep the consent toggle checked by default? We include an explicit consent checkbox to comply with best privacy practices.
- For CRM forwarding: use Formspree's integrations or route the Formspree webhook to Zapier/Make to push to HubSpot / Zoho.

Security & Privacy notes
- If you capture PII, configure Formspree retention and forwarding settings to match your privacy policy and local regulations.
- If you add server-side lead forwarding later (e.g., using Vercel functions), keep API keys on server-side secrets and do not expose them in the client.

Next steps you can ask me to do
- Implement real scrapers/adapters for specific competitor URLs you give me.
- Replace Formspree with server-side forwarding to your CRM (HubSpot, Zoho).
- Add evidence modal, filters, and improved mobile UX in the React frontend.

```
