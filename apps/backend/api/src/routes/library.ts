import { Router, Request, Response } from "express";
import { google, drive_v3 } from "googleapis";
import { getServiceAccountJSON, requireEnv } from "../utils/env.js";
import type { Readable } from "stream";
import type { GaxiosResponse } from "gaxios";

const r = Router();
function requireSingleString(value: unknown, fieldName: string): string {
  if (typeof value === "string") return value;
  throw new Error(`${fieldName} must be a single string value.`);
}

// --- in-memory cache
const TTL = Number(process.env.LIBRARY_CACHE_TTL_MS || 5 * 60 * 1000);
let cache: { at: number; payload: any | null } = { at: 0, payload: null };

type LibraryDoc = {
  id: string;
  title: string;
  updated: string;
  checksum: string | null;
  previewUrl: string;
  downloadUrl: string;
};

async function driveClient() {
  const credentials = JSON.parse(getServiceAccountJSON());
  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ["https://www.googleapis.com/auth/drive.readonly"],
  });
  return google.drive({ version: "v3", auth });
}

async function listPdfsByFolder(folderId: string): Promise<LibraryDoc[]> {
  const drive = await driveClient();
  const q = `'${folderId}' in parents and mimeType='application/pdf' and trashed=false`;
  const fields: drive_v3.Params$Resource$Files$List["fields"] =
    "files(id,name,modifiedTime,md5Checksum),nextPageToken";

  let pageToken: string | undefined = undefined;
  const files: drive_v3.Schema$File[] = [];

  do {
    const res = await drive.files.list({
      q,
      fields,
      pageSize: 1000,
      pageToken,
      orderBy: "name_natural",
    });
    const data = res.data as drive_v3.Schema$FileList; // <— type only data
    files.push(...(data.files ?? []));
    pageToken = data.nextPageToken ?? undefined;
  } while (pageToken);

  return (files as drive_v3.Schema$File[]).map((f) => ({
    id: String(f.id),
    title: String(f.name),
    updated: String(f.modifiedTime),
    checksum: f.md5Checksum ?? null,
    previewUrl: `https://drive.google.com/file/d/${f.id}/preview`,
    downloadUrl: `https://drive.google.com/uc?export=download&id=${f.id}`,
  }));
}

// GET /api/library
r.get("/library", async (req: Request, res: Response) => {
  try {
    const bypass = req.query.refresh === "true";
    if (!bypass && cache.payload && Date.now() - cache.at < TTL) {
      return res.json(cache.payload);
    }
    const folderId = requireEnv("DRIVE_FOLDER_ID");
    console.log("Using DRIVE_FOLDER_ID =", folderId);
    const docs = await listPdfsByFolder(folderId);
    const payload = {
      ok: true,
      count: docs.length,
      docs,
      cachedAt: new Date().toISOString(),
      ttlMs: TTL,
    };
    cache = { at: Date.now(), payload };
    res.json(payload);
  } catch (e: any) {
    res.status(500).json({ ok: false, error: String(e.message || e) });
  }
});

// Optional private proxy: GET /api/library/:id/download
r.get("/library/:id/download", async (req: Request, res: Response) => {
  try {
    // TODO: add your auth check if needed
    const drive = await driveClient();
    // Example: if you currently do something like: const { id } = req.query;
    const id = requireSingleString(req.query.id, "id"); // OR req.params.id depending on your route

    const resp = (await drive.files.get(
      { fileId: id, alt: "media" },
      { responseType: "stream" },
    )) as unknown as GaxiosResponse<Readable>;

    resp.data.pipe(res);
  } catch (e: any) {
    res.status(500).json({ ok: false, error: String(e.message || e) });
  }
});

export default r;
