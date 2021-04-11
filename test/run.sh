#!/bin/bash
set -eu

cd $(dirname $0);

function check() {
  dir="$1"
  if [[ -d "$dir" ]]; then
    rm -rf $dir
    return 0
  fi
  return 1
}

# clean
echo "Run - clear directory"
dirs=$(find . -type d -depth 1)
for dir in $dirs; do
  rm -rf $dir
done

# case1
echo "Run - create-acot-preset foo"
node ../lib/bin.js foo
check acot-preset-foo

# case2
echo "Run - create-acot-preset @scoped/bar"
node ../lib/bin.js "@scoped/bar"
check acot-preset-bar
