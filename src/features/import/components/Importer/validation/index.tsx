import { Typography } from '@mui/material';
import { Box, Stack } from '@mui/system';

import AddedTagsTracker from './AddedTagsTracker';
import ImportChangeTracker from './importChangeTracker';
import messageIds from 'features/import/l10n/messageIds';
import mockOrganization from 'utils/testing/mocks/mockOrganization';
import mockTag from 'utils/testing/mocks/mockTag';
import ImportAlert, { ALERT_STATUS } from './importAlert';
import { Msg, useMessages } from 'core/i18n';
import PeopleCounter, { COUNT_STATUS } from './PeopleCounter';

interface ValidationProps {
  onClickBack: () => void;
}

const Validation = ({ onClickBack }: ValidationProps) => {
  const fakeData = {
    changedField: [
      { changedNum: 23, field: 'First name' },
      { changedNum: 5, field: 'Last name' },
      { changedNum: 1, field: 'Tags', tags: [mockTag()] },
      { changedNum: 5, field: 'Organization', orgs: [mockOrganization()] },
    ],
    createdPeople: 30,
    unSelectedId: true,
    updatedPeople: 60,
  };
  const message = useMessages(messageIds);

  const getAlertContent = () => {
    //When import is empty, shows error
    if (
      fakeData.changedField.every((item) => item.changedNum === 0) &&
      fakeData.createdPeople + fakeData.updatedPeople === 0
    ) {
      return {
        alertStatus: ALERT_STATUS.ERROR,
        msg: message.validation.alerts.error.desc(),
        onBack: onClickBack,
        onChecked: undefined,
        title: message.validation.alerts.error.title(),
      };
    }
    //unchosen ID column
    if (fakeData.unSelectedId) {
      return {
        alertStatus: ALERT_STATUS.WARNING,
        msg: message.validation.alerts.warning.unselectedId.desc(),
        onBack: undefined,
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        onChecked: () => {},
        title: message.validation.alerts.warning.unselectedId.title(),
      };
    }
    return {
      alertStatus: ALERT_STATUS.INFO,
      msg: message.validation.alerts.info.desc(),
      title: message.validation.alerts.info.title(),
    };
  };
  const alertStates = getAlertContent();

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
          msg={alertStates.msg}
          onClickBack={alertStates?.onBack}
          onClickCheckbox={alertStates?.onChecked}
          status={alertStates.alertStatus}
          title={alertStates.title}
        />
      </Box>
    </Box>
  );
};

export default Validation;
