import { headers } from 'next/headers';
import { NoSsr } from '@mui/material';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

import ManageUserLayout from 'features/manage/layouts/ManageUserLayout';
import redirectIfLoginNeeded from 'core/utils/redirectIfLoginNeeded';
import ManageUserPage, {
  ManageUserError,
  ManageUserSkeleton,
} from 'features/manage/pages/ManageUserPage';
import BackendApiClient from 'core/api/client/BackendApiClient';
import { ZetkinUser } from 'utils/types/zetkin';

type Props = {
  params: Promise<{
    userId: string;
  }>;
};

export default async function Page({ params }: Props) {
  const visitingUser = await redirectIfLoginNeeded(
    { allowUnverified: false },
    2
  );
  if (!visitingUser.is_superuser) {
    return null; // handled by layout
  }

  const { userId: visitedUserIdStr } = await params;
  const visitedUserId = parseInt(visitedUserIdStr);
  if (!isFinite(visitedUserId) || isNaN(visitedUserId)) {
    return null;
  }

  const headersList = await headers();
  const headersEntries = headersList.entries();
  const headersObject = Object.fromEntries(headersEntries);
  const apiClient = new BackendApiClient(headersObject);

  const pathname = headersList.get('x-requested-path') || '';

  const visitedUser = await apiClient.get<ZetkinUser>(
    `/api/users/${visitedUserId}`
  );

  return (
    <ManageUserLayout
      pathname={pathname}
      title={`${visitedUser.first_name} ${visitedUser.last_name}`}
      userId={visitedUserId}
    >
      {/*Enables client side resource loading via suspense*/}
      <NoSsr>
        <ErrorBoundary fallback={<ManageUserError />}>
          <Suspense fallback={<ManageUserSkeleton />}>
            <ManageUserPage userId={visitedUserId} />
          </Suspense>
        </ErrorBoundary>
      </NoSsr>
    </ManageUserLayout>
  );
}
