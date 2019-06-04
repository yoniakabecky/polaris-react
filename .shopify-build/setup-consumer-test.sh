#!/usr/bin/env bash
shopt -s extglob
set -e

ls -la
mkdir ../tmp/polaris-react
mv ./build/* .
mv !(node_modules) ../tmp/polaris-react
mv ../tmp/polaris-react polaris-react
git clone ssh://git@github.com/Shopify/$1 --depth 1
ls -la
cd $1
ls -la

yarn upgrade @shopify/polaris@next
pwd
./../.shopify-build/create-branch
