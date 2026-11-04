import { headers } from 'next/headers';
import { NoSsr } from '@mui/material';
import { Suspense } from 'react';

import redirectIfLoginNeeded from 'core/utils/redirectIfLoginNeeded';
import ManageUsersLayout from 'features/manage/layouts/ManageUsersLayout';
import ManageUsersPage, {
  ManageUsersSkeleton,
} from 'features/manage/pages/ManageUsersPage';

export default async function Page() {
  const user = await redirectIfLoginNeeded({ allowUnverified: false }, 2);
  if (!user.is_superuser) {
    return null; // handled by layout
  }

  const headersList = await headers();
  const pathname = headersList.get('x-requested-path') || '';

  return (
    <ManageUsersLayout pathname={pathname} title={'Users'}>
      {/*Enables client side resource loading via suspense*/}
      <NoSsr>
        <Suspense fallback={<ManageUsersSkeleton />}>
          <ManageUsersPage />
        </Suspense>
      </NoSsr>
    </ManageUsersLayout>
  );
}
