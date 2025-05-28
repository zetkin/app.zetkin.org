import { Box } from '@mui/material';
import { headers } from 'next/headers';
import { Suspense } from 'react';
import { notFound, redirect } from 'next/navigation';

import BackendApiClient from 'core/api/client/BackendApiClient';
import CallPage from 'features/call/pages';
import HomeThemeProvider from 'features/home/components/HomeThemeProvider';
import redirectIfLoginNeeded from 'core/utils/redirectIfLoginNeeded';
import ZUILogoLoadingIndicator from 'zui/ZUILogoLoadingIndicator';
import { ZetkinCallAssignment } from 'utils/types/zetkin';
import { CALL, hasFeature } from 'utils/featureFlags';

type Props = {
  params: { callAssId: string };
};

export default async function Page({ params }: Props) {
  await redirectIfLoginNeeded();
  const headersList = headers();
  const headersEntries = headersList.entries();
  const headersObject = Object.fromEntries(headersEntries);
  const apiClient = new BackendApiClient(headersObject);
  const assignments = await apiClient.get<ZetkinCallAssignment[]>(
    '/api/users/me/call_assignments'
  );
  const assignment = assignments.find(
    (assignment) => assignment.id == parseInt(params.callAssId)
  );

  if (!assignment) {
    return notFound();
  }
  const { callAssId } = params;

  if (hasFeature(CALL, assignment.organization.id, process.env)) {
    return (
      <HomeThemeProvider>
        <Suspense
          fallback={
            <Box
              alignItems="center"
              display="flex"
              flexDirection="column"
              height="90dvh"
              justifyContent="center"
            >
              <ZUILogoLoadingIndicator />
            </Box>
          }
        >
          <CallPage callAssId={callAssId} />
        </Suspense>
      </HomeThemeProvider>
    );
  } else {
    const callUrl = process.env.ZETKIN_GEN2_CALL_URL;
    const assignmentUrl = `${callUrl}/assignments/${params.callAssId}/call`;
    redirect(assignmentUrl);
  }
}
