#!/bin/bash

echo "🚀 Starting Engracedsmile Travel and Logistics System..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker first."
    exit 1
fi

# Create .env files if they don't exist
if [ ! -f backend/.env ]; then
    echo "📝 Creating backend .env file..."
    cp backend/env.example backend/.env
fi

# Start the services
echo "🐳 Starting Docker containers..."
docker-compose up --build -d

# Wait for services to be ready
echo "⏳ Waiting for services to start..."
sleep 10

# Check if services are running
echo "🔍 Checking service status..."

# Check PostgreSQL
if docker-compose exec -T postgres pg_isready -U engracedsmile > /dev/null 2>&1; then
    echo "✅ PostgreSQL is ready"
else
    echo "❌ PostgreSQL is not ready"
fi

# Check Redis
if docker-compose exec -T redis redis-cli ping > /dev/null 2>&1; then
    echo "✅ Redis is ready"
else
    echo "❌ Redis is not ready"
fi

# Check Backend
if curl -f http://localhost:3003/api/v1/system/stats > /dev/null 2>&1; then
    echo "✅ Backend API is ready"
else
    echo "⏳ Backend API is starting up..."
fi

# Run database migrations and seed
echo "🗄️ Setting up database..."
sleep 10  # Wait for backend to be ready
if docker-compose exec -T backend npx prisma migrate deploy; then
    echo "✅ Database migrations completed"
    if docker-compose exec -T backend npx prisma db seed; then
        echo "✅ Database seeded successfully"
    else
        echo "⚠️ Database seeding failed (may already be seeded)"
    fi
else
    echo "⚠️ Database migrations failed (database may not be ready yet)"
    echo "   You can run migrations manually later with:"
    echo "   docker-compose exec backend npx prisma migrate deploy"
fi

echo ""
echo "🎉 Engracedsmile System is ready!"
echo ""
echo "📱 Access your applications:"
echo "   • Frontend (Customer Portal): http://localhost:3001"
echo "   • Admin Portal:              http://localhost:3002"
echo "   • Backend API:               http://localhost:3003"
echo "   • API Documentation:         http://localhost:3003/api/docs"
echo ""
echo "🔐 Default Admin Credentials:"
echo "   • Email:    admin@engracedsmile.com"
echo "   • Password: admin123"
echo ""
echo "📊 To view logs: docker-compose logs -f"
echo "🛑 To stop:     docker-compose down"
echo ""
