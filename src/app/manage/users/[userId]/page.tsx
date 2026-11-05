import { headers } from 'next/headers';
import { NoSsr } from '@mui/material';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

import ManageUsersLayout from 'features/manage/layouts/ManageUsersLayout';
import redirectIfLoginNeeded from 'core/utils/redirectIfLoginNeeded';
import ManageUserPage, {
  ManageUserError,
  ManageUserSkeleton,
} from 'features/manage/pages/ManageUserPage';
import BackendApiClient from 'core/api/client/BackendApiClient';
import { ZetkinUser } from 'utils/types/zetkin';

type Props = {
  params: Promise<{
    userId: number;
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

  const headersList = await headers();
  const headersEntries = headersList.entries();
  const headersObject = Object.fromEntries(headersEntries);
  const apiClient = new BackendApiClient(headersObject);

  const pathname = headersList.get('x-requested-path') || '';

  const { userId: visitedUserId } = await params;
  const visitedUser = await apiClient.get<ZetkinUser>(
    `/api/users/${visitedUserId}`
  );

  return (
    <ManageUsersLayout
      pathname={pathname}
      title={`${visitedUser.first_name} ${visitedUser.last_name}`}
      visitedUser={visitedUser}
    >
      {/*Enables client side resource loading via suspense*/}
      <NoSsr>
        <ErrorBoundary fallback={<ManageUserError />}>
          <Suspense fallback={<ManageUserSkeleton />}>
            <ManageUserPage userId={visitedUserId} />
          </Suspense>
        </ErrorBoundary>
      </NoSsr>
    </ManageUsersLayout>
  );
}
