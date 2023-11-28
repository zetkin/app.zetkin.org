import { Box, Stack, Typography } from '@mui/material';

import AddedOrgs from './AddedOrgs';
import AddedTags from './AddedTags';
import ChangedFields from './ChangedFields';
import CreatedAndUpdated from './CreatedAndUpdated';
import messageIds from 'features/import/l10n/messageIds';
import { Msg } from 'core/i18n';
import useImportAlert from 'features/import/hooks/useImportAlert';
import useImportStep from '../hooks/useImportStep';
import { useNumericRouteParams } from 'core/hooks';
import ImportAlert, { ALERT_STATUS } from './ImportAlert';

interface ImportStatusProps {
  onClickBack: () => void;
}

const ImportStatus = ({ onClickBack }: ImportStatusProps) => {
  const { orgId } = useNumericRouteParams();

  const fake = {
    summary: {
      membershipsCreated: {
        byOrganization: {
          1: 10,
          2: 10,
          4: 10,
          7: 10,
        },
        total: 60,
      },
      peopleCreated: {
        total: 60,
      },
      peopleUpdated: {
        byField: {
          date_of_birth: 25,
          email: 10,
          first_name: 25,
          join_date: 20,
          last_name: 20,
        },
        total: 100,
      },
      tagsCreated: {
        byTag: {
          11: 20,
          12: 20,
          9: 20,
        },
        total: 60,
      },
    },
  };
  const importAlert = useImportAlert('error');
  const { addedTags, orgsWithNewPeople } = useImportStep(orgId, fake.summary);

  return (
    <Box
      display="flex"
      flexDirection="column"
      mt={2}
      sx={{ overflowY: 'auto' }}
    >
      <ImportAlert alert={importAlert} onClickBack={onClickBack} />
      {importAlert.status !== ALERT_STATUS.INFO && (
        <>
          <Typography sx={{ fontWeight: 500, my: 2 }} variant="h4">
            <Msg id={messageIds.importStatus.completedChanges} />
          </Typography>
          <CreatedAndUpdated summary={fake.summary} />
          <Stack spacing={2} sx={{ mt: 2 }}>
            <ChangedFields
              changedFields={fake.summary.peopleUpdated.byField}
              orgId={orgId}
            />
            <AddedTags
              addedTags={addedTags}
              numPeopleWithTagsAdded={fake.summary.tagsCreated.total}
            />
            <AddedOrgs
              numPeopleWithOrgsAdded={fake.summary.membershipsCreated.total}
              orgsWithNewPeople={orgsWithNewPeople}
            />
          </Stack>
        </>
      )}
    </Box>
  );
};

export default ImportStatus;
