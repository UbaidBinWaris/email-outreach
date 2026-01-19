# 📧 Email Outreach System

A modern, professional email outreach application with premium UI/UX, built with Next.js 16, PostgreSQL, and Framer Motion animations.

## ✨ Features

- 🎨 **Premium Glass-Morphism UI** with animated gradients
- 🔐 **Secure Authentication** with bcrypt password hashing
- 📨 **SMTP Email Sending** via Gmail with App Passwords
- 🔒 **AES-256 Encryption** for SMTP credentials
- 📊 **Real-time Dashboard** with email statistics
- 🎭 **Smooth Animations** powered by Framer Motion
- 👥 **Multi-user Support** (Admin + Regular Users)
- 📜 **Email History** tracking with status

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Setup PostgreSQL Database
Make sure PostgreSQL is installed and running, then create the database:
```bash
createdb email_outreach
psql -d email_outreach -f schema.sql
```

### 3. Configure Environment
Create `.env` file:
```env
DATABASE_URL=postgresql://postgres@localhost:5432/email_outreach
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=
DB_NAME=email_outreach
ENCRYPTION_KEY=your-64-character-hex-string-here
```

Generate encryption key:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 4. Seed Database
```bash
npm run seed
```

This creates 3 test users:
- **Admin**: `admin@example.com` / `admin123`
- **User 1**: `user1@example.com` / `user123`
- **User 2**: `user2@example.com` / `user123`

### 5. Run Development Server
```bash
npm run dev
```

Visit http://localhost:3000

## 📁 Project Structure

```
email-outreach/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   │   ├── auth/          # Authentication endpoints
│   │   ├── emails/        # Email sending & history
│   │   └── users/         # User management & SMTP config
│   ├── dashboard/         # Main dashboard page
│   ├── login/            # Login page
│   ├── settings/         # SMTP configuration page
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Landing/loading page
├── contexts/             # React contexts
│   └── AuthContext.tsx   # Authentication state
├── lib/                  # Utility libraries
│   ├── db.ts            # PostgreSQL connection
│   ├── email.ts         # Email sending logic
│   └── encryption.ts    # AES encryption utilities
├── scripts/             # Database scripts
│   └── seed.ts         # Database seeding
├── schema.sql          # Database schema
└── .env               # Environment variables

```

## 🎨 Pages Overview

### Login Page
- Glass-morphism design with animated background
- Floating particles and gradient orbs
- Smooth input animations
- Demo credentials displayed

### Dashboard
- 4 animated stat cards (Total, Sent, Failed, Pending)
- Email compose form with real-time validation
- Email history with status badges
- Glass-morphism cards throughout

### Settings
- Gmail SMTP configuration
- Port selection (587/465)
- SSL/TLS toggle switch
- Test connection before saving
- Step-by-step setup guide

## 🔧 Tech Stack

- **Framework**: Next.js 16.1.3 (App Router)
- **Database**: PostgreSQL 18
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Email**: Nodemailer
- **Authentication**: bcryptjs
- **Database Client**: node-postgres (pg)

## 📧 Gmail SMTP Setup

1. Enable 2-factor authentication on your Google account
2. Go to https://myaccount.google.com/apppasswords
3. Create a new App Password for "Mail"
4. Use these settings:
   - **Host**: smtp.gmail.com
   - **Port 587**: Leave SSL/TLS unchecked (uses STARTTLS)
   - **Port 465**: Check SSL/TLS box
5. Enter your Gmail and the 16-character App Password

## 🗄️ Database Schema

### Users Table
- `id` (UUID, Primary Key)
- `email` (VARCHAR, Unique)
- `password` (VARCHAR, Hashed)
- `name` (VARCHAR)
- `role` (VARCHAR: 'admin' | 'user')
- `smtp_host`, `smtp_port`, `smtp_user`, `smtp_password` (Encrypted), `smtp_secure`
- `created_at`, `updated_at` (Timestamps)

### Emails Table
- `id` (UUID, Primary Key)
- `user_id` (UUID, Foreign Key → users)
- `to`, `subject`, `body` (VARCHAR/TEXT)
- `status` (VARCHAR: 'pending' | 'sent' | 'failed')
- `error` (TEXT, nullable)
- `sent_at`, `created_at` (Timestamps)

## 🎯 Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm start            # Start production server
npm run lint         # Run ESLint
npm run seed         # Seed database with test users
```

## 🔐 Security Features

- Passwords hashed with bcrypt (10 rounds)
- SMTP passwords encrypted with AES-256-CBC
- Environment variables for sensitive data
- SQL injection prevention via parameterized queries
- Input validation on all forms

## 🌈 Color Scheme

- **Primary Gradient**: Blue → Purple → Pink
- **Background**: Slate-900 → Purple-900
- **Accents**: Cyan, Emerald, Orange
- **Glass Effects**: White 10-20% opacity + backdrop blur

## 📝 License

MIT License - feel free to use this project for your own purposes!

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

Built with ❤️ using Next.js, PostgreSQL, and Framer Motion
