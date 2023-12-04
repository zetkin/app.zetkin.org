import getAddedOrgsSummary from '../utils/getAddedOrgsSummary';
import { useAppSelector } from 'core/hooks';
import useOrganizations from 'features/organizations/hooks/useOrganizations';
import useTags from 'features/tags/hooks/useTags';
import { ZetkinTag } from 'utils/types/zetkin';

export default function useImportSummary(orgId: number) {
  const summary = useAppSelector((state) => state.import.importResult).summary;
  const tags = useTags(orgId).data ?? [];
  const organizations = useOrganizations().data ?? [];

  const { tagged, addedToOrg } = summary;

  const addedTags = Object.keys(tagged.byTag).reduce((acc: ZetkinTag[], id) => {
    const tag = tags.find((tag) => tag.id === parseInt(id));
    if (tag) {
      return acc.concat(tag);
    }
    return acc;
  }, []);

  const addedOrgsSummary = getAddedOrgsSummary(addedToOrg);
  const orgsWithNewPeople = organizations.filter((organization) =>
    addedOrgsSummary.orgs.some((orgId) => orgId == organization.id.toString())
  );

  return { addedTags, orgsWithNewPeople, summary };
}
