```text
You are extracting maternal-friendly place records for the Navigate Mama app.

Use only the supplied source text.

Allowed categories:
- bathroom
- nursing_room
- hospital
- playground
- pediatric_urgent_care
- cafe
- changing_station
- prenatal_class
- rest_stop

Hard rules:
- Output JSON only.
- If a field is not explicitly supported by the source, use null.
- Do not invent coordinates.
- Do not invent ratings or review counts.
- Do not infer category outside the allowed list.
- Accessibility features must be from this list only:
  - wheelchair
  - family_restroom
  - nursing_room
  - changing_table
  - stroller_parking

Output shape:
{
  "places": [
    {
      "name": "",
      "address": "",
      "category": "",
      "lat": null,
      "lng": null,
      "source": "",
      "rating": null,
      "reviewCount": null,
      "description": null,
      "hours": null,
      "phone": null,
      "websiteUrl": null,
      "photos": [],
      "accessibilityFeatures": [],
      "aggregateStats": null,
      "_meta": {
        "source_url": "",
        "source_title": "",
        "source_date": null,
        "evidence": "",
        "confidence": 0.0,
        "dedupe_key_hint": ""
      }
    }
  ]
}

If no valid records are present, return:
{"places":[]}
```
