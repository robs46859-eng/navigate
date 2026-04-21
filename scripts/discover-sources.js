import fs from "node:fs";
import path from "node:path";

const [, , manifestPathArg, outputPathArg] = process.argv;

if (!manifestPathArg || !outputPathArg) {
  console.error("Usage: node scripts/discover-sources.js <manifest.json> <output.json>");
  process.exit(1);
}

const manifestPath = path.resolve(manifestPathArg);
const outputPath = path.resolve(outputPathArg);
const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));

const discovered = [];

for (const entry of manifest.sources || []) {
  if (entry.url) {
    discovered.push(buildDirectResult(entry));
    continue;
  }

  const url = `https://www.bing.com/search?format=rss&q=${encodeURIComponent(entry.query)}`;
  const res = await fetch(url, {
    headers: {
      "user-agent":
        "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36",
      accept: "text/html,application/xhtml+xml",
    },
  });

  if (!res.ok) {
    discovered.push({
      name: entry.name,
      entity_type: entry.entity_type,
      query: entry.query,
      status: "search_failed",
      error: `HTTP ${res.status}`,
      file_stem: buildStem(entry.entity_type, entry.name || entry.query),
    });
    continue;
  }

  const html = await res.text();
  const results = extractBingRssResults(html)
    .filter((result) => allowed(result.url, entry.allowed_domains || []))
    .slice(0, entry.max_results || manifest.max_results_per_query || 3)
    .map((result) => ({
      name: entry.name || result.title,
      entity_type: entry.entity_type,
      query: entry.query,
      status: "ok",
      title: result.title,
      url: result.url,
      file_stem: buildStem(entry.entity_type, entry.name || result.title || entry.query),
      allowed_domains: entry.allowed_domains || [],
    }));

  if (results.length === 0) {
    discovered.push({
      name: entry.name,
      entity_type: entry.entity_type,
      query: entry.query,
      status: "no_results",
      file_stem: buildStem(entry.entity_type, entry.name || entry.query),
    });
    continue;
  }

  discovered.push(...results);
}

fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, `${JSON.stringify({ generated_at: new Date().toISOString(), discovered }, null, 2)}\n`);
console.log(`Wrote ${outputPath}`);

function buildDirectResult(entry) {
  return {
    name: entry.name,
    entity_type: entry.entity_type,
    query: entry.query || "",
    status: "ok",
    title: entry.name,
    url: entry.url,
    file_stem: buildStem(entry.entity_type, entry.name || entry.url),
    allowed_domains: entry.allowed_domains || [],
  };
}

function extractBingRssResults(xml) {
  const results = [];
  const regex = /<item>[\s\S]*?<title>([\s\S]*?)<\/title>[\s\S]*?<link>(https?:\/\/[\s\S]*?)<\/link>/g;
  let match;
  while ((match = regex.exec(xml))) {
    const title = stripTags(match[1]);
    const url = cleanUrl(match[2]);
    if (!url || !title) continue;
    results.push({ url, title });
  }
  return dedupe(results, (item) => item.url);
}

function allowed(urlString, domains) {
  if (!domains || domains.length === 0) return true;
  try {
    const hostname = new URL(urlString).hostname.replace(/^www\./, "");
    return domains.some((domain) => hostname === domain || hostname.endsWith(`.${domain}`));
  } catch {
    return false;
  }
}

function buildStem(entityType, label) {
  return `${entityType}-${slug(label)}`;
}

function slug(value) {
  return String(value)
    .toLowerCase()
    .replace(/https?:\/\//g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

function stripTags(value) {
  return decodeHtml(value.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim());
}

function cleanUrl(value) {
  return decodeHtml(value).replace(/&amp;/g, "&");
}

function decodeHtml(value) {
  return value
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

function dedupe(items, keyFn) {
  const seen = new Set();
  const output = [];
  for (const item of items) {
    const key = keyFn(item);
    if (seen.has(key)) continue;
    seen.add(key);
    output.push(item);
  }
  return output;
}
