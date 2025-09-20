import { NextRequest, NextResponse } from "next/server";
import connectDB from "../../../../../lib/mongodb";
import Request from "../../../../../models/request";
import Event from "../../../../../models/event";
import Schedule from "../../../../../models/schedule"; // This line is the fix

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const query = status ? { status } : {}; // If no status provided, fetch all

    // By importing the `Event` and `Schedule` models, Mongoose knows how to populate them.
    const requests = await Request.find(query)
      .populate({
        path: "event",
        model: Event,
        populate: {
          path: "schedule",
          model: Schedule,
        },
      })
      .sort({ createdAt: -1 });

    return NextResponse.json({ success: true, requests });
  } catch (error) {
    console.error("Fetch Requests Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch requests" },
      { status: 500 }
    );
  }
}
