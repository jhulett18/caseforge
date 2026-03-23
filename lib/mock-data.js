// ─── MOCK DATA (simulates Trackops API pull) ───────────────────────────────
export const MOCK_CASE = {
  id: "TRK-2025-0847",
  client: "Hartwell Insurance Group",
  claimant: "Marcus D. Reyes",
  caseType: "Workers' Compensation – Surveillance",
  assignedPI: "J. Torres",
  licenseNo: "FL-PI-1142",
  openedDate: "2025-03-01",
  status: "Active",
  subject: {
    name: "Marcus D. Reyes",
    dob: "1981-07-14",
    address: "2204 Oleander Ave, Fort Pierce, FL 34950",
    vehicle: "2019 Chevrolet Silverado – Dark Blue – FL: ABC-7721",
    claimNumber: "HIL-88421-B",
    claimedInjury: "Lower back / unable to lift over 10 lbs",
  },
};

export const MOCK_EVIDENCE = [
  {
    id: "EV-001",
    clipName: "Clip_001_Reyes_20250310.mp4",
    date: "2025-03-10",
    time: "07:14:33",
    duration: "0:04:22",
    location: "2204 Oleander Ave, Fort Pierce, FL",
    sha256: "a1b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef123456",
    verified: true,
  },
  {
    id: "EV-002",
    clipName: "Clip_002_Reyes_20250310.mp4",
    date: "2025-03-10",
    time: "09:41:08",
    duration: "0:02:57",
    location: "Home Depot, 3401 US-1, Fort Pierce, FL",
    sha256: "b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef1234567a",
    verified: true,
  },
  {
    id: "EV-003",
    clipName: "Clip_003_Reyes_20250310.mp4",
    date: "2025-03-10",
    time: "11:22:45",
    duration: "0:06:10",
    location: "Home Depot Parking Lot, Fort Pierce, FL",
    sha256: "c3d4e5f6789012345678901234567890abcdef1234567890abcdef1234567ab2",
    verified: true,
  },
  {
    id: "EV-004",
    clipName: "Clip_004_Reyes_20250311.mp4",
    date: "2025-03-11",
    time: "08:05:19",
    duration: "0:03:44",
    location: "2204 Oleander Ave, Fort Pierce, FL",
    sha256: "",
    verified: false,
  },
];

// ─── UTILITIES ─────────────────────────────────────────────────────────────
export function formatDate(dateStr) {
  const [y, m, d] = dateStr.split("-");
  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];
  return `${months[parseInt(m) - 1]} ${parseInt(d)}, ${y}`;
}

export function today() {
  return formatDate(new Date().toISOString().split("T")[0]);
}
