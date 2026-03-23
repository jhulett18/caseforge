import Link from "next/link";

export default function WelcomePage() {
  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 24, background: "#fff", fontFamily: "var(--sans)" }}>
      <div style={{ maxWidth: 480, textAlign: "center" }}>
        <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: "-0.5px", marginBottom: 32 }}>
          Case<span style={{ color: "var(--green)" }}>Forge</span>
        </div>

        <p style={{ fontSize: 15, color: "var(--text)", lineHeight: 1.8, marginBottom: 32 }}>
          Software that assembles court-ready surveillance reports from your Trackops data. No AI writes any content — your investigators&apos; observations go in, a certified PDF comes out.
        </p>

        <div style={{ textAlign: "left", marginBottom: 40 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: "var(--muted)", letterSpacing: "1px", marginBottom: 14 }}>WHAT WE&apos;LL SIMULATE IN THIS DEMO</div>
          <ul style={{ fontSize: 14, color: "var(--text)", lineHeight: 2.2, paddingLeft: 20 }}>
            <li>Case data pulled automatically from Trackops</li>
            <li>Seeded evidence videos with SHA-256 fingerprints and metadata</li>
            <li>Investigator observation entry — human-authored only</li>
            <li>One-click PDF report with no-AI certification</li>
          </ul>
        </div>

        <div style={{ fontSize: 12, fontWeight: 600, color: "var(--muted)", letterSpacing: "1px", marginBottom: 14 }}>WHY THIS MATTERS NOW</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8, alignItems: "center", marginBottom: 40 }}>
          {[
            { label: "518 AI evidence cases", sub: "in US courts since Jan 2025", color: "var(--red)", bg: "var(--red-bg)", border: "var(--red-border)" },
            { label: "Federal Rule 707", sub: "courts now regulate AI evidence", color: "var(--red)", bg: "var(--red-bg)", border: "var(--red-border)" },
            { label: "Louisiana SB 231", sub: "investigators must prove provenance", color: "#8A6000", bg: "#FFF8E0", border: "#F0E0A0" },
            { label: "0 AI-generated words", sub: "in any CaseForge report", color: "var(--green-d)", bg: "var(--green-bg)", border: "var(--green-border)" },
          ].map((b) => (
            <div key={b.label} style={{
              background: b.bg, border: `1px solid ${b.border}`, borderRadius: 100,
              padding: "8px 16px", display: "inline-flex", flexDirection: "column", alignItems: "center",
            }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: b.color }}>{b.label}</span>
              <span style={{ fontSize: 10, color: b.color, opacity: 0.7 }}>{b.sub}</span>
            </div>
          ))}
        </div>

        <Link
          href="/demo"
          style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            background: "var(--ink)", color: "#fff",
            fontSize: 15, fontWeight: 600,
            padding: "16px 32px", borderRadius: 100,
            textDecoration: "none",
            transition: "transform 0.15s, box-shadow 0.15s",
          }}
        >
          Enter the Demo
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link>

        <div style={{ marginTop: 48, fontSize: 12, color: "var(--muted)" }}>
          Questions? jonathan_hulett@ymail.com
        </div>
      </div>
    </div>
  );
}
