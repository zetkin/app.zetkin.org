import { Box, Stack } from '@mui/system';

import ImportChangeTracker from './importChangeTracker';
import messageIds from 'features/import/l10n/messageIds';
import { Msg } from 'core/i18n';
import { Typography } from '@mui/material';
import PeopleCounter, { COUNT_STATUS } from './PeopleCounter';

const Validation = () => {
  return (
    <Box mt={3} width="50%">
      <Typography sx={{ mb: 2 }} variant="h5">
        <Msg id={messageIds.validation.pendingChanges} />
      </Typography>
      <Stack spacing={2}>
        <Stack direction="row" spacing={2}>
          <PeopleCounter count={22} status={COUNT_STATUS.CREATED} />
          <PeopleCounter count={100} status={COUNT_STATUS.UPDATED} />
        </Stack>
        <ImportChangeTracker count={2} fieldName={'First name'} />
        <ImportChangeTracker count={4} fieldName={'Last name'} />
        {/* <AddedTagsTracker count={2000} fieldName={'Tag'} tags={tags} /> */}
        <ImportChangeTracker count={2080} fieldName={'Organization'} />
      </Stack>
    </Box>
  );
};

export default Validation;
