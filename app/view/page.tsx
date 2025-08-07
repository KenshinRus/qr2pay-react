// app/view/page.tsx (Server page)
import ClientView from '@/components/ClientView';

export default async function View({ searchParams }: { searchParams: { [key: string]: string | undefined } }) {
  const data64 = (await searchParams).data || '';

  return <ClientView data64={data64} />;
}