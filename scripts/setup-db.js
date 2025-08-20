#!/usr/bin/env node

/**
 * Quick Database Setup for Development
 * Uses mock data for local development without external database
 */

const fs = require('fs');
const path = require('path');

console.log('🏗️  Setting up local development database...\n');

// Create a simple local database setup
const localDbConfig = `
# ===========================================
# LOCAL DEVELOPMENT DATABASE CONFIGURATION
# ===========================================

# For quick local development, you can use SQLite
# Uncomment the line below and comment out the PostgreSQL URL
# DATABASE_URL="file:./dev.db"

# Or use this free Neon PostgreSQL instance (replace with your own)
# DATABASE_URL="postgresql://neondb_owner:your_password@ep-example-123.us-east-1.aws.neon.tech/neondb?sslmode=require"

# Mock Database Mode (uses in-memory data)
USE_MOCK_DATABASE="true"
MOCK_DATA_ENABLED="true"
`;

// Append to .env file
const envPath = path.join(__dirname, '../.env');
if (fs.existsSync(envPath)) {
  fs.appendFileSync(envPath, '\n' + localDbConfig);
  console.log('✅ Added local database configuration to .env');
} else {
  console.log('❌ .env file not found. Please run the setup script first.');
}

console.log('\n📋 Development Database Options:');
console.log('================================');
console.log('');

console.log('OPTION 1: Mock Database (Recommended for quick start)');
console.log('• No external setup required');
console.log('• Uses mock data from lib/mock-data.ts');
console.log('• Perfect for development and testing');
console.log('• Set USE_MOCK_DATABASE="true" in .env');
console.log('');

console.log('OPTION 2: Free Neon PostgreSQL (Production-like)');
console.log('• Sign up at: https://neon.tech');
console.log('• Free tier: 500MB storage, 1 database');
console.log('• Create project → Copy connection string');
console.log('• Replace DATABASE_URL in .env');
console.log('');

console.log('OPTION 3: Local SQLite (Offline development)');
console.log('• No internet required');
console.log('• Set DATABASE_URL="file:./dev.db"');
console.log('• Perfect for offline development');
console.log('');

console.log('🚀 Quick Start Commands:');
console.log('========================');
console.log('npm run dev          # Start development server');
console.log('npm run db:push      # Push schema to database');
console.log('npm run db:seed      # Seed with sample data');
console.log('npm run setup-env    # Generate environment secrets');
console.log('');

console.log('✅ Database setup complete! Choose your preferred option above.');
