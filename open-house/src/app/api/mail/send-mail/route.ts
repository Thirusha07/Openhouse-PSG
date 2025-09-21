import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req: Request) {
  try {
    const {
      toEmail,
      status,
      institutionName,
      representativeName,
      date,
      numberOfMembers,
      rejectionReason,
    } = await req.json();

    const transporter = nodemailer.createTransport({
       service:'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const subject =
      status === 'accepted'
        ? 'Visit Approved – PSG Open House 2025'
        : 'Visit Request Update – PSG Open House 2025';

    const acceptedBody = `
      Dear ${representativeName},<br /><br />
      We are pleased to inform you that your visit request on behalf of <strong>${institutionName}</strong> for ${numberOfMembers} members has been <strong>ACCEPTED</strong>.<br/>
      Your scheduled date is: <strong>${new Date(date).toLocaleDateString()}</strong>.<br /><br />
      We look forward to hosting you at PSG College of Technology!
      <br /><br />
      Regards,<br />
      PSG Open House Team
    `;

    const declinedBody = `
      Dear ${representativeName},<br /><br />
      Thank you for your interest in the PSG Open House. After careful review, we regret to inform you that we are unable to accommodate your visit request for <strong>${institutionName}</strong> for ${numberOfMembers} members on ${new Date(date).toLocaleDateString()}.<br/><br/>
      Reason for decline: <strong>${rejectionReason || 'Due to high demand and limited capacity, we could not process your request at this time.'}</strong>
      <br /><br />
      We encourage you to try for other available dates if possible.
      <br /><br />
      Regards,<br />
      PSG Open House Team
    `;

    const body = status === 'accepted' ? acceptedBody : declinedBody;

    await transporter.sendMail({
      from: `"PSG Open House" <${process.env.EMAIL_USER}>`,
      to: toEmail,
      subject,
      html: body,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Email Error:', err);
    const errorMessage = err instanceof Error ? err.message : 'Failed to send email';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
