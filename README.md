# JobBoard Pro — Backend (Node.js + TypeScript + Express + MongoDB)

[![CI](https://github.com/Ahmad-Seirafi/jobboard-pro-backend/actions/workflows/backend-ci.yml/badge.svg)](https://github.com/Ahmad-Seirafi/jobboard-pro-backend/actions/workflows/backend-ci.yml)

Production-grade REST API for a job board platform.

**Highlights**
- Authentication with **JWT Access/Refresh** (refresh rotation + revoke)
- **RBAC** roles: `user`, `employer`
- Core entities: **Users, Companies, Jobs, Applications, Saved Jobs**
- Validation via **Zod**
- File uploads (resumes) via **Multer**
- OpenAPI documentation via **Swagger** at `/docs`
- Testing: **Jest + Supertest + mongodb-memory-server** (no external Mongo needed in CI)
- Strict TypeScript (NodeNext) and clean structure

---

## Table of Contents
- [Quick Start](#quick-start)
- [Scripts](#scripts)
- [Environment](#environment)
- [API (High-level)](#api-high-level)
- [Project Structure](#project-structure)
- [Testing](#testing)
- [Seeding & Index Sync](#seeding--index-sync)
- [Docker](#docker)
- [CI (GitHub Actions)](#ci-github-actions)
- [Troubleshooting Cheatsheet](#troubleshooting-cheatsheet)
- [License](#license)

---

## Quick Start

```bash
cp .env.example .env
npm install
npm run build
npm start
# Health:  http://127.0.0.1:4000/health
# Swagger: http://127.0.0.1:4000/docs
