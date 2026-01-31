#!/bin/bash
echo "Starting Task Manager (Backend + Frontend)..."
echo

echo "Starting Backend..."
(cd backend && npm run dev) &
sleep 3

echo "Starting Frontend..."
(cd frontend && npm run dev) &

echo
echo "Backend: http://localhost:5000"
echo "Frontend: http://localhost:5173"
echo
wait
