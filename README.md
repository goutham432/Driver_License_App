# Driver License Platform

A comprehensive SaaS web application for driver license test preparation and DMV appointment booking across multiple US states (California, Texas, Florida, New York).

## 🎯 Features

- **Multi-State Practice Tests** - Practice tests for CA, TX, FL, and NY
- **Interactive Test Taking** - Timer-based tests with real-time progress tracking
- **Detailed Results & Analytics** - Comprehensive test results with explanations
- **DMV Appointment Booking** - Online appointment scheduling with real-time availability
- **User Dashboard** - Track progress, view statistics, and manage appointments
- **Secure Authentication** - JWT-based authentication with password hashing
- **Mobile Responsive** - Fully responsive design for all devices

## 🏗️ Technology Stack

### Frontend
- React 18 with functional components and hooks
- React Router 6 for navigation
- Tailwind CSS for styling
- Axios for API calls
- Lucide React for icons

### Backend
- Node.js with Express.js
- MongoDB with Mongoose ODM
- JWT for authentication
- bcryptjs for password hashing
- Security middleware (Helmet, CORS, Rate Limiting)

### Deployment
- Docker with multi-stage builds
- Docker Compose for local development
- Kubernetes manifests for production
- Horizontal Pod Autoscaling (HPA)

## 📋 Prerequisites

- Node.js 18+ and npm
- MongoDB (local or MongoDB Atlas)
- Docker (optional, for containerized deployment)
- Kubernetes cluster (for production deployment)

## 🚀 Quick Start

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/goutham432/Driver_License_App.git
   cd Driver_License_App
   ```

2. **Install dependencies**
   ```bash
   # Install backend dependencies
   npm install

   # Install frontend dependencies
   cd client
   npm install
   cd ..
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Start MongoDB** (if using local MongoDB)
   ```bash
   # Using Docker
   docker run -d -p 27017:27017 --name mongodb mongo:7.0

   # Or use MongoDB Atlas connection string in .env
   ```

5. **Initialize sample data** (optional)
   ```bash
   node scripts/init-sample-data.js
   ```

6. **Start the application**
   ```bash
   # Terminal 1: Start backend
   npm run dev

   # Terminal 2: Start frontend
   cd client
   npm run dev
   ```

7. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

### Docker Deployment

1. **Build and run with Docker Compose**
   ```bash
   docker-compose up -d
   ```

2. **Access the application**
   - Application: http://localhost:5000

### Kubernetes Deployment

1. **Create namespace**
   ```bash
   kubectl apply -f k8s/namespace.yaml
   ```

2. **Create secrets**
   ```bash
   kubectl create secret generic app-secrets \
     --from-literal=mongodb-uri='your-mongodb-uri' \
     --from-literal=jwt-secret='your-jwt-secret' \
     --namespace=driver-license-platform
   ```

3. **Deploy MongoDB**
   ```bash
   kubectl apply -f k8s/mongodb-deployment.yaml
   ```

4. **Deploy application**
   ```bash
   kubectl apply -f k8s/app-deployment.yaml
   kubectl apply -f k8s/app-service.yaml
   kubectl apply -f k8s/hpa.yaml
   ```

5. **Deploy ingress** (optional)
   ```bash
   kubectl apply -f k8s/ingress.yaml
   ```

## 📁 Project Structure

```
driver-license-platform/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── contexts/       # React contexts
│   │   ├── pages/          # Page components
│   │   └── App.jsx         # Main app component
│   └── package.json
├── models/                 # MongoDB models
├── routes/                 # Express routes
├── middleware/             # Custom middleware
├── k8s/                    # Kubernetes manifests
├── scripts/                # Utility scripts
├── server.js               # Main server file
├── package.json
├── docker-compose.yml
├── Dockerfile
└── README.md
```

## 🔐 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Tests
- `GET /api/tests/state/:state` - Get tests by state
- `GET /api/tests/:testId` - Get specific test
- `POST /api/tests/:testId/submit` - Submit test answers
- `GET /api/tests/user/history` - Get user's test history

### Appointments
- `GET /api/appointments/slots/:state/:date` - Get available slots
- `POST /api/appointments/book` - Book appointment
- `GET /api/appointments/my-appointments` - Get user's appointments
- `PATCH /api/appointments/:id/cancel` - Cancel appointment

### States
- `GET /api/states` - List all states
- `GET /api/states/:stateCode` - Get state information
- `GET /api/states/:stateCode/locations` - Get DMV locations

## 🧪 Testing

```bash
# Run backend tests
npm test

# Run frontend tests
cd client
npm test
```

## 📊 Database Schema

### Users
- Email, password (hashed), name, state
- Test scores array
- Appointments array

### Tests
- Title, state, category, difficulty
- Questions array with options and correct answers
- Time limit and passing score

### Appointments
- User reference, state, location
- Appointment type, date, time slot
- Status and confirmation number

## 🔒 Security Features

- JWT authentication with 7-day expiration
- Password hashing with bcryptjs (10 salt rounds)
- CORS configuration
- Helmet.js security headers
- Rate limiting (100 requests per 15 minutes)
- Input validation and sanitization

## 📱 Supported States

- **California (CA)** - Los Angeles, San Francisco, San Diego
- **Texas (TX)** - Houston, Dallas, Austin
- **Florida (FL)** - Miami, Orlando, Tampa
- **New York (NY)** - Manhattan, Brooklyn, Queens

## 🚀 Deployment

### Environment Variables

```env
MONGODB_URI=mongodb://localhost:27017/driver-license-platform
JWT_SECRET=your-super-secret-jwt-key
PORT=5000
NODE_ENV=production
CLIENT_URL=https://your-domain.com
```

### Production Checklist

- [ ] Update JWT_SECRET with strong random key
- [ ] Configure MongoDB Atlas or production MongoDB
- [ ] Update CLIENT_URL with production domain
- [ ] Set up SSL/TLS certificates
- [ ] Configure ingress with proper domain
- [ ] Set up monitoring and logging
- [ ] Configure backup strategy for MongoDB

## 📝 License

MIT License

## 👤 Author

Goutham

## 🙏 Acknowledgments

- Built for DigitalOcean TAM interview assessment
- Uses modern web technologies and best practices

---

**For detailed setup instructions, see the deployment guide in the repository.**
