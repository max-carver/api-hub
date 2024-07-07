#!/usr/bin/env bash
# Exit on error
set -o errexit

# Install dependencies
npm run postinstall

# Build client
npm run build