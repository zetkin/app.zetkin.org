import { FC } from 'react';
import { Stack } from '@mui/material';

import AddedOrgs from './AddedOrgs';
import AddedTags from './AddedTags';
import ChangedFields from './ChangedFields';
import CreatedAndUpdated from './CreatedAndUpdated';
import { PersonImportSummary } from 'features/import/utils/types';
import useSubOrganizations from 'features/organizations/hooks/useSubOrganizations';
import useTags from 'features/tags/hooks/useTags';

type Props = {
  orgId: number;
  summary: PersonImportSummary;
  tense: 'past' | 'future';
};

const ImpactSummary: FC<Props> = ({ orgId, summary, tense }) => {
  const tags = useTags(orgId).data ?? [];
  const organizations = useSubOrganizations(orgId).data ?? [];

  const { addedToOrg, tagged } = summary;

  const addedTags = tags.filter((tag) =>
    Object.keys(tagged.byTag).includes(tag.id.toString())
  );

  const orgsWithNewPeople = organizations.filter((org) =>
    Object.keys(addedToOrg.byOrg).includes(org.id.toString())
  );

  return (
    <>
      <CreatedAndUpdated summary={summary} tense={tense} />
      <Stack spacing={2} sx={{ mt: 2 }}>
        <ChangedFields
          changedFields={summary.updated.byChangedField}
          initializedFields={summary.updated.byInitializedField}
          orgId={orgId}
          tense={tense}
        />
        {addedTags.length > 0 && (
          <AddedTags
            addedTags={addedTags}
            numPeopleWithTagsAdded={summary.tagged.total}
            tense={tense}
          />
        )}
        {orgsWithNewPeople.length > 0 && (
          <AddedOrgs
            numPeopleWithOrgsAdded={summary.addedToOrg.total}
            orgsWithNewPeople={orgsWithNewPeople}
            tense={tense}
          />
        )}
      </Stack>
    </>
  );
};

export default ImpactSummary;
