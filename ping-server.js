const http = require("http");

const port = 8080;

const server = http.createServer((req, res) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);

  if (req.url === "/api/ping") {
    const body = JSON.stringify({
      ok: true,
      pong: new Date().toISOString(),
    });

    res.writeHead(200, {
      "Content-Type": "application/json",
      "Content-Length": Buffer.byteLength(body),
    });
    res.end(body);
  } else {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("Not found");
  }
});

server.listen(port, "127.0.0.1", () => {
  console.log(`Plain HTTP server running at http://127.0.0.1:${port}`);
});
