# OnlyCreatorAwards Docker Deployment

This app can run as a Dockerized Next.js 15 service with PostgreSQL.

## Local Smoke Test

1. Copy the Docker env template:

   ```bash
   cp .env.docker.example .env.docker
   ```

2. Build and start the stack:

   ```bash
   docker compose --env-file .env.docker up --build
   ```

3. Open:

   ```text
   http://localhost:3000
   ```

4. Health check:

   ```text
   http://localhost:3000/api/health
   ```

## Production VPS Setup

Recommended production shape:

- Docker Engine and Docker Compose plugin installed by the host.
- Nginx terminates SSL on the host and proxies to `127.0.0.1:3000`.
- `docker compose` runs the app and Postgres, or the app points at a managed Postgres instance.
- `.env.docker` is created on the server and never committed.

Minimum `.env.docker` production values:

```bash
APP_PORT=3000
NEXT_PUBLIC_SITE_URL=https://onlycreatorawards.com
POSTGRES_DB=onlycreatorawards
POSTGRES_USER=onlycreatorawards
POSTGRES_PASSWORD=<long-random-password>
DATABASE_URL=postgresql://onlycreatorawards:<long-random-password>@db:5432/onlycreatorawards
```

## Deploy Commands

From the app directory on the VPS:

```bash
git pull
docker compose build app
docker compose --env-file .env.docker up -d
docker compose ps
```

Rebuild the app image when `NEXT_PUBLIC_SITE_URL` changes because Next.js uses public environment values during the build.

## Nginx

A sample reverse-proxy config lives at:

```text
deploy/nginx/onlycreatorawards.conf
```

Install SSL with Certbot or have the managed host configure the certificate before enabling the HTTPS server block.

## Security Notes

- Do not copy deploy keys into the image.
- Do not commit `.env.docker`.
- Keep the database password unique to this app.
- Point a staging subdomain at the VPS first, verify the app, then switch production DNS.
