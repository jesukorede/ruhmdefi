#!/usr/bin/env bash
set -e
npx prisma migrate deploy
exec node dist/index.js