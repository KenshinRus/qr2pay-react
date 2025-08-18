// app/share/page.tsx (Server page, decrypt on server)
import ClientShare from '@/components/ClientShare'; // Client component for handling user interaction
import { decrypt } from '@/lib/actions';
import type { Metadata } from 'next';

// Force dynamic rendering since we use searchParams
export const dynamic = 'force-dynamic';

export async function generateMetadata({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}): Promise<Metadata> {
  try {
    const sp = (await searchParams) ?? {};
    const raw = sp.data as string | string[] | undefined;
    const data64 = Array.isArray(raw) ? raw[0] ?? '' : raw ?? '';
    
    if (data64) {
      const details = await decrypt(data64);
      
      if (details?.headerTag) {
        return {
          title: `QR to Pay share for ${details.accountOwner}`,
        };
      }
    }
  } catch (error) {
    console.error('Error in generateMetadata:', error);
  }
  
  return {
    title: 'QR to Pay',
  };
}

export default async function Share({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = (await searchParams) ?? {};
  const raw = sp.data as string | string[] | undefined;
  const data64 = Array.isArray(raw) ? raw[0] ?? '' : raw ?? '';

  return <ClientShare data64={data64} />;
}