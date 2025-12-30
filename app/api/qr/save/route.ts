import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import { saveQRCode } from '@/lib/db/qr-repository';

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { encryptedPayload, nickname } = body;

    if (!encryptedPayload || typeof encryptedPayload !== 'string') {
      return NextResponse.json(
        { error: 'Invalid payload' },
        { status: 400 }
      );
    }

    const savedQR = saveQRCode(userId, encryptedPayload, nickname);

    return NextResponse.json({
      success: true,
      data: savedQR
    }, { status: 201 });

  } catch (error) {
    console.error('Error saving QR code:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
