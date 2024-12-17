import redirectIfLoginNeeded from 'core/utils/redirectIfLoginNeeded';
import HomePage from 'features/home/pages/HomePage';

export default async function Page() {
  await redirectIfLoginNeeded();

  return <HomePage />;
}
