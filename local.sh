#!/bin/bash

set -a
source .env
set +a

export DATABASE_URL=${DATABASE_URL_LOCAL}

trap 'echo "stopping..."; npm run docker:stopdb; exit' SIGINT

npx prisma generate
npm run docker