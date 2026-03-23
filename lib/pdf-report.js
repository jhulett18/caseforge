import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { formatDate, today } from "./mock-data";

const MARGIN = 50;
const PAGE_WIDTH = 612; // Letter size
const PAGE_HEIGHT = 792;
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN * 2;

const BLACK = rgb(0.1, 0.1, 0.1);
const GRAY = rgb(0.4, 0.4, 0.4);
const LIGHT_GRAY = rgb(0.85, 0.85, 0.85);
const GOLD = rgb(0.72, 0.53, 0.04);
const WHITE = rgb(1, 1, 1);

export async function generateReport(caseData, evidence, narratives) {
  const doc = await PDFDocument.create();
  const font = await doc.embedFont(StandardFonts.TimesRoman);
  const fontBold = await doc.embedFont(StandardFonts.TimesRomanBold);
  const mono = await doc.embedFont(StandardFonts.Courier);

  let page = doc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
  let y = PAGE_HEIGHT - MARGIN;

  // ── Helper functions ──
  function drawText(text, x, yPos, options = {}) {
    const { size = 10, f = font, color = BLACK, maxWidth } = options;
    if (maxWidth) {
      const words = text.split(" ");
      let line = "";
      let currentY = yPos;
      for (const word of words) {
        const test = line ? `${line} ${word}` : word;
        const w = f.widthOfTextAtSize(test, size);
        if (w > maxWidth && line) {
          page.drawText(line, { x, y: currentY, size, font: f, color });
          currentY -= size + 4;
          line = word;
        } else {
          line = test;
        }
      }
      if (line) {
        page.drawText(line, { x, y: currentY, size, font: f, color });
        currentY -= size + 4;
      }
      return currentY;
    }
    page.drawText(text, { x, y: yPos, size, font: f, color });
    return yPos - size - 4;
  }

  function drawLine(yPos, thickness = 0.5) {
    page.drawLine({
      start: { x: MARGIN, y: yPos },
      end: { x: PAGE_WIDTH - MARGIN, y: yPos },
      thickness,
      color: LIGHT_GRAY,
    });
    return yPos - 8;
  }

  function drawSectionTitle(title, yPos) {
    page.drawText(title, {
      x: MARGIN,
      y: yPos,
      size: 9,
      font: fontBold,
      color: GRAY,
    });
    yPos -= 4;
    page.drawLine({
      start: { x: MARGIN, y: yPos },
      end: { x: PAGE_WIDTH - MARGIN, y: yPos },
      thickness: 0.5,
      color: LIGHT_GRAY,
    });
    return yPos - 14;
  }

  function drawInfoRow(label, value, x, yPos) {
    page.drawText(label, { x, y: yPos, size: 9, font: fontBold, color: GRAY });
    const labelW = fontBold.widthOfTextAtSize(label, 9);
    page.drawText(value, {
      x: x + labelW + 4,
      y: yPos,
      size: 9,
      font,
      color: BLACK,
    });
    return yPos - 16;
  }

  function checkPage(needed = 80) {
    if (y < MARGIN + needed) {
      page = doc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
      y = PAGE_HEIGHT - MARGIN;
    }
  }

  // ── HEADER ──
  page.drawText("TORRES", {
    x: MARGIN,
    y,
    size: 20,
    font: fontBold,
    color: BLACK,
  });
  const torresW = fontBold.widthOfTextAtSize("TORRES ", 20);
  page.drawText("INVESTIGATIVE", {
    x: MARGIN + torresW,
    y,
    size: 20,
    font: fontBold,
    color: GOLD,
  });
  y -= 16;
  y = drawText(
    `Licensed Private Investigator · Florida License ${caseData.licenseNo}`,
    MARGIN,
    y,
    { size: 8, color: GRAY }
  );
  y -= 4;

  // Right-aligned report meta
  const metaX = PAGE_WIDTH - MARGIN - 160;
  const metaStartY = PAGE_HEIGHT - MARGIN;
  drawText("SURVEILLANCE REPORT", metaX, metaStartY, {
    size: 9,
    f: fontBold,
  });
  drawText(`Case No: ${caseData.id}`, metaX, metaStartY - 14, {
    size: 8,
    color: GRAY,
  });
  drawText(`Generated: ${today()}`, metaX, metaStartY - 26, {
    size: 8,
    color: GRAY,
  });
  drawText(`Claim No: ${caseData.subject.claimNumber}`, metaX, metaStartY - 38, {
    size: 8,
    color: GRAY,
  });

  // Header line
  page.drawLine({
    start: { x: MARGIN, y },
    end: { x: PAGE_WIDTH - MARGIN, y },
    thickness: 2,
    color: BLACK,
  });
  y -= 20;

  // ── CASE INFORMATION ──
  y = drawSectionTitle("CASE INFORMATION", y);
  const col2 = MARGIN + CONTENT_WIDTH / 2;
  const y1a = drawInfoRow("Client:", caseData.client, MARGIN, y);
  const y1b = drawInfoRow("Case Type:", caseData.caseType, col2, y);
  y = Math.min(y1a, y1b);
  const y2a = drawInfoRow("Assigned PI:", caseData.assignedPI, MARGIN, y);
  const y2b = drawInfoRow("Date Opened:", formatDate(caseData.openedDate), col2, y);
  y = Math.min(y2a, y2b);
  y = drawInfoRow("Status:", caseData.status, MARGIN, y);
  y -= 8;

  // ── SUBJECT PROFILE ──
  y = drawSectionTitle("SUBJECT PROFILE", y);
  const y3a = drawInfoRow("Name:", caseData.subject.name, MARGIN, y);
  const y3b = drawInfoRow("DOB:", formatDate(caseData.subject.dob), col2, y);
  y = Math.min(y3a, y3b);
  y = drawInfoRow("Claim Number:", caseData.subject.claimNumber, MARGIN, y);
  y = drawInfoRow("Address:", caseData.subject.address, MARGIN, y);
  y = drawInfoRow("Vehicle:", caseData.subject.vehicle, MARGIN, y);
  y = drawInfoRow("Claimed Injury:", caseData.subject.claimedInjury, MARGIN, y);
  y -= 8;

  // ── EVIDENCE LOG TABLE ──
  y = drawSectionTitle(
    `EVIDENCE LOG — ${evidence.length} CLIPS RECORDED`,
    y
  );

  // Table header
  const cols = [MARGIN, MARGIN + 25, MARGIN + 195, MARGIN + 260, MARGIN + 310, MARGIN + 360];
  const headers = ["#", "File Name", "Date", "Time", "Duration", "Status"];
  page.drawRectangle({
    x: MARGIN,
    y: y - 4,
    width: CONTENT_WIDTH,
    height: 16,
    color: BLACK,
  });
  headers.forEach((h, i) => {
    page.drawText(h, {
      x: cols[i],
      y: y,
      size: 7,
      font: fontBold,
      color: WHITE,
    });
  });
  y -= 20;

  // Table rows
  evidence.forEach((ev, i) => {
    checkPage(60);
    const rowY = y;
    if (i % 2 === 1) {
      page.drawRectangle({
        x: MARGIN,
        y: rowY - 4,
        width: CONTENT_WIDTH,
        height: 14,
        color: rgb(0.97, 0.97, 0.97),
      });
    }
    page.drawText(`${i + 1}`, { x: cols[0], y: rowY, size: 8, font: mono, color: BLACK });
    page.drawText(ev.clipName, { x: cols[1], y: rowY, size: 7, font, color: BLACK });
    page.drawText(formatDate(ev.date), { x: cols[2], y: rowY, size: 8, font, color: BLACK });
    page.drawText(ev.time, { x: cols[3], y: rowY, size: 8, font: mono, color: BLACK });
    page.drawText(ev.duration, { x: cols[4], y: rowY, size: 8, font: mono, color: BLACK });
    page.drawText(ev.verified ? "Verified" : "Pending", {
      x: cols[5],
      y: rowY,
      size: 8,
      font: fontBold,
      color: ev.verified ? rgb(0.08, 0.47, 0.13) : rgb(0.52, 0.39, 0.02),
    });
    y -= 16;

    // Location
    page.drawText(`Location: ${ev.location}`, {
      x: cols[1],
      y: y,
      size: 7,
      font,
      color: GRAY,
    });
    y -= 12;

    // Observation
    const narrative = narratives[ev.id];
    if (narrative) {
      checkPage(40);
      page.drawText("Investigator Observation:", {
        x: cols[1],
        y: y,
        size: 7,
        font: fontBold,
        color: GRAY,
      });
      y -= 12;
      y = drawText(narrative, cols[1], y, {
        size: 8,
        maxWidth: CONTENT_WIDTH - 30,
      });
      y -= 4;
    }

    // Hash
    if (ev.sha256) {
      page.drawText(`SHA-256: ${ev.sha256.substring(0, 32)}...`, {
        x: cols[1],
        y: y,
        size: 6,
        font: mono,
        color: GRAY,
      });
      y -= 12;
    }

    y -= 4;
  });

  // ── INVESTIGATOR CERTIFICATION ──
  checkPage(140);
  y -= 8;
  y = drawSectionTitle("INVESTIGATOR CERTIFICATION", y);
  y = drawText(
    `I, ${caseData.assignedPI}, hereby certify that the information contained in this report is true and accurate to the best of my knowledge and belief, and was obtained through lawful means in the course of a licensed investigation.`,
    MARGIN,
    y,
    { size: 10, maxWidth: CONTENT_WIDTH }
  );
  y -= 24;
  page.drawLine({
    start: { x: MARGIN, y },
    end: { x: MARGIN + 260, y },
    thickness: 0.5,
    color: BLACK,
  });
  y -= 14;
  drawText(
    `${caseData.assignedPI} · License ${caseData.licenseNo} · Date: _______________`,
    MARGIN,
    y,
    { size: 9, color: GRAY }
  );
  y -= 24;

  // ── NO-AI CERTIFICATION ──
  checkPage(100);
  page.drawRectangle({
    x: MARGIN,
    y: y - 60,
    width: CONTENT_WIDTH,
    height: 72,
    color: rgb(0.96, 0.96, 0.96),
  });
  page.drawLine({
    start: { x: MARGIN, y: y - 60 },
    end: { x: MARGIN, y: y + 12 },
    thickness: 3,
    color: LIGHT_GRAY,
  });
  y -= 2;
  drawText("AUTOMATED ASSEMBLY NOTICE — NO AI CERTIFICATION", MARGIN + 10, y, {
    size: 8,
    f: fontBold,
    color: GRAY,
  });
  y -= 14;
  y = drawText(
    "This report was assembled by automated software from case management data entered and verified by the licensed investigator. All narrative observations are authored by the assigned investigator. No artificial intelligence language model was used to generate, modify, or suggest any content in this document. This certification is provided in anticipation of compliance with proposed Federal Rule of Evidence 707 regarding AI-generated evidence disclosure.",
    MARGIN + 10,
    y,
    { size: 7, color: GRAY, maxWidth: CONTENT_WIDTH - 20 }
  );

  // ── FOOTER ──
  const footerY = MARGIN - 10;
  page.drawText("CONFIDENTIAL — Attorney/Client Privileged Material", {
    x: MARGIN,
    y: footerY,
    size: 7,
    font,
    color: GRAY,
  });
  const caseFooter = `Case ${caseData.id} · ${today()}`;
  const footerW = font.widthOfTextAtSize(caseFooter, 7);
  page.drawText(caseFooter, {
    x: PAGE_WIDTH - MARGIN - footerW,
    y: footerY,
    size: 7,
    font,
    color: GRAY,
  });

  return await doc.save();
}
