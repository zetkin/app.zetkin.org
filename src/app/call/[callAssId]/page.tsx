import { Box } from '@mui/material';
import { Suspense } from 'react';
import { headers } from 'next/headers';

import BackendApiClient from 'core/api/client/BackendApiClient';
import { ZetkinCallAssignment } from 'utils/types/zetkin';
import AssignmentStatsPage from 'features/call/pages/AssignmentStatsPage';
import ZUILogoLoadingIndicator from 'zui/ZUILogoLoadingIndicator';

interface PageProps {
  params: {
    callAssId: string;
  };
}

export default async function Page({ params }: PageProps) {
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
    return null;
  }

  return (
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
      <AssignmentStatsPage assignment={assignment} />
    </Suspense>
  );
}
