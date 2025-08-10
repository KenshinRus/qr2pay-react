// app/share/page.tsx (Server page, decrypt on server)
import ClientShare from '@/components/ClientShare'; // Client component for handling user interaction

export default async function Share({ searchParams }: { searchParams: { [key: string]: string | undefined } }) {
  const data64 = (await searchParams).data || '';

  return <ClientShare data64={data64}/>;
}