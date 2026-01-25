#!/bin/bash
set -e

mkdir -p output

# Run Docker image to generate VS Code themes
docker run --rm \
  -e PATTERN=vscode \
  -v "$PWD/output:/src/output" \
  daylerees/rainglow:latest

# Backup old themes
mkdir -p ../themes_backup
mv ../themes/*.json ../themes_backup/ 2>/dev/null || true

# Copy new themes (adjusted)
cp -R output/* ../themes/

# Cleanup
rm -rf output
