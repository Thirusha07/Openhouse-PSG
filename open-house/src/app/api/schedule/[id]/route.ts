import { NextResponse, NextRequest } from "next/server";
import connectDB from "../../../../../lib/mongodb";
import Schedule from "../../../../../models/schedule";
interface Params {
    params: {
      id: string;
    };
  }
export async function DELETE(req:Request, { params }:Params) {
    try {
      await connectDB();
      const { id } = params;
  
      const deleted = await Schedule.findByIdAndDelete(id);
      if (!deleted) {
        return NextResponse.json({ message: "Schedule not found" }, { status: 404 });
      }
  
      return NextResponse.json({ message: "Schedule deleted successfully" });
    } catch (err) {
      return NextResponse.json({ message: "Failed to delete schedule", error: onmessage }, { status: 500 });
    }
  }


export async function PUT(req: NextRequest, { params }: Params) {
  try {
    await connectDB();
    const { id } = params;
    const { date, capacity } = await req.json();

    const updated = await Schedule.findByIdAndUpdate(id, { date, capacity }, { new: true });
    if (!updated) {
      return NextResponse.json({ message: "Schedule not found" }, { status: 404 });
    }

    return NextResponse.json(updated);
  } catch (err) {
    const error = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ message: "Failed to update schedule", error }, { status: 500 });
  }
}
