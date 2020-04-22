#!/bin/bash
set -e

git reset --hard HEAD~1
git rebase master
make clean
make init
make vendorize
npm ci
echo '\n!/node_modules \n!vbh/.build-harness-bootstrap\n!vbh/build-harness\n!vbh/build-harness-extensions' >> .gitignore
git add -A
git commit -m "vendorize"
# git push --force