import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { getUserQRCodes } from '@/lib/db/qr-repository';

export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const qrCodes = getUserQRCodes(userId);

    return NextResponse.json({
      success: true,
      data: qrCodes
    });

  } catch (error) {
    console.error('Error fetching QR codes:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
