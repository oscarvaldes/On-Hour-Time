#!/usr/bin/env bash

set -e
if [ -d "dist" ]; then
  rm -r ./dist
fi
yarn config set "strict-ssl" false
yarn install
node node_modules/node-sass/scripts/install.js
yarn build
yarn start