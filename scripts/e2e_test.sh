#!/usr/bin/env bash

set -e
yarn start &
sleep 20
yarn run e2e
kill `ps -u $USER | grep " node " | grep -v "grep"|awk '{print $2}'`
