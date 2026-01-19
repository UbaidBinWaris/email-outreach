import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { sendEmail } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, to, subject, body: emailBody, html } = body;

    if (!userId || !to || !subject || !emailBody) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const result = await sendEmail(userId, {
      to,
      subject,
      body: emailBody,
      html,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Send email error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to send email' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'userId is required' },
        { status: 400 }
      );
    }

    const result = await pool.query(
      'SELECT id, user_id as "userId", "to", subject, body, status, error, sent_at as "sentAt", created_at as "createdAt" FROM emails WHERE user_id = $1 ORDER BY created_at DESC LIMIT 50',
      [userId]
    );

    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Get emails error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch emails' },
      { status: 500 }
    );
  }
}
