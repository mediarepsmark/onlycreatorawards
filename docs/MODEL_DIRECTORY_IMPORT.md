# OnlyCreatorAwards Model Directory Import

OnlyCreatorAwards imports the Traffichaus model directory into a local JSON cache so the live Next.js app can render model pages without rebuilding.

## Source

- Default URL: `https://syndication.traffichaus.com/adserve/index.php?z=960771`
- Cache file: `data/traffichaus-models.json`
- Manual section overrides: `data/model-section-overrides.json`
- Runtime reader: `lib/onlycreatorawards/modelDirectory.ts`

The importer preserves the source order from the JSON feed. Category pages can pin up to three model slugs manually, then fill the rest by clicks, views, popularity score, and source order.

## Run Manually

```bash
node scripts/sync-traffichaus-models.mjs --pretty
```

To test with a saved feed:

```bash
node scripts/sync-traffichaus-models.mjs --input=/path/to/feed.json --pretty
```

## Production Cron

Run once per day on the host:

```cron
17 3 * * * cd /home/httpd/html/onlycreatorawards.com/app && /usr/bin/docker run --rm --user "$(id -u):$(id -g)" -v "$PWD:/work" -w /work node:22-bookworm-slim node scripts/sync-traffichaus-models.mjs >> /home/codex_ssh/onlycreatorawards-model-import.log 2>&1
```

This uses Docker's Node image and writes into the host checkout. The app container mounts `./data:/app/data:ro` and reads the cache at request time.

## Manual Top 3 Overrides

Edit `data/model-section-overrides.json`:

```json
{
  "comment": "Manual top-three model overrides by section slug.",
  "sections": {
    "all": [],
    "fitness": ["creator-one", "creator-two", "creator-three"]
  }
}
```

Only the first three slugs are pinned. Missing or removed slugs are skipped.

## Admin Routes

- `/admin/models`
- `/admin/model-sections`
- `/admin/model-imports`
- `/admin/blog-posts`

## Public Routes

- `/models`
- `/model/[slug]`
- `/models/category/[slug]`
- `/blog`
- `/blog/[slug]`
- `/seo-ai-criteria`
