import nodemailer from 'nodemailer';
import { decrypt } from './encryption';
import { prisma } from './prisma';

export interface EmailOptions {
  to: string;
  subject: string;
  body: string;
  html?: string;
}

export async function sendEmail(userId: string, emailOptions: EmailOptions) {
  // Get user's SMTP configuration
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      smtpHost: true,
      smtpPort: true,
      smtpUser: true,
      smtpPassword: true,
      smtpSecure: true,
    },
  });

  if (!user || !user.smtpHost || !user.smtpPort || !user.smtpUser || !user.smtpPassword) {
    throw new Error('SMTP configuration not found for user');
  }

  // Decrypt SMTP password
  const decryptedPassword = decrypt(user.smtpPassword);

  // Create transporter
  const transporter = nodemailer.createTransport({
    host: user.smtpHost,
    port: user.smtpPort,
    secure: user.smtpSecure,
    auth: {
      user: user.smtpUser,
      pass: decryptedPassword,
    },
  });

  // Create email record
  const emailRecord = await prisma.email.create({
    data: {
      userId,
      to: emailOptions.to,
      subject: emailOptions.subject,
      body: emailOptions.body,
      status: 'pending',
    },
  });

  try {
    // Send email
    await transporter.sendMail({
      from: user.smtpUser,
      to: emailOptions.to,
      subject: emailOptions.subject,
      text: emailOptions.body,
      html: emailOptions.html || emailOptions.body,
    });

    // Update email record
    await prisma.email.update({
      where: { id: emailRecord.id },
      data: {
        status: 'sent',
        sentAt: new Date(),
      },
    });

    return { success: true, emailId: emailRecord.id };
  } catch (error) {
    // Update email record with error
    await prisma.email.update({
      where: { id: emailRecord.id },
      data: {
        status: 'failed',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
    });

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
  const transporter = nodemailer.createTransport({
    host: smtpConfig.host,
    port: smtpConfig.port,
    secure: smtpConfig.secure,
    auth: {
      user: smtpConfig.user,
      pass: smtpConfig.password,
    },
  });

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
