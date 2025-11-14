import React, { useEffect, useState } from "react";
import LeadForm from "./LeadForm";

const REFRESH_MS = 5 * 60 * 1000; // client-side refresh (in case page is open)

function deltaLabel(youValue, competitorValue, higherIsBetter = false) {
  if (youValue == null || competitorValue == null) return "";
  const diff = competitorValue - youValue;
  const pct = (Math.abs(diff) / (competitorValue || 1)) * 100;
  if (higherIsBetter) {
    return youValue > competitorValue ? `+${Math.round(pct)}% better` : `${Math.round(pct)}% worse`;
  }
  return youValue < competitorValue ? `-${Math.round(pct)}%` : `+${Math.round(pct)}%`;
}

export default function ComparisonTable() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  async function fetchData() {
    setLoading(true);
    try {
      const res = await fetch("/data/benchmarks.json", { cache: "no-store" });
      const json = await res.json();
      setData(json);
    } catch (e) {
      console.error("Failed to fetch benchmarks", e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
    const id = setInterval(fetchData, REFRESH_MS);
    return () => clearInterval(id);
  }, []);

  if (loading && !data) return <div>Loading benchmarks…</div>;
  if (!data) return <div>No benchmark data available.</div>;

  const you = data.find((r) => r.is_ours) || data[0];
  const competitors = data.filter((r) => !r.is_ours);

  const metrics = [
    { key: "price_per_emp", label: "Price / emp / mo (₹)", higherIsBetter: false },
    { key: "compliance_coverage_pct", label: "Compliance coverage (%)", higherIsBetter: true },
    { key: "onboarding_days", label: "Onboarding (days)", higherIsBetter: false },
    { key: "bank_integrations", label: "Bank integrations (count)", higherIsBetter: true },
    { key: "mobile_apps", label: "Mobile app available", higherIsBetter: true }
  ];

  return (
    <div>
      <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: 18 }}>
        <thead>
          <tr>
            <th style={{ textAlign: "left", padding: 8 }}>Metric</th>
            <th style={{ padding: 8 }}>{you.name}</th>
            {competitors.map((c) => (
              <th key={c.id} style={{ padding: 8 }}>{c.name}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {metrics.map((m) => (
            <tr key={m.key} style={{ borderTop: "1px solid #eee" }}>
              <td style={{ padding: 8 }}>{m.label}</td>
              <td style={{ padding: 8, background: "#f8fafc" }}>
                <strong>{String(you[m.key] ?? "—")}</strong>
              </td>
              {competitors.map((c) => (
                <td key={c.id} style={{ padding: 8 }}>
                  <div>{String(c[m.key] ?? "—")}</div>
                  <div style={{ color: "#666", fontSize: 12 }}>{deltaLabel(you[m.key], c[m.key], m.higherIsBetter)}</div>
                  <div style={{ marginTop: 6 }}>
                    {c.evidence && c.evidence.length > 0 ? (
                      <a href={c.evidence[0].url} target="_blank" rel="noreferrer">Evidence</a>
                    ) : (
                      <span style={{ color: "#999" }}>No evidence</span>
                    )}
                  </div>
                </td>
              ))}
            </tr>
          ))}

          <tr style={{ borderTop: "2px solid #ddd" }}>
            <td style={{ padding: 8 }}><strong>Get a tailored comparison</strong></td>
            <td style={{ padding: 8 }}>
              <button onClick={() => window.location.hash = "#lead"} style={{ padding: "8px 12px" }}>
                Schedule demo
              </button>
            </td>
            {competitors.map((c) => (
              <td key={c.id} style={{ padding: 8 }}>
                <button onClick={() => window.location.hash = `#lead?comp=${encodeURIComponent(c.id)}`} style={{ padding: "6px 10px" }}>
                  Get custom comparison
                </button>
              </td>
            ))}
          </tr>
        </tbody>
      </table>

      <section id="lead" style={{ padding: 12, border: "1px solid #eee", borderRadius: 6 }}>
        <h3>Request a custom payroll comparison</h3>
        <LeadForm />
      </section>
    </div>
  );
}
