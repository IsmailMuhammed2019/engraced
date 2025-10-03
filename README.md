# Engracedsmile Travel and Logistics System

A comprehensive travel and logistics management system with customer portal, admin panel, and backend API.

## 🏗️ System Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Admin Portal  │    │   Backend API   │
│   (Port 3001)   │    │   (Port 3002)   │    │   (Port 3003)   │
│                 │    │                 │    │                 │
│ • Customer UI   │    │ • Admin UI      │    │ • NestJS API    │
│ • Route Search  │    │ • Route Mgmt    │    │ • Authentication│
│ • Booking       │    │ • Booking Mgmt  │    │ • Database      │
│ • User Profile  │    │ • Analytics     │    │ • Redis Cache   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                    ┌─────────────────┐
                    │   PostgreSQL    │
                    │   (Port 5432)   │
                    │                 │
                    │ • User Data     │
                    │ • Routes        │
                    │ • Bookings      │
                    │ • Analytics     │
                    └─────────────────┘
                                 │
                    ┌─────────────────┐
                    │     Redis       │
                    │   (Port 6379)   │
                    │                 │
                    │ • Session Cache │
                    │ • Rate Limiting │
                    │ • Temp Data     │
                    └─────────────────┘
```

## 🚀 Quick Start

### Prerequisites
- Docker and Docker Compose
- Node.js 18+ (for development)
- Git

### 1. Clone the Repository
```bash
git clone <repository-url>
cd engracedsmile
```

### 2. Start the System
```bash
# Start all services
docker-compose up --build -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down
```

### 3. Access the Applications
- **Frontend (Customer Portal)**: http://localhost:3001
- **Admin Portal**: http://localhost:3002
- **Backend API**: http://localhost:3003
- **API Documentation**: http://localhost:3003/api/docs

## 📁 Project Structure

```
engracedsmile/
├── frontend/                 # Customer-facing Next.js app
│   ├── src/
│   │   ├── app/             # App Router pages
│   │   ├── components/      # React components
│   │   └── lib/            # Utilities
│   └── package.json
├── admin-portal/            # Admin dashboard
│   ├── src/
│   │   ├── app/             # Admin pages
│   │   ├── components/      # Admin components
│   │   ├── stores/          # Zustand stores
│   │   └── lib/            # Admin utilities
│   └── package.json
├── backend/                 # NestJS API
│   ├── src/
│   │   ├── auth/           # Authentication
│   │   ├── routes/         # Route management
│   │   ├── trips/          # Trip management
│   │   ├── bookings/       # Booking management
│   │   ├── users/          # User management
│   │   ├── admins/         # Admin management
│   │   └── prisma/         # Database service
│   ├── prisma/             # Database schema
│   └── package.json
└── docker-compose.yml       # Container orchestration
```

## 🛠️ Technology Stack

### Frontend (Customer Portal)
- **Framework**: Next.js 15 with App Router
- **Styling**: Tailwind CSS + shadcn/ui
- **UI Components**: Radix UI primitives
- **State Management**: Zustand
- **HTTP Client**: Axios
- **Icons**: Lucide React

### Admin Portal
- **Framework**: Next.js 15 with App Router
- **Styling**: Tailwind CSS + shadcn/ui
- **UI Components**: Radix UI primitives
- **State Management**: Zustand + Jotai
- **HTTP Client**: Axios
- **Forms**: React Hook Form + Zod
- **Charts**: Recharts

### Backend API
- **Framework**: NestJS
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT with Passport
- **Documentation**: Swagger/OpenAPI
- **Validation**: Class Validator
- **Caching**: Redis
- **Security**: Helmet, CORS, Rate Limiting

### Infrastructure
- **Containerization**: Docker & Docker Compose
- **Database**: PostgreSQL 15
- **Cache**: Redis 7
- **Reverse Proxy**: Nginx (optional)

## 🗄️ Database Schema

### Core Entities
- **Users**: Customer accounts
- **Admins**: Administrative users
- **Routes**: Travel routes between cities
- **Trips**: Specific journey instances
- **Bookings**: Customer reservations
- **Reviews**: Customer feedback

### Key Relationships
- Routes have many Trips
- Trips have many Bookings
- Users have many Bookings
- Admins manage Routes

## 🔐 Authentication & Authorization

### User Roles
- **CUSTOMER**: Regular users who can book trips
- **ADMIN**: Can manage routes, trips, and bookings
- **SUPER_ADMIN**: Can manage other admins and system settings

### Security Features
- JWT-based authentication
- Role-based access control
- Rate limiting
- Input validation
- SQL injection prevention
- CORS protection

## 📊 Admin Portal Features

### Dashboard
- System statistics
- Recent bookings
- Revenue analytics
- Route performance

### Route Management
- Create/edit routes
- Set pricing and schedules
- Manage amenities
- View route statistics

### Trip Management
- Create/edit trips
- Set departure times
- Manage seat availability
- Update trip status

### Booking Management
- View all bookings
- Filter and search
- Update booking status
- Handle cancellations

### User Management
- View customer accounts
- Manage user roles
- Handle support requests

## 🎨 UI/UX Features

### Customer Portal
- Responsive design
- Modern, clean interface
- Route search and filtering
- Easy booking process
- Booking management
- Contact forms

### Admin Portal
- Dark/light theme support
- Responsive dashboard
- Data tables with sorting/filtering
- Charts and analytics
- Form validation
- Toast notifications

## 🔧 Development

### Local Development Setup
```bash
# Install dependencies
cd frontend && npm install
cd ../admin-portal && npm install
cd ../backend && npm install

# Start development servers
# Terminal 1 - Backend
cd backend && npm run start:dev

# Terminal 2 - Frontend
cd frontend && npm run dev

# Terminal 3 - Admin Portal
cd admin-portal && npm run dev

# Terminal 4 - Database (if not using Docker)
docker-compose up postgres redis -d
```

### Environment Variables
Copy the example files and configure:
```bash
# Backend
cp backend/env.example backend/.env

# Frontend
cp frontend/.env.example frontend/.env.local

# Admin Portal
cp admin-portal/.env.example admin-portal/.env.local
```

### Database Management
```bash
# Generate Prisma client
cd backend && npx prisma generate

# Run migrations
cd backend && npx prisma migrate dev

# View database
cd backend && npx prisma studio
```

## 🚀 Deployment

### Production Deployment
```bash
# Build and start production containers
docker-compose -f docker-compose.prod.yml up --build -d

# View production logs
docker-compose logs -f

# Scale services
docker-compose up --scale backend=3 -d
```

### Environment Configuration
- Set production environment variables
- Configure SSL certificates
- Set up monitoring and logging
- Configure backup strategies

## 📈 Monitoring & Analytics

### Built-in Analytics
- Booking trends
- Route popularity
- Revenue tracking
- User engagement

### Health Checks
- API health endpoints
- Database connectivity
- Redis connectivity
- Service status

## 🔒 Security Considerations

### Data Protection
- Encrypted passwords (bcrypt)
- JWT token security
- Input sanitization
- SQL injection prevention

### Network Security
- CORS configuration
- Rate limiting
- Request validation
- HTTPS enforcement

## 🧪 Testing

### Running Tests
```bash
# Backend tests
cd backend && npm run test

# Frontend tests
cd frontend && npm run test

# E2E tests
npm run test:e2e
```

## 📝 API Documentation

The API documentation is automatically generated and available at:
- **Development**: http://localhost:3003/api/docs
- **Production**: https://your-domain.com/api/docs

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is proprietary software for Engracedsmile Travel and Logistics.

## 📞 Support

For technical support or questions:
- Email: info@engracedsmile.com
- Phone: +2348071116229
- Address: 38 Urubi Street, Benin City

---

**Engracedsmile Travel and Logistics** - Your trusted partner for comfortable and safe travel across Nigeria.
