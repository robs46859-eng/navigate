import fs from "node:fs";
import path from "node:path";

const FINAL_DIR = path.resolve("datasets/output/final");
const EXPORT_DIR = path.resolve("datasets/export");
const TS_OUTPUT = path.resolve("src/constants/generatedSeedData.ts");
const JSON_OUTPUT = path.join(EXPORT_DIR, "generated-seed.json");

fs.mkdirSync(EXPORT_DIR, { recursive: true });
fs.mkdirSync(path.dirname(TS_OUTPUT), { recursive: true });

const places = collectFinal("places").map((item, index) => ({
  id: item.id || `generated-place-${index + 1}`,
  ...stripMeta(item),
}));

const services = collectFinal("services").map((item, index) => ({
  id: item.id || `generated-service-${index + 1}`,
  ...stripMeta(item),
}));

const payload = {
  generated_at: new Date().toISOString(),
  places,
  services,
};

fs.writeFileSync(JSON_OUTPUT, `${JSON.stringify(payload, null, 2)}\n`);
fs.writeFileSync(
  TS_OUTPUT,
  `import type { Place, Service } from '../types';\n\n` +
    `export const GENERATED_PLACES: Place[] = ${JSON.stringify(places, null, 2)};\n\n` +
    `export const GENERATED_SERVICES: Service[] = ${JSON.stringify(services, null, 2)};\n`,
);

console.log(`Wrote ${JSON_OUTPUT}`);
console.log(`Wrote ${TS_OUTPUT}`);

function readCollection(filePath, key) {
  if (!fs.existsSync(filePath)) return [];
  const parsed = JSON.parse(fs.readFileSync(filePath, "utf8"));
  return Array.isArray(parsed?.[key]) ? parsed[key] : [];
}

function collectFinal(key) {
  if (!fs.existsSync(FINAL_DIR)) return [];
  const files = fs
    .readdirSync(FINAL_DIR)
    .filter((file) => file.endsWith(".json"))
    .sort();
  return files.flatMap((file) => readCollection(path.join(FINAL_DIR, file), key));
}

function stripMeta(item) {
  const clone = { ...item };
  delete clone._meta;
  return clone;
}
