import { NextResponse } from "next/server";
import connectDB from "../../../../../lib/mongodb";
import Schedule from "../../../../../models/schedule";


export async function GET() {
  try {
    await connectDB();

    const schedules = await Schedule.find({}).lean();


    return NextResponse.json({
      success: true,
      schedules
    });
  } catch (error) {
    console.error("Fetch Schedules Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch schedules" },
      { status: 500 }
    );
  }
}
