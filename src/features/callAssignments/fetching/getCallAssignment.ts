import { defaultFetch } from '../../../utils/fetching';
import { ZetkinCallAssignment } from '../../../utils/types/zetkin';

const getCallAssignment = (
  orgId: string,
  assignmentId: string,
  fetch = defaultFetch
) => {
  return async (): Promise<ZetkinCallAssignment> => {
    const res = await fetch(`/orgs/${orgId}/call_assignments/${assignmentId}`);
    const body = await res.json();
    return body?.data;
  };
};

export default getCallAssignment;
