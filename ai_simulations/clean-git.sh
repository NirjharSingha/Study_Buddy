#!/bin/bash

# Clean up Git cache
git rm -r --cached .

# Remove build artifacts
rm -rf .next
rm -rf node_modules
rm -rf dist
rm -rf build

# Clean npm cache
npm cache clean --force

# Reinstall dependencies
npm install

# Add files back to Git
git add .

# Create a new commit
git commit -m "Optimize repository and clean up cache"

echo "Repository cleaned and optimized!" 