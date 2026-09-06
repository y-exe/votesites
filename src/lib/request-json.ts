import "server-only";

import { getRequestOrigins } from "@/lib/security";

const DEFAULT_MAX_BYTES = 4 * 1024;

async function readLimitedJsonValue(
  body: ReadableStream<Uint8Array> | null,
  declaredLengthHeader: string | null,
  maxBytes: number,
): Promise<unknown> {
  const declaredLength = Number(declaredLengthHeader);
  if (Number.isFinite(declaredLength) && declaredLength > maxBytes) {
    throw new Error("Body is too large");
  }
  if (!body) throw new Error("Body is missing");

  const reader = body.getReader();
  const chunks: Uint8Array[] = [];
  let totalBytes = 0;

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    totalBytes += value.byteLength;
    if (totalBytes > maxBytes) {
      await reader.cancel();
      throw new Error("Body is too large");
    }
    chunks.push(value);
  }

  const bytes = new Uint8Array(totalBytes);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.byteLength;
  }

  return JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(bytes));
}

export async function readLimitedJsonObject(
  request: Request,
  maxBytes = DEFAULT_MAX_BYTES,
): Promise<Record<string, unknown>> {
  if (
    request.headers.get("content-type")?.split(";", 1)[0].trim().toLowerCase() !==
    "application/json"
  ) {
    throw new Error("Unsupported content type");
  }

  const origin = request.headers.get("origin");
  if (origin && !getRequestOrigins(request).has(origin)) {
    throw new Error("Cross-origin request rejected");
  }

  const parsed = await readLimitedJsonValue(
    request.body,
    request.headers.get("content-length"),
    maxBytes,
  );
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
    throw new Error("JSON object expected");
  }
  return parsed as Record<string, unknown>;
}

export async function readLimitedJsonResponse(
  response: Response,
  maxBytes: number,
): Promise<unknown> {
  return readLimitedJsonValue(
    response.body,
    response.headers.get("content-length"),
    maxBytes,
  );
}
