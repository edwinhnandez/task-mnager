#!/bin/bash

# Task Manager - Quick Start Script
# This script starts the application using Docker Compose

echo "Starting Task Manager Application..."
echo ""

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "Docker is not installed. Please install Docker Desktop first."
    echo "   Download from: https://www.docker.com/products/docker-desktop"
    exit 1
fi

# Check if Docker is running
if ! docker info &> /dev/null; then
    echo "Docker is not running. Please start Docker Desktop."
    exit 1
fi

echo "Docker is installed and running"
echo ""

# Build and start containers
echo "Building and starting containers..."
docker-compose up --build -d

if [ $? -eq 0 ]; then
    echo ""
    echo "Application started successfully!"
    echo ""
    echo "Access the application at:"
    echo "   Frontend: http://localhost:8080"
    echo "   Backend API: http://localhost:3000"
    echo ""
    echo "View logs with: docker-compose logs -f"
    echo "Stop with: docker-compose down"
    echo ""
else
    echo ""
    echo "Failed to start the application"
    exit 1
fi

