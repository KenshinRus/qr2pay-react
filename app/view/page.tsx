// app/view/page.tsx (Server page)
import ClientView from '@/components/ClientView';

export default async function View({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = (await searchParams) ?? {};
  const raw = sp.data as string | string[] | undefined;
  const data64 = Array.isArray(raw) ? raw[0] ?? '' : raw ?? '';

  return <ClientView data64={data64} />;
}