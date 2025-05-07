
import { NextResponse } from "next/server";
import connectDB from "../../../../../lib/mongodb";
import Schedule from "../../../../../models/schedule";

export async function POST(req:Request) {
  try {
    await connectDB();
    const { date, capacity } = await req.json();

    const existing = await Schedule.findOne({ date });
    if (existing) {
      return NextResponse.json({ message: "Schedule already exists for this date" }, { status: 400 });
    }

    const schedule = await Schedule.create({ date, capacity });
    return NextResponse.json(schedule, { status: 201 });
  } catch (err) {
    return NextResponse.json({ message: "Failed to create schedule", error: onmessage }, { status: 500 });
  }
}
