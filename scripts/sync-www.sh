#!/usr/bin/env bash
# Copy the site into www/ for Capacitor. Does not copy native projects or secrets.
set -euo pipefail
cd "$(dirname "$0")/.."
rm -rf www
mkdir -p www
tar \
  --exclude=www \
  --exclude=node_modules \
  --exclude=android \
  --exclude=ios \
  --exclude=.git \
  --exclude=store \
  --exclude=scripts \
  --exclude=assets \
  -cf - \
  index.html app.js styles.css pwa.js sw.js manifest.webmanifest \
  privacy.html for-parents.html FOR-PARENTS.md version.json README.md \
  lib fonts icons art \
  | tar -C www -xf -
echo "Copied the site into www/"
