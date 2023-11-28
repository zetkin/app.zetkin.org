import { FakeDataType } from '../components/Validation';
import getAddedOrgsSummary from '../utils/getAddedOrgsSummary';
import useOrganizations from 'features/organizations/hooks/useOrganizations';
import useTags from 'features/tags/hooks/useTags';
import { ZetkinTag } from 'utils/types/zetkin';

export default function useImportStep(
  orgId: number,
  summary: FakeDataType['summary']
) {
  const tags = useTags(orgId).data ?? [];
  const organizations = useOrganizations().data ?? [];

  const { membershipsCreated, tagsCreated } = summary;

  const addedTags = Object.keys(tagsCreated.byTag).reduce(
    (acc: ZetkinTag[], id) => {
      const tag = tags.find((tag) => tag.id === parseInt(id));
      if (tag) {
        return acc.concat(tag);
      }
      return acc;
    },
    []
  );

  const addedOrgsSummary = getAddedOrgsSummary(membershipsCreated);
  const orgsWithNewPeople = organizations.filter((organization) =>
    addedOrgsSummary.orgs.some((orgId) => orgId == organization.id.toString())
  );

  return { addedTags, orgsWithNewPeople };
}
