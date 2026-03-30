import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const { name, size } = data;

    if (!name) {
      return NextResponse.json({ error: 'Invalid metadata' }, { status: 400 });
    }

    // This endpoint handles the 'metadata handshake' for uploaded videos.
    // In a full production app, this would register the file in a database.
    return NextResponse.json({
      success: true,
      message: 'Metadata handshake complete',
      name: name,
      size: size,
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
  }
}
