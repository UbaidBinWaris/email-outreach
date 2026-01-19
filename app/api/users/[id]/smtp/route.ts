import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { encrypt, decrypt } from '@/lib/encryption';
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

    const user = await prisma.user.update({
      where: { id },
      data: {
        smtpHost,
        smtpPort: parseInt(smtpPort),
        smtpUser,
        smtpPassword: encryptedPassword,
        smtpSecure: smtpSecure ?? true,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        smtpHost: true,
        smtpPort: true,
        smtpUser: true,
        smtpSecure: true,
      },
    });

    return NextResponse.json({ success: true, user });
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

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        smtpHost: true,
        smtpPort: true,
        smtpUser: true,
        smtpSecure: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error('Get user SMTP config error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch SMTP configuration' },
      { status: 500 }
    );
  }
}
