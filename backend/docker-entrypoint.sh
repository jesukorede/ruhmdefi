#!/usr/bin/env bash
set -e
if [ -n "$DATABASE_URL" ]; then
  echo "Running Prisma migrations..."
  npx prisma migrate deploy || echo "Prisma migrations failed; continuing to start server"
else
  echo "DATABASE_URL not set; skipping Prisma migrations"
fi

node dist/index.js