import { createHash } from "crypto";

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file) {
      return Response.json({ error: "No file provided" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const hash = createHash("sha256").update(buffer).digest("hex");

    return Response.json({
      fileName: file.name,
      fileSize: file.size,
      mimeType: file.type,
      sha256: hash,
      hashedAt: new Date().toISOString(),
      serverSide: true,
    });
  } catch (error) {
    console.error("Hashing error:", error);
    return Response.json({ error: "Failed to hash file" }, { status: 500 });
  }
}
