#!/bin/bash

# Task Manager - Stop Script
# This script stops the application

echo "Stopping Task Manager Application..."
echo ""

docker-compose down

if [ $? -eq 0 ]; then
    echo "Application stopped successfully!"
else
    echo "Failed to stop the application"
    exit 1
fi

