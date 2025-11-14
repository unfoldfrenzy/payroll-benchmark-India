import React from "react";
import ComparisonTable from "./components/ComparisonTable";
import "./App.css";

export default function App() {
  return (
    <div style={{ fontFamily: "Inter, system-ui, Arial", padding: 20 }}>
      <header style={{ marginBottom: 24 }}>
        <h1>SMB Payroll Benchmark — India</h1>
        <p>Auto-updating comparison for Indian SMB payroll software. Data is refreshed via GitHub Actions.</p>
      </header>

      <ComparisonTable />
    </div>
  );
}
