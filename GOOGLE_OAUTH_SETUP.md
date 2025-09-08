# Google OAuth Setup Guide

## 🔐 Google Authentication Integration

Your platform now supports Google OAuth authentication! Users can sign up and log in using their Gmail accounts for enhanced security and user verification.

## 🚀 Setup Instructions

### 1. Create Google OAuth Application

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API and Google OAuth2 API
4. Go to "Credentials" → "Create Credentials" → "OAuth client ID"
5. Choose "Web application"
6. Add these URLs to "Authorized redirect URIs":
   ```
   http://localhost:3000/api/auth/google/callback
   https://yourdomain.com/api/auth/google/callback
   ```

### 2. Configure Environment Variables

Update your `.env.local` file with your Google OAuth credentials:

```bash
# Google OAuth Configuration
GOOGLE_CLIENT_ID=your-actual-google-client-id-here
GOOGLE_CLIENT_SECRET=your-actual-google-client-secret-here
```

### 3. Features Added

✅ **Google Sign-In Button** - Added to both login and registration pages
✅ **Automatic User Creation** - New users are automatically created in your database
✅ **Secure Authentication** - Users get JWT tokens for session management
✅ **Account Verification** - Gmail ownership confirms user identity

## 🎯 User Experience

### For Users:
1. Click "Continue with Google" on login/register page
2. Authenticate with Google (confirms Gmail ownership)
3. Automatic account creation (if new user)
4. Seamless login to the platform
5. Full access to all platform features

### For New Google Users:
- Default role: "student"
- Can update profile information after first login
- No password required (OAuth handles authentication)

## 🔧 Technical Implementation

### API Routes Created:
- `/api/auth/signin/google` - Initiates Google OAuth flow
- `/api/auth/google/callback` - Handles OAuth callback and user creation

### Database Integration:
- Checks if user exists by email
- Creates new user with Google profile information
- Generates JWT token for session management
- Sets secure HTTP-only cookies

## 📋 Next Steps

1. **Get Google OAuth Credentials**:
   - Follow the setup instructions above
   - Replace placeholder values in `.env.local`

2. **Test the Integration**:
   - Restart your development server
   - Try signing up with Google
   - Verify user creation in your database

3. **Production Setup**:
   - Update redirect URLs for your production domain
   - Ensure HTTPS is enabled for production OAuth

## 🛡️ Security Features

- ✅ Email ownership verification through Google
- ✅ Secure token-based authentication
- ✅ HTTP-only cookies prevent XSS attacks
- ✅ State parameter prevents CSRF attacks
- ✅ Proper OAuth 2.0 implementation

## 🐛 Troubleshooting

### Common Issues:

1. **OAuth Error**: Check that redirect URIs match exactly
2. **Missing Credentials**: Ensure GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET are set
3. **Database Error**: Verify Supabase connection and user table schema

### Testing:
```bash
# Check if environment variables are loaded
node -e "console.log(process.env.GOOGLE_CLIENT_ID ? 'Google Client ID loaded' : 'Missing Google Client ID')"
```

Your platform now provides a smooth, secure authentication experience with Gmail verification! 🎉
