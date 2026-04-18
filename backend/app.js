const dotEnv = require("dotenv");
dotEnv.config();
require("./config/db");
require("./utils/emailHelpers");
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const { apiRouter } = require("./api/v1/routes");

const app = express();
const client = require("prom-client");

// ─── Collect default metrics (cpu, memory, etc.) ──────────────────────────────
client.collectDefaultMetrics();

// ─── 1. Counter: total HTTP requests ──────────────────────────────────────────
const httpRequestsTotal = new client.Counter({
  name: "http_requests_total",
  help: "Total number of HTTP requests",
  labelNames: ["method", "route", "status_code"],
});

// ─── 2. Histogram: request duration in seconds ────────────────────────────────
const httpRequestDuration = new client.Histogram({
  name: "http_request_duration_seconds",
  help: "Duration of HTTP requests in seconds",
  labelNames: ["method", "route", "status_code"],
  buckets: [0.01, 0.05, 0.1, 0.3, 0.5, 1, 2, 5], // seconds
});

// ─── 3. Gauge: active connections right now ───────────────────────────────────
const httpActiveConnections = new client.Gauge({
  name: "http_active_connections",
  help: "Number of active HTTP connections",
});

// ─── Middleware: track all three metrics on every request ─────────────────────
app.use((req, res, next) => {
  httpActiveConnections.inc(); // +1 when request starts

  const end = httpRequestDuration.startTimer(); // start timer

  res.on("finish", () => {
    const labels = {
      method: req.method,
      route: req.route?.path || req.path, // e.g. /api/v1/users
      status_code: res.statusCode,
    };

    httpRequestsTotal.inc(labels); // count the request
    end(labels); // record duration
    httpActiveConnections.dec(); // -1 when request ends
  });

  next();
});

// ─── Other middleware ──────────────────────────────────────────────────────────
app.use(morgan("dev"));
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.use("/api/v1", apiRouter);

// ─── Metrics endpoint ─────────────────────────────────────────────────────────
app.get("/metrics", async (req, res) => {
  res.set("Content-Type", client.register.contentType);
  res.end(await client.register.metrics());
});

app.listen(process.env.PORT, () => {
  console.log("-------- ✅✅Server started --------");
});
