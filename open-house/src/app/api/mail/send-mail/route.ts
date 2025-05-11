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
    } = await req.json();

    const transporter = nodemailer.createTransport({
       service:'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const subject =
      status === 'accepted'
        ? 'Visit Approved – PSG Open House 2025'
        : 'Visit Request Declined – PSG Open House 2025';

    const body = `
      Dear ${representativeName},<br /><br />
      Your request on behalf of <strong>${institutionName}</strong> for ${numberOfMembers} members has been <strong>${status.toUpperCase()}</strong>.<br/>
      Date Scheduled: <strong>${new Date(date).toLocaleDateString()}</strong>.<br /><br />
      ${
        status === 'accepted'
          ? 'We look forward to hosting you at PSG College of Technology!'
          : 'Unfortunately, due to capacity or other reasons, we are unable to accommodate your request.'
      }
      <br /><br />
      Regards,<br />
      PSG Open House Team
    `;

    await transporter.sendMail({
      from: '"PSG Open House"',
      to: toEmail,
      subject,
      html: body,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Email Error:', err);
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
  }
}
