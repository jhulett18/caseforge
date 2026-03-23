"use client";

import { useState, useEffect, useRef } from "react";

export default function Home() {
  const [openStep, setOpenStep] = useState(1);
  const [genState, setGenState] = useState("idle"); // idle | loading | done
  const [certVisible, setCertVisible] = useState(false);
  const howRef = useRef(null);
  const alert1Ref = useRef(null);
  const alert2Ref = useRef(null);
  const ctaRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add("visible");
        });
      },
      { threshold: 0.1 }
    );
    [alert1Ref, alert2Ref, ctaRef].forEach((ref) => {
      if (ref.current) observer.observe(ref.current);
    });
    return () => observer.disconnect();
  }, []);

  function handleGenerate(e) {
    e.stopPropagation();
    if (genState !== "idle") return;
    setGenState("loading");
    setTimeout(() => {
      setGenState("done");
      setCertVisible(true);
    }, 2000);
  }

  return (
    <div className="page">
      {/* HEADER */}
      <header>
        <div className="logo">
          Case<span>Forge</span>
        </div>
        <div className="pill">Live Demo</div>
      </header>

      {/* HERO */}
      <div className="hero">
        <div className="eyebrow">Built for private investigators</div>
        <h1>
          Your reports.
          <br />
          <em>Court-proof.</em> In seconds.
        </h1>
        <p>
          Federal Rule 707 is here. AI-generated evidence is getting challenged
          in courtrooms nationwide. CaseForge assembles your reports
          automatically &mdash; no AI writing, full chain of custody, ready
          before opposing counsel asks.
        </p>
        <button
          className="hero-btn"
          onClick={() =>
            howRef.current?.scrollIntoView({ behavior: "smooth" })
          }
        >
          See how it works
          <svg
            className="arr"
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
          >
            <path
              d="M3 8h10M9 4l4 4-4 4"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>

      {/* STATS */}
      <div className="stats">
        <div className="stat">
          <div className="stat-n r">518</div>
          <div className="stat-l">
            AI-hallucinated evidence cases in US courts since Jan 2025
          </div>
        </div>
        <div className="stat">
          <div className="stat-n r">Aug &apos;25</div>
          <div className="stat-l">
            Federal Rule 707 released &mdash; courts now regulate AI-generated
            evidence
          </div>
        </div>
        <div className="stat">
          <div className="stat-n g">0</div>
          <div className="stat-l">
            AI-generated words in any CaseForge report. Guaranteed.
          </div>
        </div>
      </div>

      {/* ALERTS */}
      <div className="alert danger" ref={alert1Ref}>
        <div className="alert-row">
          <div className="alert-ico">⚖</div>
          <div>
            <div className="alert-title">The legal landscape just changed</div>
            <div className="alert-body">
              Louisiana became the first state requiring investigators to{" "}
              <strong>
                prove evidence wasn&apos;t AI-generated or manipulated.
              </strong>{" "}
              Opposing counsel can now challenge your surveillance footage
              &mdash; even when it&apos;s completely real &mdash; and demand you
              prove it.{" "}
              <strong>Most PIs have no way to do that today.</strong>
            </div>
          </div>
        </div>
      </div>

      <div className="alert safe" ref={alert2Ref}>
        <div className="alert-row">
          <div className="alert-ico">✓</div>
          <div>
            <div className="alert-title">
              CaseForge solves this &mdash; without touching Trackops
            </div>
            <div className="alert-body">
              Runs on top of your existing tools. You write the observations.
              The software fingerprints files, logs every action, pulls your
              case data from Trackops automatically, and assembles the report
              with a{" "}
              <strong>signed no-AI certification document.</strong> Not AI
              writing reports &mdash; software assembling what you already have.
            </div>
          </div>
        </div>
      </div>

      <div className="divider"></div>

      {/* STEPS */}
      <div className="sec-label" ref={howRef}>
        How it works &mdash; 3 steps
      </div>
      <div className="steps">
        {/* STEP 1 */}
        <div
          className={`step${openStep === 1 ? " open" : ""}`}
          onClick={() => setOpenStep(1)}
        >
          <div className="step-head">
            <div className="step-dot">1</div>
            <div className="step-t">Evidence comes in from the field</div>
            <span className="step-tag tag-a">Auto</span>
          </div>
          <div className="step-body">
            <div className="step-inner">
              <div className="step-content">
                <div className="step-desc">
                  Video files sync to CaseForge the moment you&apos;re back.
                  Each file is instantly SHA-256 fingerprinted &mdash; a
                  cryptographic proof that nothing was altered. Timestamps, GPS,
                  and device ID are pulled from the file metadata. Zero manual
                  entry.
                </div>
                <div className="ev-list">
                  {[
                    {
                      name: "Clip_001_Reyes_20250310.mp4",
                      time: "07:14 · 4m 22s",
                      ok: true,
                    },
                    {
                      name: "Clip_002_Reyes_20250310.mp4",
                      time: "09:41 · 2m 57s",
                      ok: true,
                    },
                    {
                      name: "Clip_003_Reyes_20250310.mp4",
                      time: "11:22 · 6m 10s",
                      ok: true,
                    },
                    {
                      name: "Clip_004_unverified.mp4",
                      time: "metadata missing",
                      ok: false,
                    },
                  ].map((clip) => (
                    <div className="ev" key={clip.name}>
                      <div
                        className="ev-ico"
                        style={{
                          background: clip.ok ? "#FFF3E0" : "#FFF2F0",
                        }}
                      >
                        🎥
                      </div>
                      <div className="ev-name">{clip.name}</div>
                      <div className="ev-time">{clip.time}</div>
                      <div className={`badge ${clip.ok ? "ok" : "warn"}`}>
                        {clip.ok ? "SHA-256 ✓" : "⚠ Review needed"}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="conn">↓</div>

        {/* STEP 2 */}
        <div
          className={`step${openStep === 2 ? " open" : ""}`}
          onClick={() => setOpenStep(2)}
        >
          <div className="step-head">
            <div className="step-dot">2</div>
            <div className="step-t">
              You write what you saw. Software fills the rest.
            </div>
            <span className="step-tag tag-h">You write this</span>
          </div>
          <div className="step-body">
            <div className="step-inner">
              <div className="step-content">
                <div className="step-desc">
                  The only thing you type is your observation notes per clip
                  &mdash; your words, your call. CaseForge auto-pulls case
                  details from Trackops, slots in the timestamps and locations,
                  and builds the report shell around your notes. No AI fills in
                  your observations. Ever.
                </div>
                <div className="ev-list">
                  <div className="obs-card">
                    <div className="obs-label">
                      Clip 001 &mdash; Investigator Observation
                    </div>
                    <div className="obs-text">
                      &ldquo;Subject exited residence at 0714. Walked to vehicle
                      unassisted, loaded 4 lumber boards (approx. 8ft) into
                      truck bed without visible difficulty. Drove north on
                      Oleander Ave.&rdquo;
                    </div>
                    <div className="obs-footer">
                      <div className="badge ok">Human authored ✓</div>
                    </div>
                  </div>
                  <div className="ev">
                    <div
                      className="ev-ico"
                      style={{ background: "#F0FFF0" }}
                    >
                      ⚡
                    </div>
                    <div className="ev-name">
                      All other fields auto-populated
                    </div>
                    <div className="ev-time">
                      Case #, client, subject, GPS, timestamps, hashes
                    </div>
                    <div className="badge ok">Trackops sync ✓</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="conn">↓</div>

        {/* STEP 3 */}
        <div
          className={`step${openStep === 3 ? " open" : ""}`}
          onClick={() => setOpenStep(3)}
        >
          <div className="step-head">
            <div className="step-dot">3</div>
            <div className="step-t">
              One click. Court-ready report + certification.
            </div>
            <span className="step-tag tag-o">Output</span>
          </div>
          <div className="step-body">
            <div className="step-inner">
              <div className="step-content">
                <div className="step-desc">
                  Hit generate. CaseForge assembles the full surveillance report
                  PDF &mdash; plus a chain of custody document and a signed
                  &ldquo;no AI content&rdquo; certification. Everything your
                  attorney and client need, before they ask for it.
                </div>
                <div className="report-box">
                  <div className="rbox-top">
                    <div>
                      <div className="rbox-title">
                        TRK-2025-0847 · Reyes Surveillance
                      </div>
                      <div className="rbox-sub">
                        Hartwell Insurance Group · J. Torres · FL-PI-1142
                      </div>
                    </div>
                    <div
                      className="cert-pill"
                      style={{ opacity: certVisible ? 1 : 0 }}
                    >
                      ✓ No AI certified
                    </div>
                  </div>
                  <div className="rfields">
                    <div className="rf">
                      <div className="rf-l">Clips logged</div>
                      <div className="rf-v g">3 verified · 1 flagged</div>
                    </div>
                    <div className="rf">
                      <div className="rf-l">Surveillance time</div>
                      <div className="rf-v g">13m 29s total</div>
                    </div>
                    <div className="rf">
                      <div className="rf-l">Chain of custody</div>
                      <div className="rf-v g">Immutable log ✓</div>
                    </div>
                    <div className="rf">
                      <div className="rf-l">Assembled by</div>
                      <div className="rf-v s">
                        CaseForge template engine &mdash; no LLM
                      </div>
                    </div>
                  </div>
                  <button
                    className={`gen-btn${genState === "done" ? " done" : ""}`}
                    disabled={genState === "loading"}
                    onClick={handleGenerate}
                  >
                    <span>
                      {genState === "idle" && "Generate Report PDF"}
                      {genState === "loading" && <LoadingText />}
                      {genState === "done" && (
                        <>✓ Report Ready &mdash; Download PDF</>
                      )}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* BOTTOM CTA */}
      <div className="cta" ref={ctaRef}>
        <h2>Want this on your cases?</h2>
        <p>
          Runs on top of Trackops. No migration, no new tools to learn. Just
          reports that are done before you close the laptop.
        </p>
        <div className="cta-btns">
          <button
            className="btn-dark"
            onClick={() =>
              alert(
                "Jonathan will follow up to schedule a live walkthrough."
              )
            }
          >
            Request a live walkthrough
          </button>
          <button
            className="btn-out"
            onClick={() => alert("Full proposal coming your way.")}
          >
            See full proposal
          </button>
        </div>
      </div>

      {/* FOOTER */}
      <footer>
        <div className="ft-brand">
          Case<span>Forge</span>
        </div>
        <div className="ft-sub">Automations with JT · auto-jt.com</div>
      </footer>
    </div>
  );
}

function LoadingText() {
  const [dots, setDots] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setDots((d) => (d + 1) % 4);
    }, 350);
    return () => clearInterval(interval);
  }, []);
  return <>Assembling report{".".repeat(dots)}</>;
}
