import { NextResponse } from 'next/server';

interface GenerateRoomResponse {
  roomName: string;
  password: string;
}

export async function POST(request: Request) {
  try {
    const { roomName }: { roomName: string } = await request.json();

    // Validate request payload
    if (!roomName) {
      return NextResponse.json({ error: 'Room name is required' }, { status: 400 });
    }

    // Generate a 6-digit password
    const generatePassword = () => Math.floor(100000 + Math.random() * 900000).toString();
    const password = generatePassword();

    // Prepare response object
    const response: GenerateRoomResponse = {
      roomName,
      password
    };

    // Return response
    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error('Error generating room:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
