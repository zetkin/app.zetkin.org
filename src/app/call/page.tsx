import { redirect } from 'next/navigation';
import { Metadata } from 'next';

import CallPage from 'features/call/pages/CallPage';
import HomeThemeProvider from 'features/home/components/HomeThemeProvider';
import redirectIfLoginNeeded from 'core/utils/redirectIfLoginNeeded';

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata(): Promise<Metadata> {
  return {
    icons: [{ url: '/logo-zetkin.png' }],
    title: 'Call',
  };
}

export default async function Page({ searchParams }: Props) {
  await redirectIfLoginNeeded();

  const assignmentId = (await searchParams).assignment;

  if (!assignmentId) {
    return redirect('/my');
  }

  return (
    <HomeThemeProvider>
      <CallPage assignmentId={parseInt(assignmentId as string)} />
    </HomeThemeProvider>
  );
}
