import { NextResponse } from "next/server";
import connectDB from "../../../../../lib/mongodb";
import Lab from "../../../../../models/lab";

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await connectDB();

    // Sort labs by departmentName in ascending (alphabetical) order
    const labs = await Lab.find().sort({ departmentName: 1 });

    return NextResponse.json({ success: true, labs }, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching labs:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch labs", message: error.message },
      { status: 500 }
    );
  }
}
