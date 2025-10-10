import { redirect } from 'next/navigation';

import redirectIfLoginNeeded from 'core/utils/redirectIfLoginNeeded';

export default async function Page() {
  await redirectIfLoginNeeded();

  redirect('/my');
}
