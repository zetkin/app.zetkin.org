import { redirect } from 'next/navigation';

import redirectIfLoginNeeded from 'core/utils/redirectIfLoginNeeded';

export default async function Page() {
  const user = await redirectIfLoginNeeded({ allowUnverified: false }, 2);
  if (!user.is_superuser) {
    return null; // handled by layout
  }

  redirect('/manage/users');
}
