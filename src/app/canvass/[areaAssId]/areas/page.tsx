import { redirect } from 'next/navigation';

interface PageProps {
  params: {
    areaAssId: number;
  };
}

export default async function Page({ params }: PageProps) {
  const { areaAssId } = params;
  return redirect(`/canvass/${areaAssId}`);
}
