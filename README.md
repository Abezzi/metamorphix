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

# Setup

## Pre Requisites

- Docker
- Docker Compose plugin

## Installation

clone the repository

```bash
git clone https://github.com/Abezzi/metamorphix.git
cd metamorphix
```

start docker

```bash
systemctl start docker
```

run docker (in the project directory)

```bash
docker-compose up -d --build
```

this command builds 3 images, 1 network and 5 containers:

```bash
 ✔ Image metamorphix-api          Built                                                                                                                                                                                                                   1.2s
 ✔ Image metamorphix-worker       Built                                                                                                                                                                                                                   1.2s
 ✔ Image metamorphix-frontend     Built                                                                                                                                                                                                                  63.7s

 ✔ Network metamorphix_default    Created                                                                                                                                                                                                                 0.1s

 ✔ Container metamorphix-redis    Started                                                                                                                                                                                                                 3.5s
 ✔ Container metamorphix-postgres Started                                                                                                                                                                                                                 3.5s
 ✔ Container metamorphix-worker   Started                                                                                                                                                                                                                 3.6s
 ✔ Container metamorphix-api      Started                                                                                                                                                                                                                 3.6s
 ✔ Container metamorphix-frontend Started
```

you can check the logs of the servers running in the background by typing any of this commands in your terminal:

```bash
docker-compose logs api
docker-compose logs frontend
docker-compose logs worker
docker-compose logs redis
docker-compose logs postgres
```

you can also execute SQL commands directly into the postgres container by running:

```bash
docker compose exec postgres psql -U postgres -d metamorphix
```

### NOTE: If migrations don't work

you probably deleted the migrations folder or the schema doesn't exist, so please recreate it and run docker compose again.

```bash
docker docker compose exec postgres psql -U postgres -d metamorphix
# now inside metamorphix postgres database inside the container
CREATE SCHEMA drizzle;

# now you can exit and run the docker-compose command again
docker-compose up -d --build
```

## API Documentation

The Metamorphix API is built with Express.js and follows a RESTful design. All protected routes require authentication via JWT (Bearer token).

**Base URL**: `http://localhost:3000/api`

### Authentication Routes (api/auth)

| Method | Endpoint  | Description                   | Auth Required |
| ------ | --------- | ----------------------------- | ------------- |
| POST   | /sign-up  | Register a new user           | No            |
| POST   | /sign-in  | Login and receive JWT         | No            |
| POST   | /sign-out | Logout (revoke current token) | Yes           |
| POST   | /refresh  | Refresh access token          | Yes           |
| POST   | /revoke   | Revoke a refresh token        | Yes           |
| PUT    | /profile  | Update user profile           | Yes           |

### Pipelines (api/pipelines)

| Method | Endpoint             | Description             | Auth Required |
| ------ | -------------------- | ----------------------- | ------------- |
| POST   | /                    | Create a new pipeline   | Yes           |
| GET    | /                    | List user's pipelines   | Yes           |
| GET    | /pipelines-statistic | get pipeline statistics | Yes           |
| GET    | /:id                 | Get pipeline by ID      | Yes           |
| PATCH  | /:id                 | Update pipeline         | Yes           |
| DELETE | /:id                 | Delete pipeline         | Yes           |

### Subscribers (api/subscribers)

| Method | Endpoint | Description             | Auth Required |
| ------ | -------- | ----------------------- | ------------- |
| POST   | /        | Create a new subscriber | Yes           |
| GET    | /        | List user's subscribers | Yes           |
| GET    | /:id     | Get subscriber by ID    | Yes           |
| PATCH  | /:id     | Update subscriber       | Yes           |
| DELETE | /:id     | Delete subscriber       | Yes           |

### Webhook (Public Ingestion)

| Method | Endpoint            | Description                                 | Auth Required |
| ------ | ------------------- | ------------------------------------------- | ------------- |
| POST   | /webhook/:sourceUrl | Ingest webhook -> queues job for processing | No            |

> [!NOTE]
> The :sourceUrl is the unique URL generated when creating a pipeline.

### Jobs (/api/jobs)

| Method | Endpoint | Description          | Auth Required |
| ------ | -------- | -------------------- | ------------- |
| GET    | /        | List user's jobs     | Yes           |
| GET    | /:id     | Get job detail by id | Yes           |

### Delivery Attempts (/api/delivery-attempts)

| Method | Endpoint | Description                | Auth Required |
| ------ | -------- | -------------------------- | ------------- |
| GET    | /        | List delivery attempts     | Yes           |
| GET    | /:id     | Get delivery attempt by id | Yes           |

### Healthcheck (for testing purpose)

| Method | Endpoint | Description | Auth Required |
| ------ | -------- | ----------- | ------------- |
| GET    | /ready   | Returns OK  | No            |

### Request/Response Examples

Create pipeline:

```json
POST /api/pipelines
{
  "name": "Lead Processing",
  "description": "Process new leads from Typeform",
  "actionType": "transform",
  "actionConfig": {
    "mapping": { "fullName": "name.first + ' ' + name.last" }
  },
  "subscribersIds": ["uuid1", "uuid2"]
}
```

trigger webhook:

```bash
curl -X POST http://localhost:3000/api/webhooks/your-unique-source-url \
  -H "Content-Type: application/json" \
  -d '{"event": "new_lead", "data": {...}}'
```

### Authentication

- Most endpoints require Authorization: Bearer <jwt-token>

## Architecture

## Design Decisions
