import { NextRequest, NextResponse } from 'next/server';
import { verifySmtpConfig } from '@/lib/email';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await params; // await params even though we don't use id for testing
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
        { success: false, error: verification.error },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true, message: 'SMTP configuration is valid' });
  } catch (error) {
    console.error('Test SMTP config error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to test SMTP configuration' },
      { status: 500 }
    );
  }
}
