# GitHub Setup

Repository:

`https://github.com/mediarepsmark/cpcadvertising`

## Branches

- `main`: production
- `dev`: staging

Deployments should initially run only from `main`.

## Required Secrets

Add these in GitHub under `Settings -> Secrets and variables -> Actions`:

- `SSH_HOST`
- `SSH_USER`
- `SSH_PASSWORD`
- `SSH_PORT`

Use Mojohost's provided SSH values for those secrets.

## First Push

The local repository is ready, but the first push needs GitHub write access for this repo.

```bash
git push -u origin main
git push -u origin dev
git push origin v0.1.0-mvp
```

If GitHub returns `403`, refresh the local GitHub credential or use a personal access token with repo write access.

## Production Environment

Keep this file on the server, not in Git:

`/home/dev_ssh/cpcadvertising/.env.local`

```bash
TRAFFICHAUS_ADVERTISER_API_KEY=
TRAFFICHAUS_STATS_API_KEY=
TRAFFICHAUS_API_BASE_URL=http://admin.traffichaus.com/api/v1
NEXT_PUBLIC_MOCK_TRAFFICHAUS=false
```
