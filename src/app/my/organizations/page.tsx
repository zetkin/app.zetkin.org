import redirectIfLoginNeeded from 'core/utils/redirectIfLoginNeeded';
import OrganisationsPage from 'features/home/pages/OrganisationsPage';

export default async function Page() {
  await redirectIfLoginNeeded();

  return <OrganisationsPage />;
}
