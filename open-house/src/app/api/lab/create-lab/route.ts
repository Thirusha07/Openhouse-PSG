
import { NextRequest, NextResponse } from "next/server";
import connectDB from "../../../../../lib/mongodb";
import Lab from "../../../../../models/lab";

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    // For Next.js App Router, we need to handle FormData differently
    const formData = await req.formData();
    console.log("Received form data");
    
    // Log keys available in formData for debugging
    console.log("FormData keys:", Array.from(formData.keys()));
    
    // Get form fields
    const labName = formData.get('labName') as string;
    const department = formData.get('department') as string;
    const description = formData.get('description') as string;
    const imageFile = formData.get('image') as File;
    
    // Validate fields
    if (!labName || !department || !description) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }
    
    // Validate image
    if (!imageFile) {
      return NextResponse.json(
        { error: "Image file is required" },
        { status: 400 }
      );
    }
    
    // Get image data as ArrayBuffer
    const imageBuffer = await imageFile.arrayBuffer();
    
    // Convert to Buffer for Node.js fs operations and base64 conversion
    const buffer = Buffer.from(imageBuffer);
    
    // Convert to base64 for storage
    const base64Image = buffer.toString("base64");
    const mimetype = imageFile.type;
    
    // Connect to database
    await connectDB();
    
    // Create the lab entry
    const lab = await Lab.create({
      labName,
      departmentName: department,
      description,
      image: `data:${mimetype};base64,${base64Image}`,
    });
    
    // Return success response
    return NextResponse.json(
      { success: true, message: "Lab created successfully", lab },
      { status: 201 }
    );
    
  } catch (error: any) {
    console.error("Error in create-lab API:", error);
    return NextResponse.json(
      { error: "Internal server error", message: error.message },
      { status: 500 }
    );
  }
}