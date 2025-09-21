import { NextResponse } from 'next/server';
import connectDB from '../../../../../lib/mongodb';
import Event from '../../../../../models/event';
import Request from '../../../../../models/request';
import Schedule from '../../../../../models/schedule';
import nodemailer from 'nodemailer';

export async function POST(req: globalThis.Request) {
    try {
        await connectDB();

        const formData = await req.formData();
        const email = formData.get('email') as string;
        const institutionName = formData.get('institutionName') as string;
        const scheduleId = formData.get('scheduleId') as string;
        const numberOfMembers = parseInt(formData.get('numberOfMembers') as string);
        const representativeName = formData.get('representativeName') as string;
        const mobileNumber = formData.get('mobileNumber') as string;
        const idProofFile = formData.get('idProof') as File;
        const studentListFile = formData.get('studentList') as File;

        if (!idProofFile || !studentListFile) {
            return NextResponse.json({ error: 'ID proof and student list files are required.' }, { status: 400 });
        }

        const idProofBuffer = Buffer.from(await idProofFile.arrayBuffer());
        const idProofBase64 = idProofBuffer.toString('base64');

        const studentListBuffer = Buffer.from(await studentListFile.arrayBuffer());
        const studentListBase64 = studentListBuffer.toString('base64');

        const newEvent = await Event.create({
            email,
            institutionName,
            schedule: scheduleId,
            numberOfMembers,
            representativeName,
            mobileNumber,
            idProof: idProofBase64,
            studentList: studentListBase64,
        });

        await Request.create({
            event: newEvent._id,
            status: 'pending',
        });

        const schedule = await Schedule.findById(scheduleId);

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD,
            },
        });

        const mailOptions = {
            from: `"PSG Open House" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: 'Your Visit Request to PSG Open House has been received!',
            html: `
              <div style="font-family: Arial, sans-serif; line-height: 1.6;">
                  <h2>Hello ${representativeName},</h2>
                  <p>Thank you for your visit request to the PSG College of Technology Open House. We have received your details and will review them shortly.</p>
                  <p>Here is a summary of your submission:</p>
                  <ul>
                      <li><strong>Institution:</strong> ${institutionName}</li>
                      <li><strong>Contact Name:</strong> ${representativeName}</li>
                      <li><strong>Number of Students:</strong> ${numberOfMembers}</li>
                      <li><strong>Requested Date:</strong> ${schedule ? new Date(schedule.date).toLocaleDateString() : 'N/A'}</li>
                  </ul>
                  <p>Please note: This is not a confirmation. You will receive a final confirmation email once your request is approved.</p>
                  <br/>
                  <p>Best regards,</p>
                  <p><strong>The PSG Open House Team</strong></p>
              </div>`,
        };

        await transporter.sendMail(mailOptions);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Create Request Error:', error);
        const errorMessage = error instanceof Error ? error.message : 'Internal Server Error';
        return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
}