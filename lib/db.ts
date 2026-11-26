import { promises as fs } from "fs";
import path from "path";
import type { DB } from "./types";
import { seed } from "./seed";
import { withTranslations } from "./seed-i18n";

const FILE = path.join(process.cwd(), "data", "db.json");

export async function readDB(): Promise<DB> {
  try {
    // Older db.json files get the default fr/ar translations filled in (never overwritten).
    return withTranslations(JSON.parse(await fs.readFile(FILE, "utf8")) as DB);
  } catch {
    await writeDB(seed);
    return structuredClone(seed);
  }
}

export async function writeDB(db: DB) {
  await fs.mkdir(path.dirname(FILE), { recursive: true });
  await fs.writeFile(FILE, JSON.stringify(db, null, 2), "utf8");
}

export async function updateDB(fn: (db: DB) => void | DB) {
  const db = await readDB();
  const next = fn(db) ?? db;
  await writeDB(next);
}
