/**
 * Simple starter "scraper" for beginners.
 * - Writes a canonical sample to data/benchmarks.json
 * - Replace vendor list and fetching logic with real adapters/APIs when ready.
 *
 * Important: when you implement real scraping, respect robots.txt and terms-of-service.
 */

const fs = require("fs");
const path = require("path");

const OUT_PATH = path.join(__dirname, "..", "data", "benchmarks.json");

const sampleData = [
  {
    id: "our-product",
    is_ours: true,
    name: "AcmePayroll (You)",
    price_per_emp: 50,
    compliance_coverage_pct: 95,
    onboarding_days: 3,
    bank_integrations: 5,
    mobile_apps: true,
    evidence: [
      { type: "note", url: "https://acmepayroll.example/pricing", fetched_at: new Date().toISOString() }
    ]
  },
  {
    id: "competitor-1",
    is_ours: false,
    name: "CompPayroll A",
    price_per_emp: 75,
    compliance_coverage_pct: 82,
    onboarding_days: 10,
    bank_integrations: 3,
    mobile_apps: false,
    evidence: [
      { type: "pricing_page", url: "https://comppayroll.example/pricing", fetched_at: new Date().toISOString() }
    ]
  },
  {
    id: "competitor-2",
    is_ours: false,
    name: "PayrollB",
    price_per_emp: 60,
    compliance_coverage_pct: 88,
    onboarding_days: 7,
    bank_integrations: 4,
    mobile_apps: true,
    evidence: [
      { type: "pricing_page", url: "https://payrollb.example/pricing", fetched_at: new Date().toISOString() }
    ]
  }
];

function ensureDir(filePath) {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function writeOut() {
  ensureDir(OUT_PATH);
  fs.writeFileSync(OUT_PATH, JSON.stringify(sampleData, null, 2), "utf8");
  console.log("Wrote sample benchmark data to", OUT_PATH);

  // If docs/data exists (after a build), copy it there as well so GitHub Pages serves the latest.
  const docsPath = path.join(__dirname, "..", "docs", "data", "benchmarks.json");
  ensureDir(docsPath);
  fs.writeFileSync(docsPath, JSON.stringify(sampleData, null, 2), "utf8");
  console.log("Also wrote sample data to", docsPath);
}

writeOut();
