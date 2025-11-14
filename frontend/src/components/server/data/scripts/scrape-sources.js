/**
 * Example adapter runner: each vendor gets its own adapter that returns canonical fields.
 * Important: respect robots.txt and rate limits. Use official APIs if available.
 *
 * This script demonstrates structure; replace HTML parsing with robust selectors (cheerio).
 */
const fetch = require("node-fetch");
const fs = require("fs");
const path = require("path");
const cheerio = require("cheerio");

async function fetchPricingFromVendor(url) {
  const res = await fetch(url, { headers: { "User-Agent": "BenchmarkBot/1.0 (+yourdomain.com)" }});
  const html = await res.text();
  const $ = cheerio.load(html);
  // This is vendor-specific. Example:
  const priceText = $(".pricing .per-employee").first().text().trim(); // placeholder
  // parse priceText like "₹50 / emp / mo"
  return { price_text: priceText, source_url: url };
}

async function main() {
  const vendors = [
    { id: "our-product", url: "https://acmepayroll.example/pricing" },
    { id: "competitor-1", url: "https://comppayroll.example/pricing" }
  ];

  const results = [];
  for (const v of vendors) {
    try {
      const p = await fetchPricingFromVendor(v.url);
      // Map to canonical format (example transformation)
      results.push({
        id: v.id,
        name: v.id,
        price_per_emp: parseInt(p.price_text.replace(/\D/g, "")) || null,
        evidence: [{ type: "pricing_page", url: v.url, fetched_at: new Date().toISOString() }]
      });
    } catch (err) {
      console.error("Error fetching", v.url, err);
    }
  }

  const outFile = path.join(__dirname, "../data/benchmarks.json");
  fs.writeFileSync(outFile, JSON.stringify(results, null, 2));
  console.log("Wrote", outFile);
}

if (require.main === module) main();
