import { buildServer } from "../src/http/server";

const appPromise = buildServer();

export default async function handler(req: any, res: any) {
  const app = await appPromise;
  await app.ready();

  if (typeof req.url === "string" && req.url.startsWith("/api")) {
    req.url = req.url.replace(/^\/api/, "") || "/";
  }

  app.server.emit("request", req, res);
}
