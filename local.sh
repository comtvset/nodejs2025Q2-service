#!/bin/bash

trap 'echo "stopping..."; npm run docker:stopdb; exit' SIGINT

npx prisma generate
npm run docker