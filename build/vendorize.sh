#!/bin/bash
set -e

git reset --hard HEAD~1
git rebase master
make clean
make init
make vendorize
npm ci
echo '!/node_modules' >> .gitignore
echo '!vbh/.build-harness-bootstrap' >> .gitignore
echo '!vbh/build-harness' >> .gitignore
echo '!vbh/build-harness-extensions' >> .gitignore
git add -A
git commit -m "vendorize"
git push --force