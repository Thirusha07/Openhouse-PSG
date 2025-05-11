import { NextRequest, NextResponse } from "next/server";
import connectDB from "../../../../../lib/mongodb";
import Event from "../../../../../models/event";

interface Params {
  id: string;
}

export async function PUT(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    const { id } = await context.params;
    const data = await req.json();

    const updated = await Event.findByIdAndUpdate(id, data, { new: true });
    if (!updated) {
      return NextResponse.json({ message: "Event not found" }, { status: 404 });
    }

    return NextResponse.json(updated);
  } catch (err) {
    const error = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ message: "Failed to update event", error }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, context: { params:Promise< Params >}) {
  try {
    await connectDB();
    const { id } = await context.params;

    const deleted = await Event.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json({ message: "Event not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Event deleted successfully" });
  } catch (err) {
    const error = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ message: "Failed to delete event", error }, { status: 500 });
  }
}
