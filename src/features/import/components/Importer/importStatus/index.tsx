import { Box, Stack, Typography, useTheme } from '@mui/material';

import AddedOrgs from '../../AddedOrgs';
import AddedTags from '../../AddedTags';
import ChangedFields from '../../ChangedFields';
import messageIds from 'features/import/l10n/messageIds';
import { Msg } from 'core/i18n';
import { useNumericRouteParams } from 'core/hooks';
import useOrgUpdates from 'features/import/hooks/useOrgUpdates';
import useStatusAlertsStates from 'features/import/hooks/useStatusAlertStates';
import useTagUpdates from 'features/import/hooks/useTagUpdates';
import ImportAlert, { ALERT_STATUS } from '../../ImportAlert';

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
  const theme = useTheme();
  const alert = useStatusAlertsStates('completed');
  const { numPeopleWithOrgsAdded, orgsWithNewPeople } = useOrgUpdates(
    fake.summary.membershipsCreated
  );
  const { numPeopleWithTagsAdded, addedTags } = useTagUpdates(
    orgId,
    fake.summary.tagsCreated
  );

  return (
    <Box
      display="flex"
      flexDirection="column"
      height="100%"
      mt={2}
      sx={{ overflowY: 'auto' }}
    >
      <ImportAlert
        alert={alert}
        bullets={['Hello', 'long time no see']}
        onCheck={() => null}
        onClickBack={onClickBack}
      />
      {alert.status !== ALERT_STATUS.INFO && (
        <>
          <Typography sx={{ fontWeight: 500, my: 2 }} variant="h4">
            <Msg id={messageIds.importStatus.completedChanges} />
          </Typography>
          <Stack direction="row" spacing={2}>
            <Box
              border={1}
              borderColor={theme.palette.grey[300]}
              borderRadius={1}
              padding={2}
              width="100%"
            >
              <Msg
                id={messageIds.validation.updateOverview.created}
                values={{
                  numPeople: fake.summary.peopleCreated.total,
                  number: (
                    <Typography
                      sx={{
                        color: theme.palette.success.main,
                      }}
                      variant="h2"
                    >
                      {fake.summary.peopleCreated.total}
                    </Typography>
                  ),
                }}
              />
            </Box>
            <Box
              border={1}
              borderColor={theme.palette.grey[300]}
              borderRadius={1}
              padding={2}
              width="100%"
            >
              <Msg
                id={messageIds.validation.updateOverview.updated}
                values={{
                  numPeople: fake.summary.peopleUpdated.total,
                  number: (
                    <Typography
                      sx={{
                        color: theme.palette.info.light,
                      }}
                      variant="h2"
                    >
                      {fake.summary.peopleUpdated.total}
                    </Typography>
                  ),
                }}
              />
            </Box>
          </Stack>
          <Stack spacing={2} sx={{ mt: 2 }}>
            <ChangedFields
              changedFields={fake.summary.peopleUpdated.byField}
              orgId={orgId}
            />
            <AddedTags
              addedTags={addedTags}
              numPeopleWithTagsAdded={numPeopleWithTagsAdded}
            />
            <AddedOrgs
              numPeopleWithOrgsAdded={numPeopleWithOrgsAdded}
              orgsWithNewPeople={orgsWithNewPeople}
            />
          </Stack>
        </>
      )}
    </Box>
  );
};

export default ImportStatus;
