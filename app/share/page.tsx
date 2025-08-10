// app/share/page.tsx (Server page, decrypt on server)
import ClientShare from '@/components/ClientShare'; // Client component for handling user interaction

export default function Share({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) {
  const data64 = typeof searchParams.data === 'string' 
    ? searchParams.data 
    : Array.isArray(searchParams.data) 
      ? searchParams.data[0] || '' 
      : '';

  return <ClientShare data64={data64}/>;
}