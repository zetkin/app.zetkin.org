import { Typography } from '@mui/material';
import { Box, Stack } from '@mui/system';

import AddedTagsTracker from '../validation/AddedTagsTracker';
import { getOrgsStates } from 'features/import/utils/getOrgsStates';
import ImportChangeTracker from '../validation/importChangeTracker';
import { Msg } from 'core/i18n';
import { useNumericRouteParams } from 'core/hooks';
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

  return (
    <Box mt={2}>
      <ImportAlert
        msg={'Error!'}
        status={ALERT_STATUS.ERROR}
        title={'This is error!'}
      />
      <Typography sx={{ fontWeight: 500, my: 2 }} variant="h4">
        <Msg id={messageIds.importStatus.completedChanges} />
      </Typography>
      <Stack spacing={2}>
        <Stack direction="row" spacing={2}>
          <PeopleCounter changedNum={22} status={COUNT_STATUS.CREATED} />
          <PeopleCounter changedNum={100} status={COUNT_STATUS.UPDATED} />
        </Stack>
        <ImportChangeTracker
          fields={fake.summary.peopleUpdated.byField}
          orgId={orgId}
        />
        <AddedTagsTracker
          createdTags={fake.summary.tagsCreated}
          orgId={orgId}
        />
        <ImportChangeTracker orgId={orgId} orgsStates={orgsStates} />
      </Stack>
    </Box>
  );
};

export default ImportStatus;
