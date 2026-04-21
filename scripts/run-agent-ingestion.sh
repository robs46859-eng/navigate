#!/usr/bin/env bash
set -euo pipefail

MANIFEST="${1:-datasets/manifests/source-discovery.denver.json}"
MODEL="${2:-qwen2.5:1.5b}"

DISCOVERED="datasets/sources/discovered/$(basename "${MANIFEST%.json}").discovered.json"

mkdir -p datasets/sources/discovered datasets/sources/raw datasets/sources/chunks datasets/output/staging datasets/output/final

node scripts/discover-sources.js "$MANIFEST" "$DISCOVERED"
node scripts/fetch-source-pages.js "$DISCOVERED" datasets/sources/raw
node scripts/chunk-raw-sources.js datasets/sources/raw datasets/sources/chunks

shopt -s nullglob
for chunk_file in datasets/sources/chunks/places-*-chunk-*.txt; do
  bash scripts/run-local-dataset.sh "$MODEL" datasets/prompts/places_extract.md "$chunk_file" "datasets/output/staging/$(basename "${chunk_file%.txt}.json")"
done

for chunk_file in datasets/sources/chunks/services-*-chunk-*.txt; do
  bash scripts/run-local-dataset.sh "$MODEL" datasets/prompts/services_extract.md "$chunk_file" "datasets/output/staging/$(basename "${chunk_file%.txt}.json")"
done

bash scripts/validate-dataset-json.sh datasets/output/staging
bash scripts/batch-normalize-dataset-json.sh datasets/output/staging datasets/output/final datasets/sources/raw
bash scripts/validate-dataset-json.sh datasets/output/final
bash scripts/export-seed-artifacts.sh
