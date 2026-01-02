#!/bin/bash

# Setup script for Driver License Platform

echo "=========================================="
echo "Driver License Platform - Setup Script"
echo "=========================================="
echo ""

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    echo "   Download from: https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js $(node --version) found"

# Check MongoDB
if ! command -v mongod &> /dev/null; then
    echo "⚠️  MongoDB not found locally. You can use MongoDB Atlas instead."
    echo "   Update MONGODB_URI in .env file"
else
    echo "✅ MongoDB found"
fi

# Install backend dependencies
echo ""
echo "Installing backend dependencies..."
npm install

# Install frontend dependencies
echo ""
echo "Installing frontend dependencies..."
cd client
npm install
cd ..

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo ""
    echo "Creating .env file from env.example..."
    cp env.example .env
    echo "✅ .env file created. Please update it with your configuration."
else
    echo "✅ .env file already exists"
fi

echo ""
echo "=========================================="
echo "✅ Setup complete!"
echo "=========================================="
echo ""
echo "Next steps:"
echo "1. Update .env file with your MongoDB URI and JWT secret"
echo "2. Start MongoDB (if using local): mongod"
echo "3. Initialize sample data: node scripts/init-sample-data.js"
echo "4. Start backend: npm run dev"
echo "5. Start frontend: cd client && npm run dev"
echo ""


