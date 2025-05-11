import { NextResponse } from "next/server";
import connectDB from "../../../../../lib/mongodb";
import Schedule from "../../../../../models/schedule";

// Types for route params
interface Params {
  params: {
    id: string;
  };
}

// DELETE /api/schedule/[id]
export async function DELETE(_req: Request, context: { params: { id: string } }) {
  try {
    await connectDB();
    const { id } = await context.params;

    const deleted = await Schedule.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json({ message: "Schedule not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Schedule deleted successfully" });
  } catch (err) {
    const error = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ message: "Failed to delete schedule", error }, { status: 500 });
  }
}

// PUT /api/schedule/[id]
export async function PUT(req: Request, context: { params: { id: string } }) {
  try {
    await connectDB();
    const { id } = await context.params;
    const { date, capacity } = await req.json();

    const updated = await Schedule.findByIdAndUpdate(
      id,
      { date, capacity },
      { new: true }
    );
    if (!updated) {
      return NextResponse.json({ message: "Schedule not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Schedule updated successfully", schedule: updated });
  } catch (err) {
    const error = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ message: "Failed to update schedule", error }, { status: 500 });
  }
}
