import OrganizationsPage from 'features/home/pages/OrganizationsPage';

import redirectIfLoginNeeded from 'core/utils/redirectIfLoginNeeded';

export default async function Page() {
  await redirectIfLoginNeeded();

  return <OrganizationsPage />;
}
