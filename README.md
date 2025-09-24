# 🌍 SIT725 - Deakinpay Project

*Student: Thoran Kumar Cherukuru Ramesh (s224967779)*


## 📖 Table of Contents
- [Overview](#-overview)
- [Features](#-features)
- [Quick Start](#-quick-start)
- [API Endpoints](#-api-endpoints)
- [Project Structure](#-project-structure)
- [Deployment](#-deployment)
- [Technical Details](#-technical-details)

## 🎯 Overview

This project demonstrates a professional Docker implementation of a client-side globe visualization application for **SIT725 - Applied Software Engineering**. The application features an interactive 3D globe with country highlighting, user authentication, and support pages, all containerized using industry best practices.

### 🎓 Assignment Details
- **Course**: SIT725 Applied Software Engineering
- **Task**: 8.3 HD Docker Implementation
- **Student**: Thoran Kumar Cherukuru Ramesh
- **Student ID**: s224967779
- **Repository**: [GitHub Repository](https://github.com/thoran123/SIT725-HD)

## ✨ Features

### 🌐 Application Features
- **Interactive 3D Globe** - Dynamic country highlighting and visualization
- **Responsive Design** - Optimized for desktop and mobile devices
- **User Authentication** - Login page with modern UI
- **Support System** - Comprehensive help and documentation
- **RESTful APIs** - Professional backend endpoints

### 🐳 Docker Features
- **Multi-stage Builds** - Optimized production-ready images
- **Health Monitoring** - Automated container health checks
- **Security Hardened** - Non-root user execution and security headers
- **Docker Compose** - Simplified deployment and management
- **Production Ready** - Environment configuration and optimization

## 🚀 Quick Start

### Prerequisites
- Docker installed on your system
- Docker Compose (recommended)

### Method 1: Docker Compose (Recommended for Beginners)

```bash
# Clone the repository
git clone https://github.com/thoran123/SIT725-HD.git
cd SIT725-HD

# Start the application (one command)
docker-compose up -d

# Check status
docker-compose ps
```

### Method 2: Manual Docker Commands

```bash
# Build the image
docker build -t sit725-globe-app .

# Run the container
docker run -d -p 3000:3000 --name sit725-container sit725-globe-app

# Check if it's running
docker ps
```

### 🛑 Stopping the Application

```bash
# If using Docker Compose
docker-compose down

# If using manual Docker commands
docker stop sit725-container
docker rm sit725-container
```

## 🌐 Access the Application

Once running, access these endpoints:

| Service | URL | Description |
|---------|-----|-------------|
| 🌍 **Main Application** | http://localhost:3000 | Interactive globe visualization |
| 🔐 **Login Page** | http://localhost:3000/login | User authentication interface |
| ❓ **Support Page** | http://localhost:3000/support | Help and documentation |
| 🎓 **Student API** | http://localhost:3000/api/student | **HD Requirement - Student info** |
| ❤️ **Health Check** | http://localhost:3000/api/health | Application status monitoring |
| ℹ️ **App Info** | http://localhost:3000/api/info | Technical information |

## 📊 API Endpoints

### 🎓 Required HD Endpoint
```http
GET /api/student
```
**Response:**
```json
{
  "name": "Thoran Kumar Cherukuru Ramesh",
  "studentId": "s224967779",
  "subject": "SIT725 - Applied Software Engineering",
  "assignment": "8.3HD Docker Implementation",
  "applicationStatus": "running"
}
```

### 🔧 Additional Endpoints
- `GET /api/health` - Container health status
- `GET /api/info` - Application configuration
- `GET /` - Main application page
- `GET /login` - Login interface
- `GET /support` - Support documentation

## 📁 Project Structure

```
SIT725-HD/
├── 🐳 Docker Files
│   ├── Dockerfile              # Multi-stage production build
│   ├── docker-compose.yml      # Simplified deployment
│   └── .dockerignore           # Optimization rules
│
├── 🚀 Server Configuration
│   ├── server.js               # Express.js server with APIs
│   └── package.json            # Dependencies and scripts
│
├── 🌍 Client Application
│   ├── index.html              # Main globe visualization
│   ├── login.html              # Authentication page
│   ├── support.html            # Help documentation
│   ├── styles.css              # Responsive styling
│   └── globe.js                # 3D globe functionality
│
└── 📚 Documentation
    └── README.md               # This file
```

## 🛠️ Deployment

### Development Mode
```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

### Production Deployment
```bash
# Build optimized Docker image
docker build -t sit725-globe-app:production .

# Run with production settings
docker run -d -p 3000:3000 -e NODE_ENV=production sit725-globe-app:production
```

### Using npm Scripts
```bash
# Build and run with Docker
npm run docker:build
npm run docker:run

# Or use Docker Compose
npm run docker:compose:up

# Check health status
npm run health:check
```

## 🔧 Technical Details

### Docker Architecture
- **Multi-stage Builds**: Builder stage for dependencies, production stage for runtime
- **Alpine Linux**: Minimal base image for security and size optimization
- **Non-root User**: Enhanced security through privilege separation
- **Health Checks**: Automated monitoring and recovery

### Security Features
- **Helmet.js**: Security headers and Content Security Policy
- **CORS**: Cross-origin resource sharing configuration
- **Compression**: Gzip compression for performance
- **Rate Limiting**: Request size limitations

### Performance Optimizations
- **Static File Caching**: Efficient asset delivery
- **Dependency Optimization**: Production-only packages
- **Image Minimization**: Alpine Linux base image
- **Process Management**: Graceful shutdown handling

## 🐛 Troubleshooting

### Common Issues & Solutions

**Port 3000 is already in use:**
```bash
# Use a different port
docker run -d -p 3001:3000 --name sit725-container sit725-globe-app
```

**Container conflicts:**
```bash
# Clean up existing containers
docker stop $(docker ps -aq) && docker rm $(docker ps -aq)
```

**Build failures:**
```bash
# Clear Docker cache and rebuild
docker system prune -a
docker build --no-cache -t sit725-globe-app .
```

**Check application logs:**
```bash
# View real-time logs
docker logs sit725-container -f
```

### Verification Checklist
- [ ] Container runs without errors: `docker ps`
- [ ] Application accessible: http://localhost:3000
- [ ] Student API returns data: http://localhost:3000/api/student
- [ ] Health check shows "healthy": http://localhost:3000/api/health
- [ ] All pages load correctly (main, login, support)

## 📈 Learning Outcomes

This project demonstrates mastery of:

1. **Docker Containerization**
   - Multi-stage builds
   - Image optimization
   - Container security
   - Health monitoring

2. **Express.js Development**
   - RESTful API design
   - Static file serving
   - Middleware implementation
   - Error handling

3. **Production Deployment**
   - Environment configuration
   - Performance optimization
   - Security hardening
   - Monitoring implementation

## 🤝 Support

For issues related to this implementation:

1. **Check the troubleshooting section** above
2. **Verify Docker installation**: `docker --version`
3. **Check port availability**: Ensure port 3000 is free
4. **Review logs**: `docker logs sit725-container`

## 📄 License

This project is part of SIT725 - Applied Software Engineering coursework at Deakin University.

---



**Built with ❤️ by Thoran Kumar Cherukuru Ramesh (s224967779)**

*Deakin University - SIT725 Applied Software Engineering*


