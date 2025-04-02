import { headers } from 'next/headers';
import { notFound } from 'next/navigation';

import AssignmentPreparePage from 'features/call/pages/AssignmentPreparePage';
import BackendApiClient from 'core/api/client/BackendApiClient';
import { ZetkinCallAssignment } from 'utils/types/zetkin';
import { CALL, hasFeature } from 'utils/featureFlags';

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
    return notFound();
  }

  if (hasFeature(CALL, assignment.organization.id, process.env)) {
    return <AssignmentPreparePage assignment={assignment} />;
  }
}
