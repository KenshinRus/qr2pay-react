import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { getUserQRCodes } from '@/lib/db/qr-repository';
import ManageQRList from '@/components/ManageQRList';

export default async function ManagePage() {
  const { userId } = await auth();

  if (!userId) {
    redirect('/');
  }

  const qrCodes = getUserQRCodes(userId);

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Manage Your QR Codes</h1>
      <ManageQRList initialQRCodes={qrCodes} />
    </div>
  );
}
