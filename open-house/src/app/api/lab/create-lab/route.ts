import { NextRequest, NextResponse } from "next/server";
import connectDB from "../../../../../lib/mongodb";
import Lab from "../../../../../models/lab";


export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();

    const lab = await Lab.create(body);
    return NextResponse.json(lab, { status: 201 });
  } catch (err) {
    const error = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ message: "Failed to create lab", error }, { status: 500 });
  }
}
