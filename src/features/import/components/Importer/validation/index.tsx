import { Typography } from '@mui/material';
import { Box, Stack } from '@mui/system';

import AddedTagsTracker from './AddedTagsTracker';
import ImportChangeTracker from './importChangeTracker';
import messageIds from 'features/import/l10n/messageIds';
import mockOrganization from 'utils/testing/mocks/mockOrganization';
import mockTag from 'utils/testing/mocks/mockTag';
import { Msg } from 'core/i18n';
import ImportAlert, { ALERT_STATUS } from './importAlert';
import PeopleCounter, { COUNT_STATUS } from './PeopleCounter';

const Validation = () => {
  const fakeData = {
    changedField: [
      { changedNum: 7, field: 'First name' },
      { changedNum: 43, field: 'Last name' },
      { changedNum: 3708, field: 'Tags', tags: [mockTag()] },
      { changedNum: 2070, field: 'Organization', orgs: [mockOrganization()] },
    ],
    createdPeople: 341,
    unselectedId: true,
    updatedPeople: 4312,
  };
  return (
    <Box display="flex" mt={3}>
      <Box width="50%">
        <Typography sx={{ mb: 2 }} variant="h5">
          <Msg id={messageIds.validation.pendingChanges} />
        </Typography>
        <Stack spacing={2}>
          <Stack direction="row" spacing={2}>
            <PeopleCounter
              changedNum={fakeData.createdPeople}
              status={COUNT_STATUS.CREATED}
            />
            <PeopleCounter
              changedNum={fakeData.updatedPeople}
              status={COUNT_STATUS.UPDATED}
            />
          </Stack>
          {fakeData.changedField.map((item) => {
            if (item.tags) {
              return (
                <AddedTagsTracker
                  changedNum={item.changedNum}
                  fieldName={item.field}
                  tags={item.tags}
                />
              );
            } else {
              return (
                <ImportChangeTracker
                  changedNum={item.changedNum}
                  fieldName={item.field}
                  orgs={item.orgs ?? undefined}
                />
              );
            }
          })}
        </Stack>
      </Box>
      <Box ml={2} width="50%">
        <Typography sx={{ mb: 2 }} variant="h5">
          <Msg id={messageIds.validation.messages} />
        </Typography>
        <ImportAlert
          msg={'warning!'}
          // eslint-disable-next-line @typescript-eslint/no-empty-function
          onClickCheckbox={() => {}}
          status={ALERT_STATUS.WARNING}
          title="hello"
        />
      </Box>
    </Box>
  );
};

export default Validation;
