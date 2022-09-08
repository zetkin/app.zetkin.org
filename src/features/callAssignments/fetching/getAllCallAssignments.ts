import { defaultFetch } from '../../../utils/fetching';
import { ZetkinCallAssignment } from '../../../utils/types/zetkin';

export default function getAllCallAssignments(
  orgId: string,
  fetch = defaultFetch
) {
  return async (): Promise<ZetkinCallAssignment[]> => {
    const res = await fetch(`/orgs/${orgId}/call_assignments`);
    const resData = await res.json();
    return resData.data;
  };
}
