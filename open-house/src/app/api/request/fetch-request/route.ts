// app/api/request/route.ts
import { NextResponse } from "next/server";
import connectDB from "../../../../../lib/mongodb";
import Request from "../../../../../models/request";

export async function GET() {
  try {
    await connectDB();

    // Fetch only requests with status 'pending'
    const requests = await Request.find({ status: 'pending' }) // Filter for pending requests
      .populate("event") // Populate the associated Event details (if needed)
      .exec();

    console.log("requests", requests);

    return NextResponse.json({ success: true, requests });
  } catch (error) {
    console.error("Fetch Requests Error:", error);
    return NextResponse.json({ error: "Failed to fetch requests" }, { status: 500 });
  }
}
