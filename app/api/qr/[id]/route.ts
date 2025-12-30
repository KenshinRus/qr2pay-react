import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import { deleteQRCode, updateNickname, getQRCodeById } from '@/lib/db/qr-repository';

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const qrId = parseInt(id, 10);

    if (isNaN(qrId)) {
      return NextResponse.json(
        { error: 'Invalid ID' },
        { status: 400 }
      );
    }

    const deleted = deleteQRCode(qrId, userId);

    if (!deleted) {
      return NextResponse.json(
        { error: 'QR code not found or unauthorized' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'QR code deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting QR code:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const qrId = parseInt(id, 10);

    if (isNaN(qrId)) {
      return NextResponse.json(
        { error: 'Invalid ID' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { nickname } = body;

    if (!nickname || typeof nickname !== 'string') {
      return NextResponse.json(
        { error: 'Invalid nickname' },
        { status: 400 }
      );
    }

    const updated = updateNickname(qrId, userId, nickname);

    if (!updated) {
      return NextResponse.json(
        { error: 'QR code not found or unauthorized' },
        { status: 404 }
      );
    }

    const updatedQR = getQRCodeById(qrId, userId);

    return NextResponse.json({
      success: true,
      data: updatedQR
    });

  } catch (error) {
    console.error('Error updating QR code:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
