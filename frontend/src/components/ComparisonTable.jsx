import React, { useEffect, useState } from "react";

/**
 * ComparisonTable
 * - Fetches /api/benchmarks
 * - Auto-refreshes every 5 minutes
 * - Renders comparisons and CTAs to capture leads
 */

const REFRESH_MS = 5 * 60 * 1000;

function deltaLabel(youValue, competitorValue, higherIsBetter = false) {
  if (youValue == null || competitorValue == null) return "";
  const diff = competitorValue - youValue;
  const pct = (Math.abs(diff) / (competitorValue || 1)) * 100;
  if (higherIsBetter) {
    return youValue > competitorValue ? `+${Math.round(pct)}% better` : `${Math.round(pct)}% worse`;
  }
  return youValue < competitorValue ? `-${Math.round(pct)}%` : `+${Math.round(pct)}%`;
}

export default function ComparisonTable({ apiBase = "" }) {
  const [data, setData] = useState(null);
  const [filterSize, setFilterSize] = useState("1-20");
  const [loading, setLoading] = useState(true);

  async function fetchData() {
    setLoading(true);
    try {
      const res = await fetch(`${apiBase}/api/benchmarks`);
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
  if (!data) return <div>No data available</div>;

  const you = data.find((r) => r.is_ours) || data[0];
  const competitors = data.filter((r) => !r.is_ours);

  // Example metric ordering
  const metrics = [
    { key: "price_per_emp", label: "Price / emp / mo", higherIsBetter: false },
    { key: "compliance_coverage_pct", label: "Compliance coverage", higherIsBetter: true },
    { key: "onboarding_days", label: "Onboarding (days)", higherIsBetter: false },
    { key: "bank_integrations", label: "Bank integrations", higherIsBetter: true },
    { key: "mobile_apps", label: "Mobile app availability", higherIsBetter: true },
  ];

  return (
    <div className="comparison-root">
      <div className="controls" style={{ marginBottom: 12 }}>
        <label>
          Company size:
          <select value={filterSize} onChange={(e) => setFilterSize(e.target.value)} style={{ marginLeft: 8 }}>
            <option value="1-20">1–20</option>
            <option value="21-100">21–100</option>
            <option value="100+">100+</option>
          </select>
        </label>
      </div>

      <table className="comparison-table" style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={{ textAlign: "left", padding: 8 }}>Metric</th>
            <th style={{ padding: 8 }}>You</th>
            {competitors.map((c) => (
              <th key={c.id} style={{ padding: 8 }}>{c.name}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {metrics.map((m) => (
            <tr key={m.key}>
              <td style={{ padding: 8 }}>{m.label}</td>
              <td style={{ padding: 8, background: "#f8fafc" }}>
                <strong>{you[m.key] ?? "—"}</strong>
              </td>
              {competitors.map((c) => (
                <td key={c.id} style={{ padding: 8 }}>
                  <div>{c[m.key] ?? "—"}</div>
                  <div style={{ color: "#666", fontSize: 12 }}>{deltaLabel(you[m.key], c[m.key], m.higherIsBetter)}</div>
                  <div style={{ marginTop: 6 }}>
                    <a href={`/evidence?source=${encodeURIComponent(c.id)}`} onClick={(e) => {/* track click event if needed */}}>
                      Evidence
                    </a>
                  </div>
                </td>
              ))}
            </tr>
          ))}

          <tr>
            <td style={{ padding: 8 }}><strong>Compare</strong></td>
            <td style={{ padding: 8 }}>
              <button onClick={() => window.location.href = "/book-demo"} style={{ padding: "8px 12px" }}>
                Schedule Demo
              </button>
            </td>
            {competitors.map((c) => (
              <td key={c.id} style={{ padding: 8 }}>
                <button onClick={() => window.open(`/lead?comp=${encodeURIComponent(c.id)}`, "_blank")} style={{ padding: "6px 10px" }}>
                  Get custom comparison
                </button>
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
}
