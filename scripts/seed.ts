import 'dotenv/config';
import pool from '../lib/db';
import bcrypt from 'bcryptjs';
import { encrypt } from '../lib/encryption';
import { readFileSync } from 'fs';
import { join } from 'path';

async function main() {
  console.log('Setting up database...');

  // Read and execute schema
  const schema = readFileSync(join(__dirname, '../schema.sql'), 'utf-8');
  await pool.query(schema);
  console.log('Schema created successfully');

  console.log('Seeding database...');

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 10);
  const adminResult = await pool.query(
    `INSERT INTO users (email, password, name, role, smtp_host, smtp_port, smtp_user, smtp_password, smtp_secure) 
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) 
     ON CONFLICT (email) DO NOTHING
     RETURNING email`,
    ['admin@example.com', adminPassword, 'Admin User', 'ADMIN', 'smtp.gmail.com', 587, 'admin@example.com', encrypt('admin-smtp-password'), true]
  );
  if (adminResult.rows.length > 0) {
    console.log('Created admin:', adminResult.rows[0].email);
  } else {
    console.log('Admin already exists');
  }

  // Create user 1
  const user1Password = await bcrypt.hash('user123', 10);
  const user1Result = await pool.query(
    `INSERT INTO users (email, password, name, role, smtp_host, smtp_port, smtp_user, smtp_password, smtp_secure) 
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) 
     ON CONFLICT (email) DO NOTHING
     RETURNING email`,
    ['user1@example.com', user1Password, 'User One', 'USER', 'smtp.gmail.com', 587, 'user1@example.com', encrypt('user1-smtp-password'), true]
  );
  if (user1Result.rows.length > 0) {
    console.log('Created user 1:', user1Result.rows[0].email);
  } else {
    console.log('User 1 already exists');
  }

  // Create user 2
  const user2Password = await bcrypt.hash('user123', 10);
  const user2Result = await pool.query(
    `INSERT INTO users (email, password, name, role, smtp_host, smtp_port, smtp_user, smtp_password, smtp_secure) 
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) 
     ON CONFLICT (email) DO NOTHING
     RETURNING email`,
    ['user2@example.com', user2Password, 'User Two', 'USER', 'smtp.gmail.com', 587, 'user2@example.com', encrypt('user2-smtp-password'), true]
  );
  if (user2Result.rows.length > 0) {
    console.log('Created user 2:', user2Result.rows[0].email);
  } else {
    console.log('User 2 already exists');
  }

  console.log('Seeding complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await pool.end();
  });
