import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import { checkQRCodeExists } from '@/lib/db/qr-repository';

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const encryptedPayload = searchParams.get('payload');

    if (!encryptedPayload || typeof encryptedPayload !== 'string') {
      return NextResponse.json(
        { error: 'Invalid payload parameter' },
        { status: 400 }
      );
    }

    const exists = checkQRCodeExists(userId, encryptedPayload);

    return NextResponse.json({
      success: true,
      exists
    });

  } catch (error) {
    console.error('Error checking QR code:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
