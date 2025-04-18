import { ReactNode } from 'react';
import { notFound, redirect } from 'next/navigation';
import { headers } from 'next/headers';

import BackendApiClient from 'core/api/client/BackendApiClient';
import CallLayout from 'features/call/layouts/CallLayout';
import redirectIfLoginNeeded from 'core/utils/redirectIfLoginNeeded';
import { ZetkinCallAssignment } from 'utils/types/zetkin';
import { CALL, hasFeature } from 'utils/featureFlags';
import HomeThemeProvider from 'features/home/components/HomeThemeProvider';

type Props = {
  children?: ReactNode;
  params: { callAssId: string };
};

const CallPageLayout = async ({ children, params }: Props) => {
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
        <CallLayout callAssId={callAssId}>{children}</CallLayout>;
      </HomeThemeProvider>
    );
  } else {
    const callUrl = process.env.ZETKIN_GEN2_CALL_URL;
    const assignmentUrl = `${callUrl}/assignments/${params.callAssId}/call`;
    redirect(assignmentUrl);
  }
};

export default CallPageLayout;
