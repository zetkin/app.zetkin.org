import { defaultFetch } from '.';
import { ZetkinMembership } from 'types/zetkin';

export default function getUserMemberships(fetch = defaultFetch) {
  return async (): Promise<ZetkinMembership[]> => {
    const res = await fetch('/users/me/memberships');
    const resData = await res.json();
    return resData.data;
  };
}
