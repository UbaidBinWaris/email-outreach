import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import bcrypt from 'bcryptjs';
import { encrypt } from '../lib/encryption';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Seeding database...');

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      password: adminPassword,
      name: 'Admin User',
      role: 'ADMIN',
      smtpHost: 'smtp.gmail.com',
      smtpPort: 587,
      smtpUser: 'admin@example.com',
      smtpPassword: encrypt('admin-smtp-password'), // Replace with real password
      smtpSecure: true,
    },
  });
  console.log('Created admin:', admin.email);

  // Create user 1
  const user1Password = await bcrypt.hash('user123', 10);
  const user1 = await prisma.user.upsert({
    where: { email: 'user1@example.com' },
    update: {},
    create: {
      email: 'user1@example.com',
      password: user1Password,
      name: 'User One',
      role: 'USER',
      smtpHost: 'smtp.gmail.com',
      smtpPort: 587,
      smtpUser: 'user1@example.com',
      smtpPassword: encrypt('user1-smtp-password'), // Replace with real password
      smtpSecure: true,
    },
  });
  console.log('Created user 1:', user1.email);

  // Create user 2
  const user2Password = await bcrypt.hash('user123', 10);
  const user2 = await prisma.user.upsert({
    where: { email: 'user2@example.com' },
    update: {},
    create: {
      email: 'user2@example.com',
      password: user2Password,
      name: 'User Two',
      role: 'USER',
      smtpHost: 'smtp.gmail.com',
      smtpPort: 587,
      smtpUser: 'user2@example.com',
      smtpPassword: encrypt('user2-smtp-password'), // Replace with real password
      smtpSecure: true,
    },
  });
  console.log('Created user 2:', user2.email);

  console.log('Seeding complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
