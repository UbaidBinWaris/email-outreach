import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { encrypt } from '@/lib/encryption';
import { verifySmtpConfig } from '@/lib/email';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { smtpHost, smtpPort, smtpUser, smtpPassword, smtpSecure } = body;

    if (!smtpHost || !smtpPort || !smtpUser || !smtpPassword) {
      return NextResponse.json(
        { error: 'Missing required SMTP fields' },
        { status: 400 }
      );
    }

    // Verify SMTP configuration
    const verification = await verifySmtpConfig({
      host: smtpHost,
      port: parseInt(smtpPort),
      user: smtpUser,
      password: smtpPassword,
      secure: smtpSecure ?? true,
    });

    if (!verification.success) {
      return NextResponse.json(
        { error: 'Invalid SMTP configuration', details: verification.error },
        { status: 400 }
      );
    }

    // Encrypt password before storing
    const encryptedPassword = encrypt(smtpPassword);

    const result = await pool.query(
      'UPDATE users SET smtp_host = $1, smtp_port = $2, smtp_user = $3, smtp_password = $4, smtp_secure = $5, updated_at = CURRENT_TIMESTAMP WHERE id = $6 RETURNING id, email, name, role, smtp_host, smtp_port, smtp_user, smtp_secure',
      [smtpHost, parseInt(smtpPort), smtpUser, encryptedPassword, smtpSecure ?? true, id]
    );

    const user = result.rows[0];
    
    // Convert snake_case to camelCase
    const userData = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      smtpHost: user.smtp_host,
      smtpPort: user.smtp_port,
      smtpUser: user.smtp_user,
      smtpSecure: user.smtp_secure,
    };

    return NextResponse.json({ success: true, user: userData });
  } catch (error) {
    console.error('Update SMTP config error:', error);
    return NextResponse.json(
      { error: 'Failed to update SMTP configuration' },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const result = await pool.query(
      'SELECT id, email, name, role, smtp_host, smtp_port, smtp_user, smtp_secure FROM users WHERE id = $1',
      [id]
    );

    const user = result.rows[0];

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Convert snake_case to camelCase
    const userData = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      smtpHost: user.smtp_host,
      smtpPort: user.smtp_port,
      smtpUser: user.smtp_user,
      smtpSecure: user.smtp_secure,
    };

    return NextResponse.json(userData);
  } catch (error) {
    console.error('Get user SMTP config error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch SMTP configuration' },
      { status: 500 }
    );
  }
}
