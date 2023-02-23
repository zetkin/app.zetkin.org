import defaultFetch from '../../../utils/fetching/defaultFetch';
import { ZetkinView } from 'utils/types/zetkin';

export default function getViews(
  orgId: string,
  fetch = defaultFetch
) {
  return async (): Promise<ZetkinView[]> => {
    const viewsRes = await fetch(`/orgs/${orgId}/people/views`);
    const viewsBody = await viewsRes.json();
    return viewsBody?.data;
  };
}
