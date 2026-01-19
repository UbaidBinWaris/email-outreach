# Email Outreach System - User Guide

## 🚀 Quick Start

### 1. First Time Setup

Make sure PostgreSQL is running, then run:

```bash
# Run database migration
npx prisma migrate dev --name init

# Seed the database with default users
npx prisma db seed

# Start the development server
npm run dev
```

Visit `http://localhost:3000` and you'll be redirected to the login page.

## 📋 Default User Credentials

After seeding the database, you can login with:

**Admin Account:**
- Email: `admin@example.com`
- Password: `admin123`

**User Accounts:**
- Email: `user1@example.com` / Password: `user123`
- Email: `user2@example.com` / Password: `user123`

## 🔐 Login Flow

1. Visit the application at `http://localhost:3000`
2. Enter your email and password
3. Click "Sign in"
4. You'll be redirected to the Dashboard

## ⚙️ Configure Gmail SMTP Settings

Before you can send emails, you need to configure your Gmail SMTP credentials:

### Step 1: Get Gmail App Password

1. Go to your Google Account settings
2. Enable 2-factor authentication if not already enabled
3. Visit [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)
4. Create a new App Password:
   - Select "Mail" as the app
   - Select "Other" as the device and name it "Email Outreach"
5. Copy the generated 16-character password

### Step 2: Configure in Settings

1. From the Dashboard, click **"Settings"** in the top navigation
2. Fill in the SMTP configuration form:
   - **SMTP Host:** `smtp.gmail.com` (pre-filled)
   - **SMTP Port:** `587` (pre-filled)
   - **Gmail Address:** Your Gmail address (e.g., `yourname@gmail.com`)
   - **Gmail App Password:** Paste the 16-character password from Step 1
   - **Use TLS/SSL:** Keep checked (recommended)

3. Click **"Test Connection"** to verify your settings
   - If successful, you'll see "SMTP configuration is valid! ✓"
   - If failed, check your credentials and try again

4. Click **"Save Configuration"** to save your encrypted SMTP settings
   - Your SMTP password is encrypted using AES-256-CBC before storage
   - You'll be redirected to the Dashboard after 2 seconds

## 📧 Sending Emails

Once your SMTP settings are configured:

1. Go to the **Dashboard** (automatically after saving settings)
2. Fill in the **Compose Email** form:
   - **To:** Recipient's email address
   - **Subject:** Email subject line
   - **Message:** Your email content
3. Click **"Send Email"** button
4. Wait for confirmation message
   - Success: "Email sent successfully!"
   - Error: See the error message for details

## 📊 Email History

The Dashboard shows your email history in real-time:

- View all sent, pending, and failed emails
- Each email shows:
  - Subject and recipient
  - Send date/time
  - Status badge (sent/pending/failed)
  - Error message (if failed)

## 🔄 Complete Workflow

```
1. Login → 2. Settings → 3. Configure SMTP → 4. Test → 5. Save → 6. Dashboard → 7. Compose Email → 8. Send
```

## 🛠️ Features

### Security Features
- ✅ Password hashing with bcrypt
- ✅ SMTP credentials encrypted with AES-256-CBC
- ✅ Secure session management
- ✅ Environment-based encryption keys

### User Features
- ✅ Role-based access (Admin/User)
- ✅ Personal SMTP configuration per user
- ✅ Email history tracking
- ✅ Real-time email status updates
- ✅ SMTP connection testing before save

### Email Features
- ✅ Send emails through personal Gmail account
- ✅ Track email delivery status
- ✅ View email history
- ✅ Error logging for failed emails

## 🔧 Troubleshooting

### Cannot Login
- Check that database is seeded: `npx prisma db seed`
- Verify credentials match the seeded users
- Check browser console for errors

### SMTP Test Fails
- Verify you're using an App Password, not your regular Gmail password
- Ensure 2-factor authentication is enabled on your Google account
- Check that the Gmail address is correct
- Try regenerating a new App Password

### Email Sending Fails
- Make sure SMTP configuration is saved (check Settings page)
- Verify the recipient email address is valid
- Check your Gmail account hasn't hit sending limits
- Review the error message in email history

### Database Connection Issues
- Ensure PostgreSQL is running: `pg_isready`
- Check `.env` file has correct DATABASE_URL
- Verify database exists: `psql -U postgress -l`

## 📱 Pages Overview

### `/` (Home)
- Redirects to `/login` if not authenticated
- Redirects to `/dashboard` if authenticated

### `/login`
- Login form with email and password
- Shows default credentials for testing
- Redirects to dashboard on success

### `/dashboard`
- Main application interface
- Compose and send emails
- View email history
- Access to Settings and Logout

### `/settings`
- Configure Gmail SMTP credentials
- Test SMTP connection
- Save encrypted credentials
- Instructions for getting App Password

## 🔐 Security Notes

1. **Never commit `.env` file** - Contains encryption keys
2. **Use App Passwords** - Never use your main Gmail password
3. **Regenerate Encryption Key** - For production, generate a new key:
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```
4. **Database Backups** - Regularly backup your PostgreSQL database

## 🎯 Next Steps

1. ✅ Login with default credentials
2. ✅ Configure your Gmail SMTP settings
3. ✅ Test the connection
4. ✅ Save your configuration
5. ✅ Send your first email
6. ✅ Monitor email history

Happy emailing! 📧
