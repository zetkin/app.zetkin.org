import { FC } from 'react';
import { Stack } from '@mui/material';

import AddedOrgs from './AddedOrgs';
import AddedTags from './AddedTags';
import ChangedFields from './ChangedFields';
import CreatedAndUpdated from './CreatedAndUpdated';
import getAddedOrgsSummary from 'features/import/utils/getAddedOrgsSummary';
import { PersonImportSummary } from 'features/import/utils/types';
import useOrganizations from 'features/organizations/hooks/useOrganizations';
import useTags from 'features/tags/hooks/useTags';
import { ZetkinTag } from 'utils/types/zetkin';

type Props = {
  orgId: number;
  summary: PersonImportSummary;
};

const ImpactSummary: FC<Props> = ({ orgId, summary }) => {
  const tags = useTags(orgId).data ?? [];
  const organizations = useOrganizations().data ?? [];

  const { addedToOrg, tagged } = summary;
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
  return (
    <>
      <CreatedAndUpdated summary={summary} />
      <Stack spacing={2} sx={{ mt: 2 }}>
        <ChangedFields
          changedFields={summary.updated.byChangedField}
          initializedFields={summary.updated.byInitializedField}
          orgId={orgId}
        />
        {addedTags.length > 0 && (
          <AddedTags
            addedTags={addedTags}
            numPeopleWithTagsAdded={summary.tagged.total}
          />
        )}
        {orgsWithNewPeople.length > 0 && (
          <AddedOrgs
            numPeopleWithOrgsAdded={summary.addedToOrg.total}
            orgsWithNewPeople={orgsWithNewPeople}
          />
        )}
      </Stack>
    </>
  );
};

export default ImpactSummary;
