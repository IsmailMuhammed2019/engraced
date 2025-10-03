# InterState Transport - Modern Next.js Application

A modern, responsive interstate transport booking website built with Next.js 15, TypeScript, Tailwind CSS, and shadcn/ui components.

## 🚀 Features

- **Modern UI/UX** with smooth animations using Framer Motion
- **Responsive Design** that works on all devices
- **Interactive Components** built with shadcn/ui and Radix UI
- **Image Slider** with auto-play and navigation controls
- **Booking Form** with validation and city selection
- **Popular Routes** display with ratings and pricing
- **Promotions Section** with special offers
- **Docker Support** for easy deployment

## 🛠️ Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Components**: shadcn/ui + Radix UI
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Containerization**: Docker & Docker Compose

## 📦 Quick Start

### Using Docker (Recommended)

#### Development Mode
```bash
# Build and run in development mode
npm run docker:dev

# Or manually with docker-compose
docker-compose -f docker-compose.dev.yml up --build
```

#### Production Mode
```bash
# Build and run in production mode
npm run docker:build
npm run docker:up

# Or manually with docker-compose
docker-compose up --build -d
```

#### With Nginx Reverse Proxy (Production)
```bash
# Run with Nginx reverse proxy
npm run docker:prod
```

### Local Development (Without Docker)

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
npm start
```

## 🐳 Docker Commands

| Command | Description |
|---------|-------------|
| `npm run docker:build` | Build Docker images |
| `npm run docker:up` | Start containers in detached mode |
| `npm run docker:down` | Stop and remove containers |
| `npm run docker:logs` | View container logs |
| `npm run docker:dev` | Run in development mode |
| `npm run docker:prod` | Run with production profile |
| `npm run docker:clean` | Clean up containers and images |

## 🌐 Accessing the Application

- **Local Development**: http://localhost:3000
- **Docker Development**: http://localhost:3000
- **Docker Production**: http://localhost:80 (with Nginx)

## 📁 Project Structure

```
interstate-transport/
├── src/
│   ├── app/
│   │   ├── api/health/          # Health check endpoint
│   │   ├── globals.css          # Global styles
│   │   ├── layout.tsx           # Root layout
│   │   └── page.tsx             # Home page
│   ├── components/
│   │   ├── ui/                  # shadcn/ui components
│   │   ├── Header.tsx           # Navigation header
│   │   ├── Footer.tsx           # Site footer
│   │   ├── Hero.tsx             # Hero slider section
│   │   ├── BookingForm.tsx      # Booking form component
│   │   ├── Features.tsx         # Features section
│   │   ├── PopularRoutes.tsx    # Routes display
│   │   └── Promotions.tsx       # Promotions section
│   └── lib/
│       └── utils.ts             # Utility functions
├── public/                      # Static assets
├── Dockerfile                   # Production Docker image
├── Dockerfile.dev               # Development Docker image
├── docker-compose.yml           # Production compose file
├── docker-compose.dev.yml       # Development compose file
├── .dockerignore               # Docker ignore file
└── next.config.ts              # Next.js configuration
```

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file for local development:

```env
NEXT_TELEMETRY_DISABLED=1
```

### Docker Configuration

The application includes two Docker setups:

1. **Development**: Uses `docker-compose.dev.yml` with hot reloading
2. **Production**: Uses `docker-compose.yml` with optimized build

### Next.js Configuration

The app is configured for:
- **Standalone output** for Docker deployment
- **Image optimization** for Unsplash images
- **Telemetry disabled** for privacy

## 🚀 Deployment

### Docker Deployment

1. **Build the image**:
   ```bash
   docker-compose build
   ```

2. **Run in production**:
   ```bash
   docker-compose up -d
   ```

3. **Check health**:
   ```bash
   curl http://localhost:3000/api/health
   ```

### Production Considerations

- Use environment variables for configuration
- Set up proper SSL certificates for HTTPS
- Configure reverse proxy (Nginx) for production
- Set up monitoring and logging
- Use a container registry for image storage

## 🧪 Health Check

The application includes a health check endpoint at `/api/health` that returns:

```json
{
  "status": "healthy",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "service": "interstate-transport",
  "version": "1.0.0"
}
```

## 📝 Development

### Adding New Components

1. Create component in `src/components/`
2. Use TypeScript for type safety
3. Follow shadcn/ui patterns for consistency
4. Add proper accessibility attributes

### Styling Guidelines

- Use Tailwind CSS classes
- Follow the established color scheme (amber primary)
- Ensure responsive design
- Use Framer Motion for animations

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test with Docker
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support, please open an issue in the repository or contact the development team.

---

**Built with ❤️ using Next.js, TypeScript, and Docker**