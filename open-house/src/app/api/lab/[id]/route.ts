// import { NextRequest, NextResponse } from "next/server";
// import connectDB from "../../../../../lib/mongodb";
// import Lab from "../../../../../models/lab";


// interface Params {
//   params: {
//     id: string;
//   };
// }

// // UPDATE a lab
// export async function PUT(req: NextRequest, { params }: Params) {
//   try {
//     await connectDB();
//     const { id } = params;
//     const data = await req.json();

//     const updated = await Lab.findByIdAndUpdate(id, data, { new: true });
//     if (!updated) {
//       return NextResponse.json({ message: "Lab not found" }, { status: 404 });
//     }

//     return NextResponse.json(updated);
//   } catch (err) {
//     const error = err instanceof Error ? err.message : "Unknown error";
//     return NextResponse.json({ message: "Failed to update lab", error }, { status: 500 });
//   }
// }

// // DELETE a lab
// export async function DELETE(_req: NextRequest, { params }: Params) {
//   try {
//     await connectDB();
//     const { id } = params;

//     const deleted = await Lab.findByIdAndDelete(id);
//     if (!deleted) {
//       return NextResponse.json({ message: "Lab not found" }, { status: 404 });
//     }

//     return NextResponse.json({ message: "Lab deleted successfully" });
//   } catch (err) {
//     const error = err instanceof Error ? err.message : "Unknown error";
//     return NextResponse.json({ message: "Failed to delete lab", error }, { status: 500 });
//   }
// }

import { NextRequest, NextResponse } from "next/server";
import connectDB from "../../../../../lib/mongodb";
import Lab from "../../../../../models/lab";

// UPDATE a lab
export async function PUT(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    const { id } = await context.params;
    const data = await req.json();

    const updated = await Lab.findByIdAndUpdate(id, data, { new: true });
    if (!updated) {
      return NextResponse.json({ message: "Lab not found" }, { status: 404 });
    }

    return NextResponse.json(updated);
  } catch (err) {
    const error = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ message: "Failed to update lab", error }, { status: 500 });
  }
}

// DELETE a lab
export async function DELETE(_req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    const { id } = await  context.params;

    const deleted = await Lab.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json({ message: "Lab not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Lab deleted successfully" });
  } catch (err) {
    const error = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ message: "Failed to delete lab", error }, { status: 500 });
  }
}
