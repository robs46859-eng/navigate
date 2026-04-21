import fs from "node:fs";
import path from "node:path";

const [, , discoveredPathArg, outputDirArg] = process.argv;

if (!discoveredPathArg || !outputDirArg) {
  console.error("Usage: node scripts/fetch-source-pages.js <discovered.json> <output_dir>");
  process.exit(1);
}

const discoveredPath = path.resolve(discoveredPathArg);
const outputDir = path.resolve(outputDirArg);
const payload = JSON.parse(fs.readFileSync(discoveredPath, "utf8"));

fs.mkdirSync(outputDir, { recursive: true });

for (const item of payload.discovered || []) {
  if (item.status !== "ok" || !item.url) continue;

  try {
    const response = await fetch(item.url, {
      headers: {
        "user-agent":
          "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36",
        accept: "text/html,application/xhtml+xml",
      },
    });

    if (!response.ok) {
      console.error(`Fetch failed ${item.url}: HTTP ${response.status}`);
      continue;
    }

    const html = await response.text();
    const title = extractTitle(html) || item.title || item.name || "";
    const text = extractText(html).slice(0, 20000);
    const output = [
      `Entity type: ${item.entity_type}`,
      `Name: ${item.name || title}`,
      `Title: ${title}`,
      `URL: ${item.url}`,
      `Query: ${item.query || ""}`,
      `Fetched at: ${new Date().toISOString()}`,
      "",
      text,
    ].join("\n");

    const filePath = path.join(outputDir, `${item.file_stem}-source.txt`);
    fs.writeFileSync(filePath, `${output}\n`);
    console.log(`Wrote ${filePath}`);
  } catch (error) {
    console.error(`Fetch failed ${item.url}: ${error instanceof Error ? error.message : String(error)}`);
    continue;
  }
}

function extractTitle(html) {
  const match = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  return match ? decodeHtml(match[1].replace(/\s+/g, " ").trim()) : "";
}

function extractText(html) {
  return decodeHtml(
    html
      .replace(/<script[\s\S]*?<\/script>/gi, " ")
      .replace(/<style[\s\S]*?<\/style>/gi, " ")
      .replace(/<noscript[\s\S]*?<\/noscript>/gi, " ")
      .replace(/<svg[\s\S]*?<\/svg>/gi, " ")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim(),
  );
}

function decodeHtml(value) {
  return value
    .replace(/&nbsp;/g, " ")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}
