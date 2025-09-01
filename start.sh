#!/bin/bash

echo "Starting Task Manager Application..."
echo

echo "Starting Backend Server..."
gnome-terminal --title="Backend Server" -- bash -c "npm run dev; exec bash" &

echo "Waiting for backend to start..."
sleep 3

echo "Starting Frontend Server..."
gnome-terminal --title="Frontend Server" -- bash -c "cd frontend && npm start; exec bash" &

echo
echo "Application is starting..."
echo "Backend: http://localhost:5000"
echo "Frontend: http://localhost:8000"
echo
echo "Press Ctrl+C to stop all servers"
echo

# Wait for user to stop
wait
