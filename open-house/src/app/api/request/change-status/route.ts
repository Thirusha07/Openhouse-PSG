// File: src/app/api/request/change-status/route.ts

import { NextRequest, NextResponse } from 'next/server';
import connectDB from '../../../../../lib/mongodb';
import Request from '../../../../../models/request';
import Event from '../../../../../models/event';

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { requestId, eventId, status } = await req.json();

    if (!['accepted', 'declined'].includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }

    // Update the Request status
    await Request.findByIdAndUpdate(requestId, { status });

    // Optionally update the Event status or just log it
    await Event.findByIdAndUpdate(eventId, {
      $set: { updatedAt: new Date() },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Status Update Error:', error);
    return NextResponse.json(
      { error: 'Failed to update request/event status' },
      { status: 500 }
    );
  }
}
