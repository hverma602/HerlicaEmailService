import { createServer } from "node:http";
import { sendMail, sendUserMail } from "./mailer.js";

function sendJson(response, statusCode, data) {
  response.writeHead(statusCode, { "Content-Type": "application/json" });
  response.end(JSON.stringify(data));
}

const PORT = process.env.PORT || 3000;

async function readJson(request) {
  const chunks = [];

  for await (const chunk of request) {
    chunks.push(chunk);
  }

  if (chunks.length === 0) {
    return {};
  }

  return JSON.parse(Buffer.concat(chunks).toString("utf8"));
}

const server = createServer(async (request, response) => {
  response.setHeader("Access-Control-Allow-Origin", "*");
  response.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  response.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (request.method === "OPTIONS") {
    response.writeHead(204);
    response.end();
    return;
  }

  try {
    if (request.method === "POST" && request.url === "/send") {
      const body = await readJson(request);
      const info = await sendMail(body);
      await sendUserMail(body);
      console.log("Email sent successfully:", info);

      sendJson(response, 202, { ok: true, messageId: info.data.id });
      return;
    }

    sendJson(response, 404, { ok: false, error: "Not found" });
  } catch (error) {
    const statusCode = error instanceof SyntaxError ? 400 : 500;
    sendJson(response, statusCode, { ok: false, error: error.message });
  }
});

server.listen(PORT, () => {
  console.log(`SMTP app listening on ${PORT}`);
});
