#!/bin/bash

echo "🚀 Starting Engraced Smile Services..."

# Ensure we're in the right directory
cd /root/engraced

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo "❌ .env file not found!"
    echo "Please create a .env file based on .env.example"
    exit 1
fi

# Load environment variables
export $(cat .env | grep -v '^#' | xargs)

# Start services
echo "📦 Starting Docker services..."
docker-compose down
docker-compose up --build -d

echo "✅ Services started successfully!"
echo "🌐 Frontend: http://localhost:3001"
echo "🔧 Admin Portal: http://localhost:3002" 
echo "⚙️  Backend API: http://localhost:3003"
