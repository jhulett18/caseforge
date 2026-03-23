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
          <div style={{ fontSize: 12, fontWeight: 600, color: "var(--muted)", letterSpacing: "1px", marginBottom: 14 }}>WHAT YOU&apos;LL SEE IN THIS DEMO</div>
          <ul style={{ fontSize: 14, color: "var(--text)", lineHeight: 2.2, paddingLeft: 20 }}>
            <li>Case data pulled automatically from Trackops</li>
            <li>Evidence clips with SHA-256 fingerprints and metadata</li>
            <li>Investigator observation entry — human-authored only</li>
            <li>One-click PDF report with no-AI certification</li>
          </ul>
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
          Questions? jonathan@caseforge.com
        </div>
      </div>
    </div>
  );
}
