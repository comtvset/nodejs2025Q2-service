#!/bin/bash

trap 'echo "stopping..."; npm run docker:stopdb; exit' SIGINT

npm run docker