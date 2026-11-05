import { headers } from 'next/headers';
import { NoSsr } from '@mui/material';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

import redirectIfLoginNeeded from 'core/utils/redirectIfLoginNeeded';
import ManageUserLayout from 'features/manage/layouts/ManageUserLayout';
import ManageUsersPage, {
  ManageUsersSkeleton,
  ManageUsersError,
} from 'features/manage/pages/ManageUsersPage';

export default async function Page() {
  const user = await redirectIfLoginNeeded({ allowUnverified: false }, 2);
  if (!user.is_superuser) {
    return null; // handled by layout
  }

  const headersList = await headers();
  const pathname = headersList.get('x-requested-path') || '';

  return (
    <ManageUserLayout pathname={pathname} title={'Users'}>
      {/*Enables client side resource loading via suspense*/}
      <NoSsr>
        <ErrorBoundary fallback={<ManageUsersError />}>
          <Suspense fallback={<ManageUsersSkeleton />}>
            <ManageUsersPage />
          </Suspense>
        </ErrorBoundary>
      </NoSsr>
    </ManageUserLayout>
  );
}
