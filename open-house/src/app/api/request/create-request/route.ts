import { NextRequest, NextResponse } from "next/server";
import connectDB from "../../../../../lib/mongodb";
import Event from "../../../../../models/event";
import Request from "../../../../../models/request";
import Schedule from "../../../../../models/schedule";
import nodemailer from "nodemailer";

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    if (!process.env.EMAIL_SERVER_USER || !process.env.EMAIL_SERVER_PASSWORD) {
      console.error("Email server credentials are not configured in .env.local");
      return NextResponse.json({ error: "Server configuration error: Email service is not set up." }, { status: 500 });
    }

    const formData = await req.formData();

    const email = formData.get("email") as string;
    const institutionName = formData.get("institutionName") as string;
    const scheduleId = formData.get("scheduleId") as string;
    const numberOfMembers = parseInt(formData.get("numberOfMembers") as string);
    const representativeName = formData.get("representativeName") as string;
    const mobileNumber = formData.get("mobileNumber") as string;

    const idProofFile = formData.get("idProof") as File | null;
    const studentListFile = formData.get("studentList") as File | null;

    if (!idProofFile) {
      return NextResponse.json({ error: "ID proof file is required." }, { status: 400 });
    }
    if (!studentListFile) {
      return NextResponse.json({ error: "Student list file is required." }, { status: 400 });
    }

    // Convert the files to base64 strings
    const idProofBuffer = Buffer.from(await idProofFile.arrayBuffer());
    const idProofBase64 = idProofBuffer.toString("base64");

    const studentListBuffer = Buffer.from(await studentListFile.arrayBuffer());
    const studentListBase64 = studentListBuffer.toString("base64");

    // Create Event
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

    // Create Request
    const newRequest = await Request.create({
      event: newEvent._id,
      status: "pending",
    });

    // Fetch schedule details for the email
    const schedule = await Schedule.findById(scheduleId);

    // --- Email Sending Logic Commented Out ---
    // For now, we assume the email is sent successfully without actually sending it.
    // You can uncomment this block later to re-enable email sending.
    /*
    // Nodemailer logic was here...
    await transporter.sendMail(mailOptions);
    */

    return NextResponse.json({ success: true, request: newRequest });
  } catch (error) {
    console.error("Create Request Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}