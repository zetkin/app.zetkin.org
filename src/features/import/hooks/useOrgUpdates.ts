import { FakeDataType } from '../components/Validation';
import getAddedOrgsSummary from '../utils/getAddedOrgsSummary';
import useOrganizations from 'features/organizations/hooks/useOrganizations';

export default function useOrgUpdates(
  membershipsCreated: FakeDataType['summary']['membershipsCreated']
) {
  const organizations = useOrganizations().data ?? [];

  const addedOrgsSummary = getAddedOrgsSummary(membershipsCreated);
  const orgsWithNewPeople = organizations.filter((organization) =>
    addedOrgsSummary.orgs.some((orgId) => orgId == organization.id.toString())
  );

  return {
    numPeopleWithOrgsAdded: membershipsCreated.total,
    orgsWithNewPeople,
  };
}
