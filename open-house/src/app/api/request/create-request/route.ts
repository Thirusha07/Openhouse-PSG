import { NextRequest, NextResponse } from "next/server";
import connectDB from "../../../../../lib/mongodb";
import Request from "../../../../../models/request";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { event } = await req.json();

    const newRequest = await Request.create({ event }); // status will default to "pending"
    return NextResponse.json(newRequest, { status: 201 });
  } catch (err) {
    const error = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ message: "Failed to create request", error }, { status: 500 });
  }
}
