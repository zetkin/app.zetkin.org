import { Typography } from '@mui/material';
import { Box, Stack } from '@mui/system';

import AddedTagsTracker from '../validation/AddedTagsTracker';
import { getOrgsStates } from 'features/import/utils/getOrgsStates';
import ImportChangeTracker from '../validation/importChangeTracker';
import { Msg } from 'core/i18n';
import { useNumericRouteParams } from 'core/hooks';
import useStatusAlertsStates from 'features/import/hooks/useStatusAlertStates';
import ImportAlert, { ALERT_STATUS } from '../validation/importAlert';
import PeopleCounter, { COUNT_STATUS } from '../validation/PeopleCounter';

import messageIds from 'features/import/l10n/messageIds';

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
  const orgsStates = getOrgsStates(fake.summary.membershipsCreated);
  const statusRes = useStatusAlertsStates('error');

  return (
    <Box
      display="flex"
      flexDirection="column"
      height="100%"
      mt={2}
      sx={{ overflowY: 'auto' }}
    >
      <ImportAlert
        bullets={['Hello', 'long time no see']}
        msg={statusRes.msg}
        onClickBack={onClickBack}
        status={statusRes.alertStatus}
        title={statusRes.title}
      />
      {statusRes.alertStatus !== ALERT_STATUS.INFO && (
        <>
          <Typography sx={{ fontWeight: 500, my: 2 }} variant="h4">
            <Msg id={messageIds.importStatus.completedChanges} />
          </Typography>
          <Stack direction="row" spacing={2}>
            <PeopleCounter
              changedNum={
                statusRes.alertStatus === 'error'
                  ? 0
                  : fake.summary.peopleCreated.total
              }
              status={COUNT_STATUS.CREATED}
            />
            <PeopleCounter
              changedNum={
                statusRes.alertStatus === 'error'
                  ? 0
                  : fake.summary.peopleUpdated.total
              }
              status={COUNT_STATUS.UPDATED}
            />
          </Stack>
          <Stack spacing={2} sx={{ mt: 2 }}>
            <ImportChangeTracker
              fields={fake.summary.peopleUpdated.byField}
              orgId={orgId}
              statusError={statusRes.alertStatus === ALERT_STATUS.ERROR}
            />
            <AddedTagsTracker
              createdTags={fake.summary.tagsCreated}
              orgId={orgId}
              statusError={statusRes.alertStatus === ALERT_STATUS.ERROR}
            />
            <ImportChangeTracker
              orgId={orgId}
              orgsStates={orgsStates}
              statusError={statusRes.alertStatus === ALERT_STATUS.ERROR}
            />
          </Stack>
        </>
      )}
    </Box>
  );
};

export default ImportStatus;
