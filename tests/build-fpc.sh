#!/usr/bin/env sh
# Compila os testes do núcleo com Free Pascal (sem Lazarus) e, opcionalmente, roda com o
# servidor simulado:   sh tests/build-fpc.sh [saida] [--run]
set -e
here=$(cd "$(dirname "$0")" && pwd)
out=${1:-"$here/out"}
mkdir -p "$out"
fpc -Mdelphi -vw -gl \
  -Fu"$here/../source/core" -Fi"$here/../source/core" -Fu"$here" \
  -FU"$out" -FE"$out" \
  "$here/bfocus_tests.lpr"
cp "$here/scenarios.json" "$out/scenarios.json"
if [ "$2" = "--run" ]; then
  node "$here/run-tests.mjs" "$out/bfocus_tests"
fi
