"use client";

import { useState } from "react";
import { MOCK_CASE, MOCK_EVIDENCE, formatDate } from "@/lib/mock-data";
import "./demo.css";

function StatusBadge({ status }) {
  const colors =
    status === "Active"
      ? "background: rgba(16,185,129,0.15); color: #6ee7b7; border: 1px solid rgba(16,185,129,0.25)"
      : "background: rgba(113,113,122,0.15); color: #a1a1aa; border: 1px solid rgba(113,113,122,0.25)";
  return (
    <span
      style={{
        fontSize: 11,
        padding: "2px 8px",
        borderRadius: 4,
        fontFamily: "var(--font-dm-mono), monospace",
        ...(Object.fromEntries(colors.split(";").map((s) => s.split(":").map((v) => v.trim()))))
      }}
    >
      {status}
    </span>
  );
}

function VerifiedBadge({ verified }) {
  return verified ? (
    <span style={{ fontSize: 11, padding: "2px 8px", borderRadius: 4, background: "rgba(16,185,129,0.12)", color: "#34d399", border: "1px solid rgba(16,185,129,0.2)", fontFamily: "var(--font-dm-mono), monospace" }}>
      ✓ Verified
    </span>
  ) : (
    <span style={{ fontSize: 11, padding: "2px 8px", borderRadius: 4, background: "rgba(245,158,11,0.12)", color: "#fbbf24", border: "1px solid rgba(245,158,11,0.2)", fontFamily: "var(--font-dm-mono), monospace" }}>
      ⏳ Pending
    </span>
  );
}

export default function DemoPage() {
  const [activeTab, setActiveTab] = useState("case");
  const [narratives, setNarratives] = useState({});
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState(false);
  const [pulling, setPulling] = useState(false);
  const [pulled, setPulled] = useState(false);

  const allNarrativesEntered = MOCK_EVIDENCE.every(
    (ev) => narratives[ev.id]?.trim()
  );

  function handlePullData() {
    setPulling(true);
    setTimeout(() => {
      setPulling(false);
      setPulled(true);
    }, 1800);
  }

  async function handleGenerate() {
    setGenerating(true);
    try {
      const res = await fetch("/api/reports/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ narratives }),
      });
      if (!res.ok) throw new Error("Generation failed");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `CaseForge_${MOCK_CASE.id}_Report.pdf`;
      a.click();
      URL.revokeObjectURL(url);
      setGenerated(true);
    } catch (err) {
      console.error(err);
      alert("Report generation failed. Check console.");
    } finally {
      setGenerating(false);
    }
  }

  const tabs = [
    { id: "case", label: "Case File" },
    { id: "evidence", label: `Evidence Log (${MOCK_EVIDENCE.length})` },
    { id: "report", label: "Generate Report" },
  ];

  return (
    <div className="cf-dash">
      {/* Top Bar */}
      <div style={{ borderBottom: "1px solid #1e1e1e", padding: "0 24px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 56 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ fontFamily: "var(--font-libre), serif", fontSize: 15, fontWeight: 700, letterSpacing: "-0.3px" }}>
            CASE<span className="gold">FORGE</span>
          </div>
          <span style={{ color: "#333", fontSize: 18 }}>|</span>
          <span style={{ fontSize: 11, color: "#555" }}>PI Report Automation</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div className="pulse-dot" style={{ width: 6, height: 6, borderRadius: "50%", background: pulled ? "#22c55e" : "#555" }} />
          <span style={{ fontSize: 11, color: pulled ? "#22c55e" : "#555" }}>
            {pulled ? "Trackops Connected" : "Awaiting Data Pull"}
          </span>
        </div>
      </div>

      {/* Case Header Banner */}
      <div style={{ padding: "16px 24px", borderBottom: "1px solid #1a1a1a", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontFamily: "var(--font-libre), serif", fontSize: 17 }}>{MOCK_CASE.id}</span>
            <StatusBadge status={MOCK_CASE.status} />
          </div>
          <div style={{ fontSize: 11, color: "#666", marginTop: 2 }}>
            {MOCK_CASE.client} · {MOCK_CASE.caseType}
          </div>
        </div>
        <button
          className="btn-outline"
          onClick={handlePullData}
          disabled={pulling || pulled}
          style={{ padding: "7px 16px", fontSize: 11, display: "flex", alignItems: "center", gap: 6 }}
        >
          {pulling ? (
            <><span className="spin" style={{ display: "inline-block" }}>⟳</span> Pulling from Trackops…</>
          ) : pulled ? (
            <>✓ Data Synced</>
          ) : (
            <>⟳ Pull from Trackops</>
          )}
        </button>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 0, padding: "0 24px", borderBottom: "1px solid #1a1a1a" }}>
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={activeTab === t.id ? "tab-active" : "tab-inactive"}
            style={{ background: "none", border: "none", cursor: "pointer", padding: "12px 20px", fontSize: 11, fontFamily: "inherit", letterSpacing: "0.3px" }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div style={{ padding: 24, maxWidth: 900, margin: "0 auto" }}>

        {/* ── CASE FILE TAB ── */}
        {activeTab === "case" && (
          <div className="fade-in" style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div className="card" style={{ padding: 20 }}>
              <div style={{ fontSize: 10, color: "#B8860B", letterSpacing: "1.5px", marginBottom: 14 }}>CASE DETAILS</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px 32px" }}>
                {[
                  ["Case ID", MOCK_CASE.id],
                  ["Assigned PI", MOCK_CASE.assignedPI],
                  ["PI License", MOCK_CASE.licenseNo],
                  ["Opened", formatDate(MOCK_CASE.openedDate)],
                  ["Client", MOCK_CASE.client],
                  ["Case Type", MOCK_CASE.caseType],
                ].map(([label, val]) => (
                  <div key={label}>
                    <div style={{ fontSize: 9, color: "#555", marginBottom: 2, letterSpacing: "0.8px" }}>{label.toUpperCase()}</div>
                    <div style={{ fontSize: 12 }}>{val}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="card" style={{ padding: 20 }}>
              <div style={{ fontSize: 10, color: "#B8860B", letterSpacing: "1.5px", marginBottom: 14 }}>SUBJECT PROFILE</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px 32px" }}>
                {[
                  ["Full Name", MOCK_CASE.subject.name],
                  ["Date of Birth", formatDate(MOCK_CASE.subject.dob)],
                  ["Claim Number", MOCK_CASE.subject.claimNumber],
                  ["Address", MOCK_CASE.subject.address],
                  ["Vehicle", MOCK_CASE.subject.vehicle],
                  ["Claimed Injury", MOCK_CASE.subject.claimedInjury],
                ].map(([label, val]) => (
                  <div key={label} style={{ gridColumn: ["Claimed Injury", "Address", "Vehicle"].includes(label) ? "1 / -1" : "auto" }}>
                    <div style={{ fontSize: 9, color: "#555", marginBottom: 2, letterSpacing: "0.8px" }}>{label.toUpperCase()}</div>
                    <div style={{ fontSize: 12 }}>{val}</div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ fontSize: 10, color: "#444", textAlign: "center", marginTop: 4 }}>
              ↑ Data auto-populated from Trackops API · No manual entry required
            </div>
          </div>
        )}

        {/* ── EVIDENCE LOG TAB ── */}
        {activeTab === "evidence" && (
          <div className="fade-in">
            <div style={{ marginBottom: 16, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ fontSize: 11, color: "#555" }}>
                Enter investigator observations for each clip. All other fields are auto-populated.
              </div>
              <div style={{ fontSize: 10, color: "#444" }}>
                {Object.values(narratives).filter((v) => v?.trim()).length} / {MOCK_EVIDENCE.length} observations entered
              </div>
            </div>

            <div className="card">
              {MOCK_EVIDENCE.map((ev) => (
                <div key={ev.id} className="ev-row" style={{ padding: "16px 20px" }}>
                  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 10 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ fontSize: 10, color: "#B8860B", fontWeight: 500 }}>{ev.id}</div>
                      <VerifiedBadge verified={ev.verified} />
                    </div>
                    <div style={{ fontSize: 10, color: "#555" }}>{ev.clipName}</div>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "6px 16px", marginBottom: 12 }}>
                    {[
                      ["Date", formatDate(ev.date)],
                      ["Time", ev.time],
                      ["Duration", ev.duration],
                      ["Location", ev.location],
                    ].map(([label, val]) => (
                      <div key={label} style={{ gridColumn: label === "Location" ? "1 / -1" : "auto" }}>
                        <div style={{ fontSize: 9, color: "#444", marginBottom: 2, letterSpacing: "0.8px" }}>{label.toUpperCase()}</div>
                        <div style={{ fontSize: 11, color: "#bbb" }}>{val}</div>
                      </div>
                    ))}
                  </div>

                  <div>
                    <div style={{ fontSize: 9, color: "#555", marginBottom: 4, letterSpacing: "0.8px" }}>
                      INVESTIGATOR OBSERVATIONS <span style={{ color: "#B8860B" }}>*</span>
                    </div>
                    <textarea
                      rows={2}
                      placeholder="Describe what was observed in this clip (written by investigator)…"
                      value={narratives[ev.id] || ""}
                      onChange={(e) => setNarratives((p) => ({ ...p, [ev.id]: e.target.value }))}
                      style={{ width: "100%", fontSize: 12, lineHeight: 1.6 }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── GENERATE REPORT TAB ── */}
        {activeTab === "report" && (
          <div className="fade-in" style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div className="card" style={{ padding: 20 }}>
              <div style={{ fontSize: 10, color: "#B8860B", letterSpacing: "1.5px", marginBottom: 14 }}>REPORT CHECKLIST</div>
              {[
                ["Case data pulled from Trackops", pulled],
                ["Subject profile populated", true],
                ["Evidence clips logged", true],
                [`Investigator observations entered (${Object.values(narratives).filter((v) => v?.trim()).length}/${MOCK_EVIDENCE.length})`, allNarrativesEntered],
              ].map(([label, ok]) => (
                <div key={label} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10, fontSize: 12 }}>
                  <div style={{
                    width: 18, height: 18, borderRadius: "50%",
                    background: ok ? "#22c55e22" : "#ffffff10",
                    border: `1px solid ${ok ? "#22c55e" : "#333"}`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 9, color: ok ? "#22c55e" : "#444", flexShrink: 0,
                  }}>
                    {ok ? "✓" : "·"}
                  </div>
                  <span style={{ color: ok ? "#e8e8e0" : "#555" }}>{label}</span>
                </div>
              ))}
            </div>

            <div className="card" style={{ padding: 20 }}>
              <div style={{ fontSize: 10, color: "#B8860B", letterSpacing: "1.5px", marginBottom: 10 }}>WHAT GETS AUTO-ASSEMBLED</div>
              <ul style={{ fontSize: 12, color: "#888", lineHeight: 2, paddingLeft: 16 }}>
                <li>Case header + client information (from Trackops)</li>
                <li>Subject profile + vehicle + claim number</li>
                <li>Full evidence log with timestamps, durations, locations</li>
                <li>Investigator&apos;s written observations (yours)</li>
                <li>Chain of custody notation + file verification status</li>
                <li>Certification block + automated assembly disclaimer</li>
              </ul>
            </div>

            <div className="card" style={{ padding: 20, borderColor: "#B8860B22" }}>
              <div style={{ fontSize: 10, color: "#555", letterSpacing: "1.2px", marginBottom: 10 }}>LEGAL COMPLIANCE NOTE</div>
              <p style={{ fontSize: 11, color: "#666", lineHeight: 1.8 }}>
                This report is assembled by software, not generated by AI. All narrative content is authored by the licensed investigator. The automated assembly disclaimer is included in the final document, making the process fully transparent and defensible under proposed Federal Rule of Evidence 707.
              </p>
            </div>

            <button
              className="btn-gold"
              onClick={handleGenerate}
              disabled={generating || !allNarrativesEntered}
              style={{ padding: "14px 24px", fontSize: 13, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}
            >
              {generating ? (
                <><span className="spin" style={{ display: "inline-block", fontSize: 16 }}>⟳</span> Assembling Report…</>
              ) : generated ? (
                <>✓ Report Generated — Click to Regenerate</>
              ) : (
                <>⬡ Generate Surveillance Report PDF</>
              )}
            </button>

            {!allNarrativesEntered && (
              <div style={{ fontSize: 11, color: "#666", textAlign: "center" }}>
                ← Go to Evidence Log and enter observations for all {MOCK_EVIDENCE.length} clips first
              </div>
            )}

            {generated && (
              <div className="fade-in card" style={{ padding: 16, borderColor: "#22c55e33", background: "#0a1a0f" }}>
                <div style={{ fontSize: 11, color: "#22c55e" }}>✓ Report downloaded — open the PDF to review your court-ready surveillance report</div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
