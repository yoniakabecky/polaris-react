#!/usr/bin/env bash
shopt -s extglob
set -e

ls -l
mkdir ../tmp/polaris-react
mv ./build/* .
mv !(node_modules) ../tmp/polaris-react
mv ../tmp/polaris-react polaris-react
git clone ssh://git@github.com/Shopify/$1 --depth 1
ls -l
cd $1
ls -l
export BRANCH_NAME="polaris-react-$RANDOM-alpha"
git checkout -b $BRANCH_NAME
git branch | grep \* | cut -d ' ' -f2
yarn upgrade @shopify/polaris@next
git status
git add --all
git status
git commit -m 'upgrade to alpha test branch'
git status
git push origin HEAD
git status
