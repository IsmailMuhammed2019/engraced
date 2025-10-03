#!/bin/bash

echo "🛑 Stopping Engracedsmile Travel and Logistics System..."

# Stop all services
docker-compose down

echo "✅ All services stopped successfully!"
echo ""
echo "📊 To view logs: docker-compose logs -f"
echo "🚀 To start again: ./start.sh"
echo ""
