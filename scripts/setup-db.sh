#!/bin/bash

# Database setup script for Render deployment
echo "Setting up database for Render..."

# Wait for database to be ready
echo "Waiting for database to be ready..."
sleep 10

# Generate Prisma Client
echo "Generating Prisma Client..."
npx prisma generate

# Push schema to database
echo "Pushing schema to database..."
npx prisma db push --accept-data-loss

echo "Database setup complete!"
