# Gmail Contact Form Setup

This document explains how to set up Gmail to work with the contact form API endpoint.

## Prerequisites

1. A Gmail account
2. Two-factor authentication enabled on your Gmail account

## Setup Instructions

### Step 1: Enable Two-Factor Authentication

1. Go to your [Google Account Settings](https://myaccount.google.com/)
2. Click on "Security" in the left sidebar
3. Under "Signing in to Google", click on "2-Step Verification"
4. Follow the setup process to enable 2-Step Verification

### Step 2: Generate App Password

1. In your Google Account Security settings, find "2-Step Verification"
2. Scroll down to "App passwords"
3. Click on "App passwords"
4. Select "Mail" as the app and "Other (Custom name)" as the device
5. Enter a custom name like "QR2Pay Contact Form"
6. Click "Generate"
7. Google will provide you with a 16-character password - **save this securely**

### Step 3: Configure Environment Variables

1. Open your `.env.local` file
2. Replace the placeholder values with your actual Gmail credentials:

```bash
GMAIL_USER=your-actual-email@gmail.com
GMAIL_APP_PASSWORD=your-16-character-app-password
```

**Important Notes:**
- Use your actual Gmail address for `GMAIL_USER`
- Use the 16-character app password (not your regular Gmail password) for `GMAIL_APP_PASSWORD`
- The app password should look like: `abcd efgh ijkl mnop` (spaces optional)

### Step 4: Test the Contact Form

1. Start your development server: `npm run dev`
2. Navigate to `/contact` page
3. Fill out and submit the contact form
4. Check your Gmail inbox for the contact form submission

## Troubleshooting

### Common Issues:

1. **"Authentication failed"** - Make sure you're using the app password, not your regular Gmail password
2. **"Less secure app access"** - This is no longer needed if you use app passwords
3. **Form submission fails** - Check the browser console and server logs for detailed error messages

### Security Best Practices:

- Never commit your `.env.local` file to version control
- Use app passwords instead of regular passwords
- Consider using environment-specific email addresses for different deployments
- Regularly rotate your app passwords

## Production Deployment

For production deployment, make sure to set the environment variables in your hosting platform:

- Vercel: Add them in the project settings under "Environment Variables"
- Netlify: Add them in site settings under "Environment variables"
- Azure: Add them in the App Service configuration
- Heroku: Use `heroku config:set GMAIL_USER=your-email@gmail.com`

## Email Template

The API sends formatted HTML emails with:
- Contact person's name and email
- The message content
- Timestamp
- Professional styling

The email will be sent to your Gmail address with the sender's email as the reply-to address.
