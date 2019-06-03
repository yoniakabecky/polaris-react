#!/usr/bin/env bash
shopt -s extglob
set -e

echo "@shopify:registry=https://packages.shopify.io/shopify/node/npm/" > '.npmrc'
