// app/share/page.tsx (Server page, decrypt on server)
import ClientShare from '@/components/ClientShare'; // Client component for handling user interaction

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