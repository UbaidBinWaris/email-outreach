# Complete Setup Instructions

## Prerequisites
- PostgreSQL installed and running
- Node.js and npm installed

## Setup Steps

### 1. Install Dependencies (Already Done ✓)
```bash
npm install
```

### 2. Configure Environment
The `.env` file is already configured with:
- Database connection URL
- Encryption key for SMTP credentials

### 3. Setup Database

**Option A: If PostgreSQL is running on default port (5432)**
```bash
# Create the database
createdb -U postgress email_outreach

# Run migrations to create tables
npx prisma migrate dev --name init

# Generate Prisma client (Already done ✓)
npx prisma generate

# Seed the database with initial users
npx prisma db seed
```

**Option B: If you need to start PostgreSQL first**
```powershell
# Start PostgreSQL service (Windows)
Start-Service postgresql-x64-14

# Or if using Docker
docker run --name postgres -e POSTGRES_PASSWORD=mypassword -p 5432:5432 -d postgres
```

### 4. Start the Application
```bash
npm run dev
```

### 5. Access the Application
Open your browser and go to: `http://localhost:3000`

## Quick Test

1. **Login** with default credentials:
   - Email: `admin@example.com`
   - Password: `admin123`

2. **Go to Settings** and configure your Gmail SMTP:
   - Get an App Password from Google
   - Fill in the form
   - Test connection
   - Save

3. **Send an Email** from the Dashboard:
   - Enter recipient email
   - Write subject and message
   - Click Send

## Current Status

✅ Dependencies installed  
✅ Prisma client generated  
✅ Project files created  
⏳ Waiting for database migration  
⏳ Waiting for database seeding  

## Next Steps

You need to:
1. Make sure PostgreSQL is running
2. Run the database migration: `npx prisma migrate dev --name init`
3. Seed the database: `npx prisma db seed`
4. Start the dev server (if not running): `npm run dev`
5. Visit `http://localhost:3000`

## Troubleshooting

### Database Connection Error
If you see "Can't reach database server", check:
1. PostgreSQL is running: `pg_isready`
2. Credentials in `.env` are correct
3. Database port (5432) is not blocked

### App Won't Start
1. Stop any running dev server (Ctrl+C)
2. Clear Next.js cache: `rm -rf .next`
3. Restart: `npm run dev`

For detailed user guide, see `USER_GUIDE.md`
