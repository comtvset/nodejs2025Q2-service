#!/bin/bash

trap 'echo "stopping..."; npm run docker:stopdb; exit' SIGINT

npm run build
npm run docker:build