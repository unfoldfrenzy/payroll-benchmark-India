import React, { useState } from "react";

/**
 * LeadForm — posts to Formspree.
 * Replace YOUR_FORMSPREE_ID with your Formspree form ID (e.g. https://formspree.io/f/mnqrxyz)
 *
 * Note: For production, consider server-side forwarding to CRM or a webhook processor for richer enrichments.
 */

const FORMSPREE_ENDPOINT = "https://formspree.io/f/YOUR_FORMSPREE_ID";

export default function LeadForm() {
  const [form, setForm] = useState({ name: "", email: "", company: "", employees: "", phone: "", consent: false });
  const [status, setStatus] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.email || !form.consent) {
      setStatus({ ok: false, msg: "Email and consent are required." });
      return;
    }
    setStatus({ ok: null, msg: "Submitting…" });

    try {
      const payload = {
        name: form.name,
        email: form.email,
        company: form.company,
        employees: form.employees,
        phone: form.phone,
        consent: form.consent ? "yes" : "no",
        source: window.location.href
      };

      const res = await fetch(FORMSPREE_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        setStatus({ ok: true, msg: "Thanks — we will get back to you shortly." });
        setForm({ name: "", email: "", company: "", employees: "", phone: "", consent: false });
      } else {
        const json = await res.json();
        setStatus({ ok: false, msg: json.error || "Failed to submit lead." });
      }
    } catch (err) {
      console.error(err);
      setStatus({ ok: false, msg: "Network error. Try again later." });
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: "grid", gap: 8, maxWidth: 540 }}>
      <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Your name" />
      <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="Email" required />
      <input value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} placeholder="Company (optional)" />
      <input value={form.employees} onChange={(e) => setForm({ ...form, employees: e.target.value })} placeholder="Employees (e.g. 20)" />
      <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="Phone (optional)" />
      <label style={{ fontSize: 13 }}>
        <input type="checkbox" checked={form.consent} onChange={(e) => setForm({ ...form, consent: e.target.checked })} /> I consent to be contacted about this request.
      </label>
      <button type="submit" style={{ padding: "8px 12px" }}>Request comparison</button>

      {status && (
        <div style={{ marginTop: 8, color: status.ok ? "green" : (status.ok === false ? "red" : "black") }}>
          {status.msg}
        </div>
      )}
    </form>
  );
}
