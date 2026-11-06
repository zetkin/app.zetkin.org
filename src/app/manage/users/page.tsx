import { NoSsr } from '@mui/material';
import { ErrorBoundary } from 'react-error-boundary';

import redirectIfLoginNeeded from 'core/utils/redirectIfLoginNeeded';
import ManageUsersPage, {
  ManageUsersError,
} from 'features/manage/pages/ManageUsersPage';

export default async function Page() {
  const user = await redirectIfLoginNeeded({ allowUnverified: false }, 2);
  if (!user.is_superuser) {
    return null; // handled by layout
  }

  return (
    <NoSsr>
      <ErrorBoundary fallback={<ManageUsersError />}>
        <ManageUsersPage />
      </ErrorBoundary>
    </NoSsr>
  );
}
