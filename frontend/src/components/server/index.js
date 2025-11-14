const express = require("express");
const fs = require("fs");
const path = require("path");
const bodyParser = require("body-parser");
const fetch = require("node-fetch"); // for forwarding to CRM

const app = express();
app.use(bodyParser.json());

const DATA_FILE = path.join(__dirname, "../data/benchmarks.json");

// GET /api/benchmarks
app.get("/api/benchmarks", (req, res) => {
  if (!fs.existsSync(DATA_FILE)) {
    return res.status(404).json({ error: "benchmarks not found" });
  }
  const raw = fs.readFileSync(DATA_FILE, "utf8");
  const json = JSON.parse(raw);
  res.json(json);
});

// POST /api/leads -> validate and forward to CRM (HubSpot/Zoho)
app.post("/api/leads", async (req, res) => {
  const { name, email, company, employees, phone, source, consent } = req.body;
  if (!email || !consent) return res.status(400).json({ error: "email and consent required" });

  // Persist locally (append to file) — in production push to DB or CRM
  const lead = { name, email, company, employees, phone, source, consent, created_at: new Date().toISOString() };
  const leadsFile = path.join(__dirname, "../data/leads.json");
  const existing = fs.existsSync(leadsFile) ? JSON.parse(fs.readFileSync(leadsFile)) : [];
  existing.push(lead);
  fs.writeFileSync(leadsFile, JSON.stringify(existing, null, 2));

  // Forward to HubSpot/Zoho via server-side request (example placeholder)
  try {
    // await fetch("https://api.hubapi.com/contacts/v1/contact", { method: "POST", headers: {...}, body: JSON.stringify(...) });
  } catch (e) {
    console.warn("Failed to forward to CRM", e);
  }

  res.json({ ok: true });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`API listening on ${PORT}`));
