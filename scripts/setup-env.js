#!/usr/bin/env node

/**
 * Environment Setup Script for UNILORIN Artisan Platform
 * Generates secure secrets and provides setup instructions
 */

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

console.log('🚀 UNILORIN Artisan Platform - Environment Setup\n');

// Generate secure secrets
const jwtSecret = crypto.randomBytes(64).toString('hex');
const nextAuthSecret = crypto.randomBytes(32).toString('base64');
const appSecret = crypto.randomBytes(16).toString('hex');

console.log('🔐 Generated Secure Secrets:');
console.log('========================');
console.log(`JWT_SECRET="${jwtSecret}"`);
console.log(`NEXTAUTH_SECRET="${nextAuthSecret}"`);
console.log(`APP_SECRET="${appSecret}"`);
console.log('');

// Setup instructions
console.log('📋 Setup Instructions:');
console.log('======================');
console.log('');

console.log('1. 🗄️  DATABASE (Neon PostgreSQL - FREE):');
console.log('   → Visit: https://neon.tech');
console.log('   → Create account and new project');
console.log('   → Copy connection string to DATABASE_URL');
console.log('');

console.log('2. 📁 FILE STORAGE (Cloudinary - FREE TIER):');
console.log('   → Visit: https://cloudinary.com');
console.log('   → Create account');
console.log('   → Dashboard → API Keys → Copy credentials');
console.log('');

console.log('3. 📧 EMAIL (Gmail SMTP - FREE):');
console.log('   → Gmail → Security → 2-Step Verification');
console.log('   → App Passwords → Generate password');
console.log('   → Use app password in SMTP_PASS');
console.log('');

console.log('4. 💳 PAYMENTS (Paystack - FREE FOR TESTING):');
console.log('   → Visit: https://paystack.com');
console.log('   → Create account');
console.log('   → Settings → API Keys → Copy test keys');
console.log('');

console.log('5. 🔧 Quick Database Setup (Local Development):');
console.log('   → Run: npm run db:setup');
console.log('   → Run: npm run db:seed');
console.log('');

// Create .env.example file
const envExample = `# Copy this file to .env and fill in your actual values

# Database (Get from: https://neon.tech)
DATABASE_URL="postgresql://username:password@hostname/database?sslmode=require"

# Authentication (Generated)
JWT_SECRET="${jwtSecret}"
NEXTAUTH_SECRET="${nextAuthSecret}"

# File Storage (Get from: https://cloudinary.com)
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"

# Email (Gmail App Password)
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-16-char-app-password"

# Payments (Get from: https://paystack.com)
PAYSTACK_PUBLIC_KEY="pk_test_your-public-key"
PAYSTACK_SECRET_KEY="sk_test_your-secret-key"
`;

// Write .env.example
fs.writeFileSync(path.join(__dirname, '../.env.example'), envExample);
console.log('✅ Created .env.example file with your generated secrets!');
console.log('');

console.log('🎯 Next Steps:');
console.log('==============');
console.log('1. Copy the generated secrets to your .env file');
console.log('2. Sign up for the services listed above');
console.log('3. Replace placeholder values with real credentials');
console.log('4. Run: npm run dev');
console.log('');

console.log('💡 Tips:');
console.log('========');
console.log('• Keep your .env file secure (never commit to git)');
console.log('• Use test credentials for development');
console.log('• Generate new secrets for production');
console.log('');

console.log('🆘 Need Help?');
console.log('=============');
console.log('• Documentation: README.md');
console.log('• Issues: Create a GitHub issue');
console.log('• Email: support@unilorin-artisan.edu.ng');
