import { generateReport } from "@/lib/pdf-report";
import { MOCK_CASE, MOCK_EVIDENCE } from "@/lib/mock-data";

export async function POST(request) {
  try {
    const { narratives } = await request.json();

    const pdfBytes = await generateReport(MOCK_CASE, MOCK_EVIDENCE, narratives || {});

    const buffer = Buffer.from(pdfBytes);
    return new Response(buffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="CaseForge_${MOCK_CASE.id}_Report.pdf"`,
        "Content-Length": buffer.length.toString(),
      },
    });
  } catch (error) {
    console.error("Report generation error:", error);
    return Response.json({ error: "Failed to generate report" }, { status: 500 });
  }
}
