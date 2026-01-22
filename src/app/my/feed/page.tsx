import redirectIfLoginNeeded from 'core/utils/redirectIfLoginNeeded';
import AllEventsPage from 'features/my/pages/AllEventsPage';

export default async function Page() {
  await redirectIfLoginNeeded();

  return <AllEventsPage />;
}
