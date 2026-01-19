# Email Outreach System

A Next.js application for managing multiple users with encrypted SMTP configurations and email sending capabilities.

## Features

- 🔐 User authentication with role-based access (Admin/User)
- 🔒 Encrypted SMTP credentials storage
- 📧 Email sending through user-specific SMTP configurations
- 📊 Email tracking and history
- 🗄️ PostgreSQL database with Prisma ORM

## Database Schema

### Users Table
- **id**: UUID primary key
- **email**: Unique user email
- **password**: Hashed password
- **name**: User's full name
- **role**: ADMIN or USER
- **smtpHost**: SMTP server hostname
- **smtpPort**: SMTP server port
- **smtpUser**: SMTP username
- **smtpPassword**: Encrypted SMTP password
- **smtpSecure**: Boolean for SSL/TLS

### Emails Table
- **id**: UUID primary key
- **userId**: Foreign key to users
- **to**: Recipient email
- **subject**: Email subject
- **body**: Email body text
- **status**: pending/sent/failed
- **error**: Error message if failed
- **sentAt**: Timestamp when sent
- **createdAt**: Timestamp when created

## Setup Instructions

### 1. Install Dependencies
Already done! Dependencies include:
- Prisma (Database ORM)
- Nodemailer (Email sending)
- Bcryptjs (Password hashing)
- Built-in crypto module (SMTP encryption)

### 2. Configure Database

Make sure PostgreSQL is running on your system. Update the `.env` file if needed:

```env
DATABASE_URL="postgresql://postgress:mypassword@localhost:5432/email_outreach?schema=public"
ENCRYPTION_KEY="0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef"
```

**Important**: Generate a secure 64-character hex string for `ENCRYPTION_KEY` in production:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 3. Create Database and Run Migrations

```bash
# Create database tables
npx prisma migrate dev --name init

# Generate Prisma client
npx prisma generate

# Seed initial users (1 admin + 2 users)
npx prisma db seed
```

### 4. Update SMTP Credentials

Edit `prisma/seed.ts` to add real SMTP credentials before seeding:
- Replace `'admin-smtp-password'` with actual SMTP password for admin
- Replace `'user1-smtp-password'` with actual SMTP password for user1
- Replace `'user2-smtp-password'` with actual SMTP password for user2
- Update SMTP hosts if not using Gmail

**Default seeded users:**
- Admin: `admin@example.com` / password: `admin123`
- User 1: `user1@example.com` / password: `user123`
- User 2: `user2@example.com` / password: `user123`

## API Endpoints

### Users

#### GET /api/users
List all users (excludes passwords and encrypted SMTP passwords)

#### POST /api/users
Create a new user
```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "User Name",
  "role": "USER"
}
```

#### GET /api/users/[id]/smtp
Get user's SMTP configuration (excludes password)

#### PUT /api/users/[id]/smtp
Update user's SMTP configuration (verifies connection before saving)
```json
{
  "smtpHost": "smtp.gmail.com",
  "smtpPort": 587,
  "smtpUser": "user@gmail.com",
  "smtpPassword": "app-specific-password",
  "smtpSecure": true
}
```

### Emails

#### POST /api/emails
Send an email using user's SMTP configuration
```json
{
  "userId": "user-uuid",
  "to": "recipient@example.com",
  "subject": "Email Subject",
  "body": "Email body text",
  "html": "<p>Optional HTML body</p>"
}
```

#### GET /api/emails?userId=[userId]
Get email history for a user (last 50 emails)

## Testing the Email Functionality

### 1. Using Gmail SMTP
For Gmail, you need to:
1. Enable 2-factor authentication
2. Generate an "App Password"
3. Use the app password in SMTP configuration

### 2. Test Email Sending

```bash
# Example curl command
curl -X POST http://localhost:3000/api/emails \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "your-user-id",
    "to": "recipient@example.com",
    "subject": "Test Email",
    "body": "This is a test email from the outreach system"
  }'
```

## Security Features

1. **Password Hashing**: User passwords are hashed using bcrypt
2. **SMTP Encryption**: SMTP passwords are encrypted using AES-256-CBC
3. **Environment Variables**: Sensitive keys stored in .env file
4. **Database Connection**: Secure PostgreSQL connection

## Development

```bash
# Run development server
npm run dev

# View Prisma Studio (database GUI)
npx prisma studio

# Reset database
npx prisma migrate reset
```

## Project Structure

```
├── app/
│   ├── api/
│   │   ├── emails/route.ts       # Email sending endpoints
│   │   └── users/
│   │       ├── route.ts           # User management
│   │       └── [id]/smtp/route.ts # SMTP config management
├── lib/
│   ├── encryption.ts              # AES encryption utilities
│   ├── email.ts                   # Email sending service
│   └── prisma.ts                  # Prisma client singleton
├── prisma/
│   ├── schema.prisma              # Database schema
│   └── seed.ts                    # Database seeding script
└── .env                           # Environment variables
```

## Troubleshooting

### Database Connection Issues
- Ensure PostgreSQL is running: `pg_isready`
- Check connection credentials in `.env`
- Verify database exists: `psql -U postgress -l`

### SMTP Issues
- Use app-specific passwords for Gmail
- Check firewall settings for SMTP ports
- Verify SMTP credentials with test endpoint

### Migration Issues
If you see "Can't reach database server", make sure:
1. PostgreSQL service is running
2. Database credentials are correct
3. Database port is not blocked

## Next Steps

1. Start your PostgreSQL database
2. Run migrations: `npx prisma migrate dev`
3. Seed the database: `npx prisma db seed`
4. Update SMTP credentials for real email accounts
5. Test email sending through the API

Happy emailing! 📧
