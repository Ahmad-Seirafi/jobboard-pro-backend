# JobBoard Pro (v2) — Backend (Node.js 22 + TypeScript)

Enterprise-grade API for job boards with Auth (JWT + refresh rotation), Companies, Jobs, Applications (CV upload), Saved Jobs, Admin stats, Swagger, Tests, Docker.

## Quick Start
```bash
cp .env.example .env
npm install
npm run dev
# or
npm run build && npm start
```

## Docker
```bash
docker compose up --build -d
```

## Swagger
Open http://localhost:4000/docs

## Scripts
- `npm run seed` — create employer + company sample
- `npm run sync-indexes` — rebuild job indexes

## Tests
```bash
npm test
```

Tech: Express, TypeScript (NodeNext ESM), Mongoose, Zod, Multer, JWT, Jest, Supertest, mongodb-memory-server.
