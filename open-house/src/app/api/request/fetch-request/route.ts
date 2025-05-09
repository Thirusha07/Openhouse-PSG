import { NextRequest, NextResponse } from "next/server";
import connectDB from "../../../../../lib/mongodb";
import Request from "../../../../../models/request";
import "../../../../../models/event";

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const status = req.nextUrl.searchParams.get("status"); // Get the status query param
    const query = status ? { status } : {}; // If no status provided, fetch all

    const requests = await Request.find(query).populate("event").exec();

    return NextResponse.json({ success: true, requests });
  } catch (error) {
    console.error("Fetch Requests Error:", error);
    return NextResponse.json({ error: "Failed to fetch requests" }, { status: 500 });
  }
}
