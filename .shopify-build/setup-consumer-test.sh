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

yarn upgrade @shopify/polaris@next
./../polaris-react/.shopify-build/create-branch
