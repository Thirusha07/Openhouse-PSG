import { NextRequest, NextResponse } from "next/server";
import connectDB from "../../../../../lib/mongodb";
import Event from "../../../../../models/event";


export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();

    const event = await Event.create(body);
    return NextResponse.json(event, { status: 201 });
  } catch (err) {
    const error = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ message: "Failed to create event", error }, { status: 500 });
  }
}
