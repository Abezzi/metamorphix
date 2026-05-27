<div align="center">
  <h2>Metamorphix</h2>
  <h3>Webhook-Driven Task Processing Pipeline</h3>
</div>

<div align="center">
  <img src="https://skillicons.dev/icons?i=ts" height="40" alt="typescript logo"  />
  <img width="12" />
  <img src="https://skillicons.dev/icons?i=react" height="40" alt="react logo"  />
  <img width="12" />
  <img src="https://skillicons.dev/icons?i=tailwind" height="40" alt="tailwindcss logo"  />
  <img width="12" />
  <img src="https://skillicons.dev/icons?i=docker" height="40" alt="docker logo"  />
  <img width="12" />
  <img src="https://skillicons.dev/icons?i=postgres" height="40" alt="postgresql logo"  />
  <img width="12" />
  <img src="https://skillicons.dev/icons?i=githubactions" height="40" alt="github actions logo"  />
  <img width="12" />
  <img src="https://skillicons.dev/icons?i=vitest" height="40" alt="vitest logo"  />
  <img width="12" />
  <img src="https://skillicons.dev/icons?i=linux" height="40" alt="linux logo"  />
  <img width="12" />
</div>

![Backend Tests Status](https://github.com/Abezzi/metamorphix/actions/workflows/backend-ci.yml/badge.svg)

![Frontend Tests Status](https://github.com/Abezzi/metamorphix/actions/workflows/frontend-ci.yml/badge.svg)

# Pre Requisites

- Docker
- Docker Compose plugin

# Installation

clone the repository

```bash
git clone https://github.com/Abezzi/metamorphix.git
cd metamorphix
```

run docker

```bash
docker-compose up -d --build
```

### If migrations don't work

you probably deleted the migrations folder or the schema doesn't exist

```bash
docker-compose up -d --build
docker docker compose exec postgres psql -U postgres -d metamorphix
# inside metamorphix psql
CREATE SCHEMA drizzle;
```
