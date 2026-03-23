"use client";

import { useState, useEffect, useCallback } from "react";
import { MOCK_CASE, MOCK_EVIDENCE, formatDate } from "@/lib/mock-data";
import { driver } from "driver.js";
import "driver.js/dist/driver.css";
import "./demo.css";

function StatusBadge({ status }) {
  const isActive = status === "Active";
  return (
    <span style={{
      fontSize: 11, padding: "3px 10px", borderRadius: 20, fontFamily: "var(--mono)",
      background: isActive ? "var(--green-bg)" : "var(--surface)",
      color: isActive ? "var(--green-d)" : "var(--muted)",
      border: `1px solid ${isActive ? "var(--green-border)" : "var(--border)"}`,
    }}>
      {status}
    </span>
  );
}

function VerifiedBadge({ verified }) {
  return verified ? (
    <span style={{ fontSize: 11, padding: "3px 10px", borderRadius: 20, background: "var(--green-bg)", color: "var(--green-d)", border: "1px solid var(--green-border)", fontFamily: "var(--mono)" }}>
      ✓ Verified
    </span>
  ) : (
    <span style={{ fontSize: 11, padding: "3px 10px", borderRadius: 20, background: "#FFF8E0", color: "#8A6000", border: "1px solid #F0E0A0", fontFamily: "var(--mono)" }}>
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

  const startTour = useCallback(() => {
    const d = driver({
      showProgress: true,
      animate: true,
      smoothScroll: true,
      allowClose: true,
      doneBtnText: "Get Started",
      nextBtnText: "Next →",
      prevBtnText: "← Back",
      steps: [
        {
          element: "#case-header",
          popover: {
            title: "Your Case File",
            description: "Case details are pulled automatically from Trackops — client, subject, claim number, everything. No manual data entry for your investigators.",
            side: "bottom",
            align: "start",
          },
        },
        {
          element: "#pull-btn",
          popover: {
            title: "Sync from Trackops",
            description: "Click here to pull case data from your Trackops account. In production, this syncs real case details via API.",
            side: "bottom",
            align: "end",
          },
        },
        {
          element: "#tab-bar",
          popover: {
            title: "Three Simple Steps",
            description: "Case File shows your data. Evidence Log is where investigators write observations. Generate Report assembles the court-ready PDF.",
            side: "bottom",
            align: "center",
          },
        },
        {
          element: "#tab-evidence",
          popover: {
            title: "Evidence Log",
            description: "Each uploaded clip is SHA-256 fingerprinted server-side. Your investigators write what they observed — no AI fills in these notes. Ever.",
            side: "bottom",
            align: "center",
          },
        },
        {
          element: "#tab-report",
          popover: {
            title: "Generate Your Report",
            description: "Once all observations are entered, generate a real PDF — surveillance report, chain of custody, and no-AI certification. All assembled by software, not AI.",
            side: "bottom",
            align: "center",
          },
        },
      ],
    });
    d.drive();
  }, []);

  useEffect(() => {
    const hasSeenTour = localStorage.getItem("caseforge-tour-seen");
    if (!hasSeenTour) {
      const timer = setTimeout(() => {
        startTour();
        localStorage.setItem("caseforge-tour-seen", "true");
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [startTour]);

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
      <div style={{ borderBottom: "1px solid var(--border)", padding: "0 24px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 56 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ fontSize: 17, fontWeight: 700, letterSpacing: "-0.4px" }}>
            Case<span style={{ color: "var(--green)" }}>Forge</span>
          </div>
          <span style={{ color: "var(--border)", fontSize: 18 }}>|</span>
          <span style={{ fontSize: 11, color: "var(--muted)" }}>PI Report Automation</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <button
            onClick={startTour}
            style={{ background: "none", border: "1px solid var(--border)", borderRadius: 20, padding: "4px 12px", fontSize: 11, color: "var(--muted)", cursor: "pointer", fontFamily: "inherit" }}
          >
            ? Tour
          </button>
          <div className="pulse-dot" style={{ width: 6, height: 6, borderRadius: "50%", background: pulled ? "var(--green)" : "var(--muted)" }} />
          <span style={{ fontSize: 11, color: pulled ? "var(--green-d)" : "var(--muted)" }}>
            {pulled ? "Trackops Connected" : "Awaiting Data Pull"}
          </span>
        </div>
      </div>

      {/* Case Header Banner */}
      <div id="case-header" style={{ padding: "16px 24px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 17, fontWeight: 700, letterSpacing: "-0.4px" }}>{MOCK_CASE.id}</span>
            <StatusBadge status={MOCK_CASE.status} />
          </div>
          <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 2 }}>
            {MOCK_CASE.client} · {MOCK_CASE.caseType}
          </div>
        </div>
        <button
          id="pull-btn"
          className="btn-outline"
          onClick={handlePullData}
          disabled={pulling || pulled}
          style={{ padding: "7px 18px", fontSize: 11, display: "flex", alignItems: "center", gap: 6, fontWeight: 600 }}
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
      <div id="tab-bar" style={{ display: "flex", gap: 0, padding: "0 24px", borderBottom: "1px solid var(--border)" }}>
        {tabs.map((t) => (
          <button
            key={t.id}
            id={`tab-${t.id}`}
            onClick={() => setActiveTab(t.id)}
            className={activeTab === t.id ? "tab-active" : "tab-inactive"}
            style={{ background: "none", border: "none", cursor: "pointer", padding: "12px 20px", fontSize: 12, fontFamily: "inherit", fontWeight: 500 }}
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
            <div className="card" style={{ padding: 22 }}>
              <div style={{ fontSize: 10, color: "#B8860B", letterSpacing: "1.5px", fontWeight: 600, marginBottom: 14 }}>CASE DETAILS</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px 32px" }}>
                {[
                  ["Case ID", MOCK_CASE.id],
                  ["Assigned PI", MOCK_CASE.assignedPI],
                  ["PI License", MOCK_CASE.licenseNo],
                  ["Opened", formatDate(MOCK_CASE.openedDate)],
                  ["Client", MOCK_CASE.client],
                  ["Case Type", MOCK_CASE.caseType],
                ].map(([label, val]) => (
                  <div key={label}>
                    <div style={{ fontSize: 10, color: "var(--muted)", marginBottom: 3, letterSpacing: "0.8px", fontWeight: 500 }}>{label.toUpperCase()}</div>
                    <div style={{ fontSize: 13, color: "var(--ink)" }}>{val}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="card" style={{ padding: 22 }}>
              <div style={{ fontSize: 10, color: "#B8860B", letterSpacing: "1.5px", fontWeight: 600, marginBottom: 14 }}>SUBJECT PROFILE</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px 32px" }}>
                {[
                  ["Full Name", MOCK_CASE.subject.name],
                  ["Date of Birth", formatDate(MOCK_CASE.subject.dob)],
                  ["Claim Number", MOCK_CASE.subject.claimNumber],
                  ["Address", MOCK_CASE.subject.address],
                  ["Vehicle", MOCK_CASE.subject.vehicle],
                  ["Claimed Injury", MOCK_CASE.subject.claimedInjury],
                ].map(([label, val]) => (
                  <div key={label} style={{ gridColumn: ["Claimed Injury", "Address", "Vehicle"].includes(label) ? "1 / -1" : "auto" }}>
                    <div style={{ fontSize: 10, color: "var(--muted)", marginBottom: 3, letterSpacing: "0.8px", fontWeight: 500 }}>{label.toUpperCase()}</div>
                    <div style={{ fontSize: 13, color: "var(--ink)" }}>{val}</div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ fontSize: 11, color: "var(--muted)", textAlign: "center", marginTop: 4 }}>
              ↑ Data auto-populated from Trackops API · No manual entry required
            </div>
          </div>
        )}

        {/* ── EVIDENCE LOG TAB ── */}
        {activeTab === "evidence" && (
          <div className="fade-in">
            <div style={{ marginBottom: 16, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ fontSize: 12, color: "var(--muted)" }}>
                Enter investigator observations for each clip. All other fields are auto-populated.
              </div>
              <div style={{ fontSize: 11, color: "var(--muted)", fontFamily: "var(--mono)" }}>
                {Object.values(narratives).filter((v) => v?.trim()).length} / {MOCK_EVIDENCE.length}
              </div>
            </div>

            <div className="card">
              {MOCK_EVIDENCE.map((ev) => (
                <div key={ev.id} className="ev-row" style={{ padding: "18px 22px" }}>
                  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 12 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ fontSize: 11, color: "#B8860B", fontWeight: 600 }}>{ev.id}</div>
                      <VerifiedBadge verified={ev.verified} />
                    </div>
                    <div style={{ fontSize: 11, color: "var(--muted)", fontFamily: "var(--mono)" }}>{ev.clipName}</div>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "6px 16px", marginBottom: 14 }}>
                    {[
                      ["Date", formatDate(ev.date)],
                      ["Time", ev.time],
                      ["Duration", ev.duration],
                      ["Location", ev.location],
                    ].map(([label, val]) => (
                      <div key={label} style={{ gridColumn: label === "Location" ? "1 / -1" : "auto" }}>
                        <div style={{ fontSize: 10, color: "var(--muted)", marginBottom: 3, letterSpacing: "0.8px", fontWeight: 500 }}>{label.toUpperCase()}</div>
                        <div style={{ fontSize: 12, color: "var(--text)" }}>{val}</div>
                      </div>
                    ))}
                  </div>

                  <div>
                    <div style={{ fontSize: 10, color: "var(--muted)", marginBottom: 5, letterSpacing: "0.8px", fontWeight: 500 }}>
                      INVESTIGATOR OBSERVATIONS <span style={{ color: "var(--green)" }}>*</span>
                    </div>
                    <textarea
                      rows={2}
                      placeholder="Describe what was observed in this clip (written by investigator)…"
                      value={narratives[ev.id] || ""}
                      onChange={(e) => setNarratives((p) => ({ ...p, [ev.id]: e.target.value }))}
                      style={{ width: "100%", fontSize: 13, lineHeight: 1.7 }}
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
            <div className="card" style={{ padding: 22 }}>
              <div style={{ fontSize: 10, color: "#B8860B", letterSpacing: "1.5px", fontWeight: 600, marginBottom: 14 }}>REPORT CHECKLIST</div>
              {[
                ["Case data pulled from Trackops", pulled],
                ["Subject profile populated", true],
                ["Evidence clips logged", true],
                [`Investigator observations entered (${Object.values(narratives).filter((v) => v?.trim()).length}/${MOCK_EVIDENCE.length})`, allNarrativesEntered],
              ].map(([label, ok]) => (
                <div key={label} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10, fontSize: 13 }}>
                  <div style={{
                    width: 20, height: 20, borderRadius: "50%",
                    background: ok ? "var(--green-bg)" : "var(--surface)",
                    border: `1.5px solid ${ok ? "var(--green)" : "var(--border)"}`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 10, color: ok ? "var(--green-d)" : "var(--muted)", flexShrink: 0,
                  }}>
                    {ok ? "✓" : "·"}
                  </div>
                  <span style={{ color: ok ? "var(--text)" : "var(--muted)" }}>{label}</span>
                </div>
              ))}
            </div>

            <div className="card" style={{ padding: 22 }}>
              <div style={{ fontSize: 10, color: "#B8860B", letterSpacing: "1.5px", fontWeight: 600, marginBottom: 12 }}>WHAT GETS AUTO-ASSEMBLED</div>
              <ul style={{ fontSize: 13, color: "var(--muted)", lineHeight: 2.1, paddingLeft: 18 }}>
                <li>Case header + client information (from Trackops)</li>
                <li>Subject profile + vehicle + claim number</li>
                <li>Full evidence log with timestamps, durations, locations</li>
                <li>Investigator&apos;s written observations (yours)</li>
                <li>Chain of custody notation + file verification status</li>
                <li>Certification block + automated assembly disclaimer</li>
              </ul>
            </div>

            <div className="card" style={{ padding: 22, borderColor: "var(--green-border)" }}>
              <div style={{ fontSize: 10, color: "var(--muted)", letterSpacing: "1.2px", fontWeight: 500, marginBottom: 10 }}>LEGAL COMPLIANCE NOTE</div>
              <p style={{ fontSize: 12, color: "var(--muted)", lineHeight: 1.85 }}>
                This report is assembled by software, not generated by AI. All narrative content is authored by the licensed investigator. The automated assembly disclaimer is included in the final document, making the process fully transparent and defensible under proposed Federal Rule of Evidence 707.
              </p>
            </div>

            <button
              className={`btn-primary${generated ? " done" : ""}`}
              onClick={handleGenerate}
              disabled={generating || !allNarrativesEntered}
              style={{ padding: "14px 28px", fontSize: 14, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}
            >
              {generating ? (
                <><span className="spin" style={{ display: "inline-block", fontSize: 16 }}>⟳</span> Assembling Report…</>
              ) : generated ? (
                <>✓ Report Generated — Click to Regenerate</>
              ) : (
                <>Generate Surveillance Report PDF</>
              )}
            </button>

            {!allNarrativesEntered && (
              <div style={{ fontSize: 12, color: "var(--muted)", textAlign: "center" }}>
                ← Go to Evidence Log and enter observations for all {MOCK_EVIDENCE.length} clips first
              </div>
            )}

            {generated && (
              <div className="fade-in card" style={{ padding: 16, borderColor: "var(--green-border)", background: "var(--green-bg)" }}>
                <div style={{ fontSize: 12, color: "var(--green-d)" }}>✓ Report downloaded — open the PDF to review your court-ready surveillance report</div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
