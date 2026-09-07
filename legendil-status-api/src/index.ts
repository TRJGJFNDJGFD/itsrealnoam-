import Fastify from "fastify";
import cors from "@fastify/cors";
import rateLimit from "@fastify/rate-limit";
import { config } from "./config.js";
import { recordHeartbeat } from "./state.js";
import { validateHeartbeat } from "./validate.js";
import { buildStatusResponse } from "./status.js";

const app = Fastify({ logger: true, trustProxy: true });

await app.register(cors, {
  origin: config.websiteOrigins,
  methods: ["GET", "POST"],
});

// A generous default for the public GET routes, with a much stricter
// override on the heartbeat endpoint below (only Velocity should ever be
// calling it, at a fixed 5s cadence).
await app.register(rateLimit, {
  global: true,
  max: 300,
  timeWindow: "1 minute",
});

app.get("/api/v1/health", async () => ({ status: "ok" as const }));

app.post(
  "/api/v1/heartbeat",
  {
    config: {
      rateLimit: {
        max: 20,
        timeWindow: "1 minute",
      },
    },
  },
  async (request, reply) => {
    const auth = request.headers.authorization;
    const token = auth?.startsWith("Bearer ") ? auth.slice("Bearer ".length) : null;

    if (!token || token !== config.statusApiToken) {
      return reply.code(401).send({ error: "Unauthorized" });
    }

    const result = validateHeartbeat(request.body);
    if (!result.ok) {
      return reply.code(400).send({ error: result.error });
    }

    recordHeartbeat(result.payload);
    request.log.info(
      { network: result.payload.network, totalPlayers: result.payload.totalPlayers },
      "heartbeat received"
    );
    return { success: true };
  }
);

app.get("/api/v1/status", async () => buildStatusResponse());

app
  .listen({ port: config.port, host: "0.0.0.0" })
  .then(() => {
    app.log.info(`legendil-status-api listening on :${config.port}`);
  })
  .catch((err) => {
    app.log.error(err);
    process.exit(1);
  });
