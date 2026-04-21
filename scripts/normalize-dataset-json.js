import fs from "node:fs";
import path from "node:path";

const [, , inputPath, outputPath, sourcePathArg] = process.argv;

if (!inputPath || !outputPath) {
  console.error("Usage: node scripts/normalize-dataset-json.js <input_json> <output_json> [source_file]");
  process.exit(1);
}

const PLACE_CATEGORIES = new Set([
  "bathroom",
  "nursing_room",
  "hospital",
  "playground",
  "pediatric_urgent_care",
  "cafe",
  "changing_station",
  "prenatal_class",
  "rest_stop",
]);

const SERVICE_CATEGORIES = new Set([
  "babysitting",
  "pediatrician",
  "therapist",
  "exercise",
  "lactation",
  "birth_services",
  "sleep_consultant",
]);

const ACCESSIBILITY_MAP = new Map([
  ["wheelchair", "wheelchair"],
  ["wheelchair accessible", "wheelchair"],
  ["wheelchair accessible entrances", "wheelchair"],
  ["family restroom", "family_restroom"],
  ["family restrooms", "family_restroom"],
  ["nursing room", "nursing_room"],
  ["nursing rooms", "nursing_room"],
  ["changing table", "changing_table"],
  ["changing tables", "changing_table"],
  ["stroller parking", "stroller_parking"],
]);

const rawInput = JSON.parse(fs.readFileSync(inputPath, "utf8"));
const sourcePath = sourcePathArg || guessSourcePath(inputPath);
const sourceBlocks = sourcePath && fs.existsSync(sourcePath) ? parseSourceBlocks(fs.readFileSync(sourcePath, "utf8")) : [];

const normalized = normalizeRoot(rawInput, sourceBlocks);

fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, `${JSON.stringify(normalized, null, 2)}\n`);
console.log(`Normalized ${inputPath} -> ${outputPath}`);

function guessSourcePath(currentInputPath) {
  const baseName = path.basename(currentInputPath, ".json");
  const candidate = path.resolve(path.dirname(currentInputPath), "../../sources/chunks", `${baseName}-source.txt`);
  if (fs.existsSync(candidate)) return candidate;
  return "";
}

function normalizeRoot(value, blocks) {
  if (Array.isArray(value)) {
    return { services: value.map((item) => normalizeService(item, matchBlock(item, blocks, "service"))) };
  }
  if (value && typeof value === "object" && Array.isArray(value.places)) {
    return { places: value.places.map((item) => normalizePlace(item, matchBlock(item, blocks, "place"))) };
  }
  if (value && typeof value === "object" && Array.isArray(value.services)) {
    return { services: value.services.map((item) => normalizeService(item, matchBlock(item, blocks, "service"))) };
  }
  return { services: [] };
}

function normalizePlace(item, block) {
  const name = stringOrFallback(item?.name, block?.name, block?.title);
  const address = stringOrFallback(item?.address, block?.fields.address);
  const websiteUrl = stringOrFallback(item?.websiteUrl, block?.fields.website);
  const description = nullableString(item?.description ?? block?.fields.description ?? null);
  const hours = nullableString(item?.hours ?? block?.fields.hours ?? null);
  const phone = nullableString(item?.phone ?? block?.fields.phone ?? null);
  const category = normalizePlaceCategory(item?.category, block, description, name);
  const accessibilityFeatures = normalizeAccessibility(item?.accessibilityFeatures, block);

  return {
    name,
    address,
    category,
    lat: numberOrNull(item?.lat),
    lng: numberOrNull(item?.lng),
    source: stringOrFallback(item?.source, block?.fields["source label"], "Unknown"),
    rating: numberOrNull(item?.rating),
    reviewCount: numberOrNull(item?.reviewCount),
    description,
    hours,
    phone,
    websiteUrl,
    photos: stringArray(item?.photos),
    accessibilityFeatures,
    aggregateStats: normalizeAggregateStats(item?.aggregateStats),
    _meta: normalizeMeta(item?._meta, {
      source_url: websiteUrl,
      source_title: stringOrFallback(block?.fields["source label"], name),
      source_date: null,
      evidence: stringOrFallback(block?.fields.description, block?.fields["source label"]),
      confidence: numberOrDefault(item?._meta?.confidence, 0.8),
      dedupe_key_hint: buildDedupeKey(name, address, websiteUrl),
    }),
  };
}

function normalizeService(item, block) {
  const name = stringOrFallback(item?.name, block?.name, block?.title);
  const address = stringOrFallback(item?.address, block?.fields.address);
  const websiteUrl = stringOrFallback(item?.websiteUrl, block?.fields.website);
  const category = normalizeServiceCategory(item?.category, block, name);
  const phone = nullableString(item?.phone ?? block?.fields.phone ?? null);
  const email = nullableString(item?.email ?? block?.fields.email ?? null);
  const hours = nullableString(item?.hours ?? block?.fields.hours ?? null);
  const description = nullableString(item?.description ?? block?.fields.description ?? null);
  const availability = nullableString(item?.availability ?? block?.fields.availability ?? null);
  const verificationBadges = stringArray(item?.verificationBadges);

  if (verificationBadges.length === 0 && block?.fields.credentials) {
    verificationBadges.push(...splitList(block.fields.credentials));
  }

  return {
    name,
    category,
    description,
    rating: numberOrNull(item?.rating),
    reviewCount: numberOrNull(item?.reviewCount),
    phone,
    email,
    websiteUrl,
    hours,
    address,
    coordinates: normalizeCoordinates(item?.coordinates),
    specializations: stringArray(item?.specializations, block?.fields.specializations),
    languages: stringArray(item?.languages, block?.fields.languages),
    insuranceAccepted: stringArray(item?.insuranceAccepted, block?.fields["insurance accepted"]),
    pricing: normalizePricing(item?.pricing),
    availability,
    verificationBadges,
    imageUrl: nullableString(item?.imageUrl ?? null),
    photos: stringArray(item?.photos),
    createdDate: nullableString(item?.createdDate ?? null),
    _meta: normalizeMeta(item?._meta, {
      source_url: websiteUrl,
      source_title: stringOrFallback(block?.fields["source label"], name),
      source_date: null,
      evidence: stringOrFallback(block?.fields.description, block?.fields["source label"]),
      confidence: numberOrDefault(item?._meta?.confidence, 0.8),
      dedupe_key_hint: buildDedupeKey(name, address, websiteUrl),
    }),
  };
}

function normalizePlaceCategory(category, block, description, name) {
  const direct = slug(category);
  if (PLACE_CATEGORIES.has(direct)) return direct;

  const hints = [
    block?.fields.type,
    block?.fields.category,
    description,
    name,
    block?.raw,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  if (hints.includes("urgent care")) return "pediatric_urgent_care";
  if (hints.includes("hospital")) return "hospital";
  if (hints.includes("nursing")) return "nursing_room";
  if (hints.includes("changing")) return "changing_station";
  if (hints.includes("playground")) return "playground";
  if (hints.includes("prenatal")) return "prenatal_class";
  if (hints.includes("bathroom") || hints.includes("restroom")) return "bathroom";
  if (hints.includes("cafe")) return "cafe";
  return "rest_stop";
}

function normalizeServiceCategory(category, block, name) {
  const direct = slug(category);
  if (SERVICE_CATEGORIES.has(direct)) return direct;

  const hints = [category, block?.fields.category, name, block?.raw].filter(Boolean).join(" ").toLowerCase();
  if (hints.includes("lactation")) return "lactation";
  if (hints.includes("sleep")) return "sleep_consultant";
  if (hints.includes("birth")) return "birth_services";
  if (hints.includes("doula")) return "birth_services";
  if (hints.includes("pediatric")) return "pediatrician";
  if (hints.includes("therap")) return "therapist";
  if (hints.includes("exercise") || hints.includes("fitness")) return "exercise";
  if (hints.includes("baby") || hints.includes("nanny") || hints.includes("babysit")) return "babysitting";
  return "therapist";
}

function normalizeAccessibility(values, block) {
  const raw = [
    ...stringArray(values),
    ...splitList(block?.fields["family amenities"]),
    ...splitList(block?.fields.accessibility),
  ];

  const normalized = [];
  for (const value of raw) {
    const mapped = ACCESSIBILITY_MAP.get(value.toLowerCase().trim());
    if (mapped && !normalized.includes(mapped)) normalized.push(mapped);
  }
  return normalized;
}

function normalizeAggregateStats(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  return {
    avgCleanliness: numberOrNull(value.avgCleanliness),
    avgPrivacy: numberOrNull(value.avgPrivacy),
    strollerAccessRate: numberOrNull(value.strollerAccessRate),
    reviewCount: numberOrNull(value.reviewCount),
  };
}

function normalizeCoordinates(value) {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    return {
      lat: numberOrNull(value.lat),
      lng: numberOrNull(value.lng),
    };
  }
  return { lat: null, lng: null };
}

function normalizePricing(value) {
  const range = value?.range === "$" || value?.range === "$$" || value?.range === "$$$" ? value.range : null;
  return {
    range,
    estimate: nullableString(value?.estimate ?? null),
    details: nullableString(value?.details ?? null),
  };
}

function normalizeMeta(value, defaults) {
  return {
    source_url: stringOrFallback(value?.source_url, defaults.source_url),
    source_title: stringOrFallback(value?.source_title, defaults.source_title),
    source_date: nullableString(value?.source_date ?? defaults.source_date ?? null),
    evidence: stringOrFallback(value?.evidence, defaults.evidence),
    confidence: clamp(numberOrDefault(value?.confidence, defaults.confidence), 0, 1),
    dedupe_key_hint: stringOrFallback(value?.dedupe_key_hint, defaults.dedupe_key_hint),
  };
}

function parseSourceBlocks(text) {
  return text
    .split(/\n\s*\n/)
    .map((chunk) => chunk.trim())
    .filter(Boolean)
    .map((chunk) => {
      const lines = chunk.split("\n").map((line) => line.trim()).filter(Boolean);
      const fields = {};
      for (const line of lines.slice(1)) {
        const idx = line.indexOf(":");
        if (idx === -1) continue;
        fields[line.slice(0, idx).trim().toLowerCase()] = line.slice(idx + 1).trim();
      }
      return {
        raw: chunk,
        title: lines[0] || "",
        name: lines[0] || "",
        fields,
      };
    });
}

function matchBlock(item, blocks, kind) {
  const candidates = [
    item?.websiteUrl,
    item?.phone,
    item?.address,
    item?.name,
    item?.source,
  ]
    .filter(Boolean)
    .map((value) => String(value).toLowerCase());

  for (const block of blocks) {
    const haystack = [block.name, ...Object.values(block.fields)].join(" ").toLowerCase();
    if (candidates.some((candidate) => candidate && haystack.includes(candidate))) {
      return block;
    }
  }

  if (kind === "place") return blocks[0] || null;
  return blocks.find((block) => block.fields.category) || blocks[0] || null;
}

function splitList(value) {
  if (!value || typeof value !== "string") return [];
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function stringArray(primary, fallbackListValue) {
  if (Array.isArray(primary)) return primary.map(String).map((item) => item.trim()).filter(Boolean);
  if (typeof primary === "string") return splitList(primary);
  return splitList(fallbackListValue);
}

function stringOrFallback(...values) {
  for (const value of values) {
    if (typeof value === "string" && value.trim()) return value.trim();
  }
  return "";
}

function nullableString(value) {
  if (typeof value === "string" && value.trim()) return value.trim();
  return null;
}

function numberOrNull(value) {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim()) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
}

function numberOrDefault(value, fallback) {
  const parsed = numberOrNull(value);
  return parsed ?? fallback;
}

function buildDedupeKey(name, address, websiteUrl) {
  return [name, address, websiteUrl]
    .map((value) => slug(value))
    .filter(Boolean)
    .join("|");
}

function slug(value) {
  if (typeof value !== "string") return "";
  return value.trim().toLowerCase().replace(/[\s/]+/g, "_");
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}
