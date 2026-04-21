# Navigate Dataset Pack

Small-model dataset pack for `Navigate Mama`.

## Purpose

Build source-grounded local datasets for:

- maternal-friendly places
- maternal and family support services

The existing app already consumes `Place` and `Service` shaped data, so this pack mirrors those structures while keeping source metadata for auditing.

## Recommended Scope

Start with one metro area at a time.

Good first pass:

- hospitals
- pediatric urgent care
- nursing rooms
- changing stations
- playgrounds
- prenatal classes
- pediatricians
- lactation consultants
- therapists focused on perinatal care
- exercise programs for pregnancy and postpartum
- doulas and postpartum support
- babysitting and sleep consultants

## Workflow

1. Save source text into `sources/raw/`.
2. Chunk it into small files under `sources/chunks/`.
3. Run the relevant extraction prompt.
4. Merge duplicates by name + address + website.
5. Export final arrays for app seeding under `output/final/`.

## Suggested Sources

- hospital and clinic directory pages
- pediatric practice pages
- doula and lactation provider sites
- city park and museum pages
- mall, transit, and public facility pages with family amenities

## Low-Cost Model Guidance

- Extract one entity type per run.
- Keep prompts narrow.
- Do not ask the model to rank providers.
- Treat ratings and review counts as optional unless directly sourced.

## Main Files

- `prompts/places_extract.md`
- `prompts/services_extract.md`
- `schemas/place_record.schema.json`
- `schemas/service_record.schema.json`

## Runner

Use the local runner script from the repo root:

```bash
bash scripts/run-local-dataset.sh gemma4:e2b datasets/prompts/places_extract.md datasets/sources/chunks/example-place-source.txt datasets/output/staging/example-place.json
```

Batch-run every chunk file in a directory:

```bash
bash scripts/batch-local-dataset.sh gemma4:e2b datasets/prompts/places_extract.md datasets/sources/chunks datasets/output/staging
```

Validate generated JSON files:

```bash
bash scripts/validate-dataset-json.sh datasets/output/staging
```

Normalize staging outputs into app-shaped final outputs:

```bash
bash scripts/batch-normalize-dataset-json.sh datasets/output/staging datasets/output/final
bash scripts/validate-dataset-json.sh datasets/output/final
```

Export final outputs into seed-ready artifacts:

```bash
bash scripts/export-seed-artifacts.sh
```

End-to-end ingestion:

```bash
bash scripts/run-agent-ingestion.sh datasets/manifests/source-discovery.denver.json qwen2.5:1.5b
```
