import redirectIfLoginNeeded from 'core/utils/redirectIfLoginNeeded';
import AllEventsPage from 'features/activistPortal/pages/AllEventsPage';

export default async function Page() {
  await redirectIfLoginNeeded();

  return <AllEventsPage />;
}
