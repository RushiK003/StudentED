#!/bin/bash

echo "Starting Student Empower Platform..."

# Start Backend
echo "Starting Backend on port 5000..."
cd backend
if [ ! -d "node_modules" ]; then
  npm install
fi
npm run dev &
BACKEND_PID=$!

# Start Frontend
echo "Starting Frontend..."
cd ../frontend
if [ ! -d "node_modules" ]; then
  npm install
fi
npm run dev &
FRONTEND_PID=$!

# Trap Ctrl+C to kill both processes
trap "kill $BACKEND_PID $FRONTEND_PID; exit" SIGINT

wait
