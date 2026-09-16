// Velocity-only endpoint. Requires "Authorization: Bearer <STATUS_API_TOKEN>".
// Stores the latest heartbeat in Vercel Blob — real, globally-consistent
// storage (unlike Vercel's Runtime Cache, which is scoped per region/
// instance and isn't reliable for a single shared "latest value" written
// by one server and read by every visitor's browser).
import { put } from "@vercel/blob";
import { validateHeartbeat } from "./_lib/validate.js";
import { HEARTBEAT_BLOB_PATHNAME, type HeartbeatRecord } from "./_lib/types.js";

function json(body: unknown, status: number): Response {
  return Response.json(body, { status });
}

export default {
  async fetch(request: Request) {
    if (request.method !== "POST") {
      return json({ error: "Method not allowed" }, 405);
    }

    const expectedToken = process.env.STATUS_API_TOKEN;
    if (!expectedToken) {
      return json({ error: "Server misconfigured: STATUS_API_TOKEN is not set" }, 500);
    }

    const auth = request.headers.get("authorization");
    const token = auth?.startsWith("Bearer ") ? auth.slice("Bearer ".length) : null;
    if (!token || token !== expectedToken) {
      return json({ error: "Unauthorized" }, 401);
    }

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return json({ error: "Body must be valid JSON" }, 400);
    }

    const result = validateHeartbeat(body);
    if (!result.ok) {
      return json({ error: result.error }, 400);
    }

    const record: HeartbeatRecord = { payload: result.payload, receivedAt: Date.now() };

    await put(HEARTBEAT_BLOB_PATHNAME, JSON.stringify(record), {
      access: "private",
      contentType: "application/json",
      allowOverwrite: true,
      addRandomSuffix: false,
      cacheControlMaxAge: 0,
    });

    return json({ success: true }, 200);
  },
};
