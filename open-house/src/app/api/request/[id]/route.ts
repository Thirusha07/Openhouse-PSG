import { NextRequest, NextResponse } from "next/server";
import connectDB from "../../../../../lib/mongodb";
import Request from "../../../../../models/request";

// PATCH /api/request/[id]
export async function PATCH(req: NextRequest, { params }: { params: Promise< { id: string }> }) {
  try {
    await connectDB();
    const { id } = await params; // Get the id from params
    const { status } = await req.json();

    // Validate status
    if (!["accepted", "declined", "pending"].includes(status)) {
      return NextResponse.json({ message: "Invalid status" }, { status: 400 });
    }

    // Update the request status
    const updated = await Request.findByIdAndUpdate(id, { status }, { new: true });
    if (!updated) {
      return NextResponse.json({ message: "Request not found" }, { status: 404 });
    }

    return NextResponse.json(updated);
  } catch (err) {
    const error = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ message: "Failed to update status", error }, { status: 500 });
  }
}
