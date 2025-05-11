import { NextResponse } from "next/server";
import connectDB from "../../../../../lib/mongodb";
import Schedule from "../../../../../models/schedule";

export async function POST(req: Request) {
  try {
    await connectDB();
    const { date, capacity } = await req.json();

    // Normalize date to match any schedule on the same day
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const existing = await Schedule.findOne({ date: { $gte: startOfDay, $lte: endOfDay } });
    if (existing) {
      return NextResponse.json({ success: false, message: "Schedule already exists for this date" }, { status: 400 });
    }

    const schedule = await Schedule.create({ date, capacity });
    return NextResponse.json({ success: true, schedule }, { status: 201 });
  } catch (err) {
    // Handle the error properly
    if (err instanceof Error) {
      return NextResponse.json({ message: "Failed to create schedule", error: err.message }, { status: 500 });
    } else {
      // In case the error isn't an instance of Error
      return NextResponse.json({ message: "Failed to create schedule", error: "Unknown error" }, { status: 500 });
    }
  }
}
