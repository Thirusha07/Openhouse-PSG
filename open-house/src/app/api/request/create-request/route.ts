// // app/api/request/create-request/route.ts
// import { NextRequest, NextResponse } from "next/server";
// import connectDB from "../../../../../lib/mongodb";
// import Event from "../../../../../models/event";
// import Request from "../../../../../models/request";

// export async function POST(req: NextRequest) {
//   try {
//     await connectDB();
//     const data = await req.json();

//     const {
//       email,
//       institutionName,
//       scheduleId,
//       numberOfMembers,
//       representativeName,
//       mobileNumber,
  
//     } = data;
//     const formData = await req.formData(); 
//     const file = formData.get("proof") as File;

//     if (!file) {
//       return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
//     }


//     // Convert the file to base64
//     const buffer = Buffer.from(await file.arrayBuffer());
//     const proof_img = buffer.toString("base64");

    


//     // Step 1: Create Event
//     const newEvent = await Event.create({
//       email,
//       institutionName,
//       schedule: scheduleId, // Must be passed from frontend
//       numberOfMembers,
//       representativeName,
//       mobileNumber,
//       proof_img // this is the URL to uploaded ID proof
//     });

//     // Step 2: Create Request using the Event
//     const newRequest = await Request.create({
//       event: newEvent._id,
//       status: "pending",
//     });

//     return NextResponse.json({ success: true, request: newRequest });
//   } catch (error) {
//     console.error("Create Request Error:", error);
//     return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
//   }
// }

import { NextRequest, NextResponse } from "next/server";
import connectDB from "../../../../../lib/mongodb";
import Event from "../../../../../models/event";
import Request from "../../../../../models/request";

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const formData = await req.formData(); // ✅ Only use this

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

    return NextResponse.json({ success: true, request: newRequest });
  } catch (error) {
    console.error("Create Request Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
