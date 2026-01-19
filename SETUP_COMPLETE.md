# Email Outreach System - PostgreSQL Setup Complete! ✅

## What Changed?

✅ Removed Prisma ORM  
✅ Using direct PostgreSQL with `pg` (node-postgres)  
✅ Created SQL schema file  
✅ Simple database setup with one command  

## Database Structure

### Users Table
- `id` (UUID)
- `email` (unique)
- `password` (hashed)
- `name`
- `role` (ADMIN/USER)
- `smtp_host`, `smtp_port`, `smtp_user`, `smtp_password` (encrypted), `smtp_secure`
- `created_at`, `updated_at`

### Emails Table
- `id` (UUID)
- `user_id` (foreign key to users)
- `to`, `subject`, `body`
- `status` (pending/sent/failed)
- `error`, `sent_at`, `created_at`

## Setup Commands

### Initial Setup (Already Done ✅)
```bash
npm run db:setup
```

This command:
1. Creates the database tables
2. Seeds 3 users (1 admin + 2 users)

### Start the App
```bash
npm run dev
```

Visit **http://localhost:3000**

## Default Login Credentials

**Admin:**
- Email: `admin@example.com`
- Password: `admin123`

**Users:**
- Email: `user1@example.com` / Password: `user123`
- Email: `user2@example.com` / Password: `user123`

## Database Connection

Edit `.env` to configure your PostgreSQL connection:

```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=
DB_NAME=email_outreach
```

## How It Works

### 1. Login
- Go to http://localhost:3000
- Login with credentials above
- Redirected to dashboard

### 2. Configure SMTP (Settings)
- Click "Settings" in navigation
- Fill in your Gmail SMTP details
- Get App Password from: [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)
- Click "Test Connection" to verify
- Click "Save Configuration"

### 3. Send Emails (Dashboard)
- Enter recipient email
- Write subject and message
- Click "Send Email"
- See email in history panel

## Project Structure

```
lib/
  ├── db.ts           # PostgreSQL connection pool
  ├── email.ts        # Email sending functions
  └── encryption.ts   # SMTP password encryption

app/api/
  ├── auth/login/     # Login endpoint
  ├── emails/         # Send & list emails
  └── users/          # User management & SMTP config

scripts/
  └── seed.ts         # Database setup & seeding

schema.sql            # Database schema
```

## API Endpoints

All use direct SQL queries via `pg`:

- `POST /api/auth/login` - User authentication
- `GET /api/users` - List all users
- `POST /api/users` - Create new user
- `PUT /api/users/[id]/smtp` - Update SMTP config
- `POST /api/users/[id]/smtp/test` - Test SMTP connection
- `POST /api/emails` - Send email
- `GET /api/emails?userId=X` - Get email history

## Database Management

### View All Users
```sql
SELECT email, name, role FROM users;
```

### View Email History
```sql
SELECT u.email, e.to, e.subject, e.status, e.created_at 
FROM emails e 
JOIN users u ON e.user_id = u.id 
ORDER BY e.created_at DESC;
```

### Reset Everything
```bash
psql -U postgres -d email_outreach -c "DROP TABLE IF EXISTS emails CASCADE; DROP TABLE IF EXISTS users CASCADE;"
npm run db:setup
```

## Benefits of Direct PostgreSQL

✅ **Simpler**: No ORM complexity  
✅ **Faster**: Direct SQL queries  
✅ **Full Control**: Write any SQL you need  
✅ **No Migrations**: Just run schema.sql  
✅ **Easy to Debug**: Standard PostgreSQL logs  

## Security

- ✅ Passwords hashed with bcryptjs
- ✅ SMTP credentials encrypted with AES-256-CBC
- ✅ Environment variables for sensitive data
- ✅ Prepared statements (SQL injection protection)

## Troubleshooting

### Database Connection Failed
Check PostgreSQL is running:
```bash
pg_isready -h localhost -p 5432
```

### Need to Recreate Tables
```bash
npm run db:setup
```

This will recreate tables and reseed users.

### App Won't Start
```bash
# Clear Next.js cache
rm -rf .next
npm run dev
```

## Ready to Use! 🚀

Your email outreach system is now running with simple PostgreSQL!

1. ✅ Database setup complete
2. ✅ Users seeded
3. ✅ Server running at http://localhost:3000
4. ✅ Login and configure SMTP
5. ✅ Start sending emails!
