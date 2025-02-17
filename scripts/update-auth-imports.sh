#!/bin/bash

# Find all TypeScript files in the api directory
find src/app/api -name "*.ts" -type f -exec sed -i '' \
  's|from '\''../../auth/\[...nextauth\]/route'\''|from '\''@/lib/auth'\''|g; s|from '\''../auth/\[...nextauth\]/route'\''|from '\''@/lib/auth'\''|g' {} +
