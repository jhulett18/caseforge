-- CaseForge Database Schema (reference — not wired up in MVP demo)
-- Tables: cases, subjects, evidence_files, observation_logs, audit_log, reports

-- ─── CASES ─────────────────────────────────────────────────────────────────
CREATE TABLE cases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  case_number TEXT UNIQUE NOT NULL,
  client_name TEXT NOT NULL,
  case_type TEXT NOT NULL,
  assigned_pi TEXT NOT NULL,
  pi_license_no TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'Active' CHECK (status IN ('Active', 'Closed', 'Pending')),
  opened_date DATE NOT NULL DEFAULT CURRENT_DATE,
  closed_date DATE,
  trackops_id TEXT,
  trackops_synced_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── SUBJECTS ──────────────────────────────────────────────────────────────
CREATE TABLE subjects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id UUID NOT NULL REFERENCES cases(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  date_of_birth DATE,
  address TEXT,
  vehicle_description TEXT,
  claim_number TEXT,
  claimed_injury TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── EVIDENCE FILES ────────────────────────────────────────────────────────
CREATE TABLE evidence_files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id UUID NOT NULL REFERENCES cases(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_size BIGINT NOT NULL,
  mime_type TEXT NOT NULL,
  sha256_hash TEXT NOT NULL,
  storage_path TEXT NOT NULL,
  capture_date DATE,
  capture_time TIME,
  duration TEXT,
  gps_latitude DOUBLE PRECISION,
  gps_longitude DOUBLE PRECISION,
  location_description TEXT,
  device_id TEXT,
  verified BOOLEAN NOT NULL DEFAULT FALSE,
  uploaded_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_evidence_case_id ON evidence_files(case_id);
CREATE INDEX idx_evidence_hash ON evidence_files(sha256_hash);

-- ─── OBSERVATION LOGS (human-authored only) ────────────────────────────────
CREATE TABLE observation_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  evidence_file_id UUID NOT NULL REFERENCES evidence_files(id) ON DELETE CASCADE,
  case_id UUID NOT NULL REFERENCES cases(id) ON DELETE CASCADE,
  investigator_name TEXT NOT NULL,
  observation_text TEXT NOT NULL,
  authored_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── AUDIT LOG (APPEND-ONLY) ──────────────────────────────────────────────
CREATE TABLE audit_log (
  id BIGSERIAL PRIMARY KEY,
  case_id UUID REFERENCES cases(id),
  evidence_file_id UUID REFERENCES evidence_files(id),
  action TEXT NOT NULL,
  actor TEXT NOT NULL,
  details JSONB,
  ip_address INET,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_audit_case ON audit_log(case_id);
CREATE INDEX idx_audit_created ON audit_log(created_at);

-- Block UPDATE and DELETE on audit_log
CREATE OR REPLACE FUNCTION prevent_audit_modification()
RETURNS TRIGGER AS $$
BEGIN
  RAISE EXCEPTION 'audit_log is append-only. UPDATE and DELETE are prohibited.';
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER audit_log_no_update
  BEFORE UPDATE ON audit_log
  FOR EACH ROW EXECUTE FUNCTION prevent_audit_modification();

CREATE TRIGGER audit_log_no_delete
  BEFORE DELETE ON audit_log
  FOR EACH ROW EXECUTE FUNCTION prevent_audit_modification();

-- ─── REPORTS ───────────────────────────────────────────────────────────────
CREATE TABLE reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id UUID NOT NULL REFERENCES cases(id) ON DELETE CASCADE,
  report_type TEXT NOT NULL DEFAULT 'surveillance',
  generated_by TEXT NOT NULL,
  pdf_storage_path TEXT,
  includes_no_ai_cert BOOLEAN NOT NULL DEFAULT TRUE,
  evidence_file_ids UUID[] NOT NULL DEFAULT '{}',
  report_hash TEXT,
  generated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── AUTO-UPDATE TIMESTAMPS ───────────────────────────────────────────────
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER cases_updated_at BEFORE UPDATE ON cases
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER subjects_updated_at BEFORE UPDATE ON subjects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER observation_logs_updated_at BEFORE UPDATE ON observation_logs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
