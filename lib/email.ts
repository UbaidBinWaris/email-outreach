import nodemailer from 'nodemailer';
import { decrypt } from './encryption';
import pool from './db';

export interface EmailOptions {
  to: string;
  subject: string;
  body: string;
  html?: string;
}

export async function sendEmail(userId: string, emailOptions: EmailOptions) {
  // Get user's SMTP configuration
  const result = await pool.query(
    'SELECT smtp_host, smtp_port, smtp_user, smtp_password, smtp_secure FROM users WHERE id = $1',
    [userId]
  );

  const user = result.rows[0];

  if (!user || !user.smtp_host || !user.smtp_port || !user.smtp_user || !user.smtp_password) {
    throw new Error('SMTP configuration not found for user');
  }

  // Decrypt SMTP password
  const decryptedPassword = decrypt(user.smtp_password);

  // Create transporter with Gmail-compatible settings
  const port = parseInt(user.smtp_port);
  const isPort587 = port === 587;
  
  const transportConfig: any = {
    host: user.smtp_host,
    port: port,
    secure: isPort587 ? false : user.smtp_secure, // Force false for port 587
    auth: {
      user: user.smtp_user,
      pass: decryptedPassword,
    },
  };

  // For port 587 (STARTTLS), always use requireTLS
  if (isPort587) {
    transportConfig.requireTLS = true;
    transportConfig.tls = {
      rejectUnauthorized: false,
    };
  }

  const transporter = nodemailer.createTransport(transportConfig);

  // Create email record
  const emailResult = await pool.query(
    'INSERT INTO emails (user_id, "to", subject, body, status) VALUES ($1, $2, $3, $4, $5) RETURNING id',
    [userId, emailOptions.to, emailOptions.subject, emailOptions.body, 'pending']
  );
  const emailRecord = emailResult.rows[0];

  try {
    // Send email
    await transporter.sendMail({
      from: user.smtp_user,
      to: emailOptions.to,
      subject: emailOptions.subject,
      text: emailOptions.body,
      html: emailOptions.html || emailOptions.body,
    });

    // Update email record
    await pool.query(
      'UPDATE emails SET status = $1, sent_at = $2 WHERE id = $3',
      ['sent', new Date(), emailRecord.id]
    );

    return { success: true, emailId: emailRecord.id };
  } catch (error) {
    // Update email record with error
    await pool.query(
      'UPDATE emails SET status = $1, error = $2 WHERE id = $3',
      ['failed', error instanceof Error ? error.message : 'Unknown error', emailRecord.id]
    );

    throw error;
  }
}

export async function verifySmtpConfig(smtpConfig: {
  host: string;
  port: number;
  user: string;
  password: string;
  secure: boolean;
}) {
  // Configure transporter with Gmail-compatible settings
  const isPort587 = smtpConfig.port === 587;
  
  const transportConfig: any = {
    host: smtpConfig.host,
    port: smtpConfig.port,
    secure: isPort587 ? false : smtpConfig.secure, // Force false for port 587
    auth: {
      user: smtpConfig.user,
      pass: smtpConfig.password,
    },
  };

  // For port 587 (STARTTLS), always use requireTLS
  if (isPort587) {
    transportConfig.requireTLS = true;
    transportConfig.tls = {
      rejectUnauthorized: false,
    };
  }

  const transporter = nodemailer.createTransport(transportConfig);

  try {
    await transporter.verify();
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}
