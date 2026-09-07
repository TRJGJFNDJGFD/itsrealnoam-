// Velocity-only endpoint. Requires "Authorization: Bearer <STATUS_API_TOKEN>".
// Stores the latest heartbeat in a Netlify Blobs store instead of in-memory
// state, since serverless functions don't keep memory between invocations.
import { getStore } from "@netlify/blobs";
import { validateHeartbeat } from "./lib/validate.ts";
import type { HeartbeatRecord } from "./lib/types.ts";

function json(body: unknown, status: number): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });
}

export default async (req: Request) => {
  if (req.method !== "POST") {
    return json({ error: "Method not allowed" }, 405);
  }

  const expectedToken = process.env.STATUS_API_TOKEN;
  if (!expectedToken) {
    return json({ error: "Server misconfigured: STATUS_API_TOKEN is not set" }, 500);
  }

  const auth = req.headers.get("authorization");
  const token = auth?.startsWith("Bearer ") ? auth.slice("Bearer ".length) : null;
  if (!token || token !== expectedToken) {
    return json({ error: "Unauthorized" }, 401);
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return json({ error: "Body must be valid JSON" }, 400);
  }

  const result = validateHeartbeat(body);
  if (!result.ok) {
    return json({ error: result.error }, 400);
  }

  const record: HeartbeatRecord = { payload: result.payload, receivedAt: Date.now() };
  const store = getStore("status");
  await store.setJSON("latest", record);

  return json({ success: true }, 200);
};

export const config = { path: "/api/v1/heartbeat" };
