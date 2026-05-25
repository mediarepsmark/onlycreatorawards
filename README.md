# CPCAdvertising.com Campaign Setup

Next.js campaign setup module for creating TrafficHaus advertiser campaigns and loading advertiser stats without exposing the TrafficHaus API key in the browser.

## Production

- Domain: `app.cpcadvertising.com`
- Server: `srv6329.mjhst.com`
- Node: `22.22.2`
- npm: `10.9.7`
- PM2: `7.0.1`
- App port: `3000`
- Proxy target: `127.0.0.1:3000`
- Deployment path: `/home/dev_ssh/cpcadvertising`
- Production branch: `main`

## Environment

```bash
TRAFFICHAUS_ADVERTISER_API_KEY=
TRAFFICHAUS_STATS_API_KEY=
TRAFFICHAUS_API_BASE_URL=http://admin.traffichaus.com/api/v1
NEXT_PUBLIC_MOCK_TRAFFICHAUS=true
```

Mock mode is on by default. On production, set `NEXT_PUBLIC_MOCK_TRAFFICHAUS=false` in `/home/dev_ssh/cpcadvertising/.env.local`.

- `TRAFFICHAUS_ADVERTISER_API_KEY` is required for live campaign creation.
- `TRAFFICHAUS_STATS_API_KEY` can be a publisher/stats-capable key for stats lookups only.

## Run locally

```bash
npm run dev
```

Open `http://127.0.0.1:3000/campaigns/new`.

## Deploy Manually

From `/home/dev_ssh/cpcadvertising` on the server:

```bash
git pull origin main
npm install
npm run build
pm2 delete cpcadvertising-app 2>/dev/null || true
pm2 start npm --name cpcadvertising-app -- start
pm2 save
pm2 startup
```

The app should be proxied by the host from `app.cpcadvertising.com` to `http://127.0.0.1:3000`.

## GitHub Actions Deployment

The workflow in `.github/workflows/deploy.yml` deploys only from `main`.

Add these GitHub repository secrets:

- `SSH_HOST`
- `SSH_USER`
- `SSH_PASSWORD`
- `SSH_PORT`

See [GitHub setup](docs/GITHUB_SETUP.md) and [Mojohost deployment runbook](docs/MOJOHOST_DEPLOYMENT.md) for the full production workflow.

## API routes

- `POST /api/traffichaus/create-campaign`
- `GET /api/traffichaus/stats?start_date=YYYY-MM-DD&end_date=YYYY-MM-DD&campaigns=123&group_by=campaign,date&format=1`

All TrafficHaus API calls are made through server-side Next.js route handlers under `/app/api/traffichaus/*`; the TrafficHaus API key is never exposed browser-side.
