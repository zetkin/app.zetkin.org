import { notFound, redirect } from 'next/navigation';
import { Metadata } from 'next';
import { headers } from 'next/headers';

import redirectIfLoginNeeded from 'core/utils/redirectIfLoginNeeded';
import { CALL, hasFeature } from 'utils/featureFlags';
import BackendApiClient from 'core/api/client/BackendApiClient';
import { ZetkinCallAssignment } from 'utils/types/zetkin';

type Props = {
  params: {
    callAssId: string;
  };
};

export async function generateMetadata(): Promise<Metadata> {
  return {
    icons: [{ url: '/logo-zetkin.png' }],
    title: 'Call',
  };
}

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

  if (hasFeature(CALL, assignment.organization.id, process.env)) {
    return redirect(`/call?assignment=${params.callAssId}`);
  } else {
    const callUrl = process.env.ZETKIN_GEN2_CALL_URL;
    const assignmentUrl = `${callUrl}/assignments/${params.callAssId}/call`;
    redirect(assignmentUrl);
  }
}
