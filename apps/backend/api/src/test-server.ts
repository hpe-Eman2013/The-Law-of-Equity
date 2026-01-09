import express from "express";

const app = express();
const port = 8080;

// Log any incoming request
app.use((req, _res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

app.get("/api/ping", (_req, res) => {
  res.json({ ok: true, pong: new Date().toISOString() });
});

// IMPORTANT: bind explicitly to 127.0.0.1
app.listen(port, "127.0.0.1", () => {
  console.log(`Test server running on http://127.0.0.1:${port}`);
});
