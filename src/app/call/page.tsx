import { Box } from '@mui/material';
import { redirect } from 'next/navigation';
import { Metadata } from 'next';
import { Suspense } from 'react';

import CallPage from 'features/call/pages/CallPage';
import HomeThemeProvider from 'features/home/components/HomeThemeProvider';
import redirectIfLoginNeeded from 'core/utils/redirectIfLoginNeeded';
import ZUILogoLoadingIndicator from 'zui/ZUILogoLoadingIndicator';

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
      <Suspense
        fallback={
          <Box
            sx={{
              alignItems: 'center',
              display: 'flex',
              height: '100dvh',
              justifyContent: 'center',
            }}
          >
            <ZUILogoLoadingIndicator />
          </Box>
        }
      >
        <CallPage />
      </Suspense>
    </HomeThemeProvider>
  );
}
