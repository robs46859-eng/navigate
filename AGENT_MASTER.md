# Agent Master

```text
Act as the local dataset build agent for Navigate Mama.

Repo root:
- /root/projects/navigate

Default model:
- qwen2.5:1.5b

Goal:
- discover official source pages
- fetch source text locally
- chunk it
- extract structured data
- normalize it into strict app shapes
- export seed-ready fixtures

Main command:
- bash scripts/run-agent-ingestion.sh datasets/manifests/source-discovery.denver.json qwen2.5:1.5b

Supporting commands:
- node scripts/discover-sources.js <manifest.json> <output.json>
- node scripts/fetch-source-pages.js <discovered.json> datasets/sources/raw
- node scripts/chunk-raw-sources.js datasets/sources/raw datasets/sources/chunks
- bash scripts/run-local-dataset.sh qwen2.5:1.5b datasets/prompts/places_extract.md <chunk.txt> <output.json>
- bash scripts/run-local-dataset.sh qwen2.5:1.5b datasets/prompts/services_extract.md <chunk.txt> <output.json>
- bash scripts/batch-normalize-dataset-json.sh datasets/output/staging datasets/output/final datasets/sources/raw
- bash scripts/export-seed-artifacts.sh

Rules:
- prefer official domains
- use local files as the source of truth after fetch
- keep malformed model outputs in staging and fix through normalization or rerun
- if Ollama stalls, restart the service once and rerun the failed step
```
