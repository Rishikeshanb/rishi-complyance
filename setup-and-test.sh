#!/bin/bash

echo "========================================"
echo "  ROI Simulator - Quick Deploy Setup"
echo "========================================"
echo

echo "[1/4] Installing backend dependencies..."
npm install
if [ $? -ne 0 ]; then
    echo "ERROR: Failed to install backend dependencies"
    exit 1
fi

echo "[2/4] Installing frontend dependencies..."
cd client
npm install
if [ $? -ne 0 ]; then
    echo "ERROR: Failed to install frontend dependencies"
    exit 1
fi

echo "[3/4] Building frontend for production..."
npm run build
if [ $? -ne 0 ]; then
    echo "ERROR: Failed to build frontend"
    exit 1
fi

cd ..

echo "[4/4] Testing server startup..."
echo "Starting server on http://localhost:3001"
echo "Press Ctrl+C to stop the server when ready to deploy"

npm start