import redirectIfLoginNeeded from 'core/utils/redirectIfLoginNeeded';
import SettingsPage from 'features/home/pages/SettingsPage';

export default async function Page() {
  await redirectIfLoginNeeded();

  return <SettingsPage />;
}
