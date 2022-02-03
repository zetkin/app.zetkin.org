import { defaultFetch } from '.';
import { ZetkinCanvassAssignment } from '../types/zetkin';

export default function getAllCanvassAssignments(
  orgId: string,
  fetch = defaultFetch
) {
  return async (): Promise<ZetkinCanvassAssignment[]> => {
    const res = await fetch(`/orgs/${orgId}/canvass_assignments`);
    const resData = await res.json();
    return resData.data;
  };
}
