import { Typography } from '@mui/material';
import { useState } from 'react';
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
  onDisabled: (value: boolean) => void;
}

const Validation = ({ onClickBack, onDisabled }: ValidationProps) => {
  const fakeData = {
    changedField: [
      { changedNum: 23, field: 'First name' },
      // { id: 2, changed: ['first_name', 'org', 'email'] } ???,
      { changedNum: 11, field: 'Last name' },
      { changedNum: 25, field: 'Tags', tags: [mockTag()] },
      { changedNum: 13, field: 'Organization', orgs: [mockOrganization()] },
    ],
    createdPeople: 200,
    unSelectedId: true,
    updatedPeople: 100,
  };
  const [checked, setChecked] = useState<boolean>(false);
  const message = useMessages(messageIds);

  const getAlertContent = () => {
    //Error when no one imported
    if (
      fakeData.changedField.every((item) => item.changedNum === 0) &&
      fakeData.createdPeople + fakeData.updatedPeople === 0
    ) {
      onDisabled(true);
      return {
        alertStatus: ALERT_STATUS.ERROR,
        msg: message.validation.alerts.error.desc(),
        onBack: () => {
          onClickBack();
          onDisabled(false);
        },
        onChecked: undefined,
        title: message.validation.alerts.error.title(),
      };
    }
    //Warning when unchosen ID column
    if (fakeData.unSelectedId) {
      if (!checked) {
        onDisabled(true);
      }
      return {
        alertStatus: ALERT_STATUS.WARNING,
        msg: message.validation.alerts.warning.unselectedId.desc(),
        onBack: undefined,
        onChecked: (value: boolean) => {
          setChecked(value);
          onDisabled(!value);
        },
        title: message.validation.alerts.warning.unselectedId.title(),
      };
    }
    //Info when ready to import
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
          {fakeData.changedField.map((item, index) => {
            return (
              <Box key={`tracker-${index}`}>
                {item.tags ? (
                  <AddedTagsTracker
                    changedNum={item.changedNum}
                    fieldName={item.field}
                    tags={item.tags}
                  />
                ) : (
                  <ImportChangeTracker
                    changedNum={item.changedNum}
                    fieldName={item.field}
                    orgs={item.orgs ?? undefined}
                  />
                )}
              </Box>
            );
          })}
        </Stack>
      </Box>
      <Box ml={2} width="50%">
        <Typography sx={{ mb: 2 }} variant="h5">
          <Msg id={messageIds.validation.messages} />
        </Typography>
        <Stack spacing={2}>
          <ImportAlert
            msg={alertStates.msg}
            onChecked={alertStates?.onChecked}
            onClickBack={alertStates?.onBack}
            status={alertStates.alertStatus}
            title={alertStates.title}
          />
          {fakeData.changedField.map((item) => {
            if (fakeData.updatedPeople * 0.2 < item.changedNum) {
              return (
                <ImportAlert
                  msg={message.validation.alerts.warning.manyChanges.desc()}
                  onChecked={alertStates?.onChecked}
                  status={ALERT_STATUS.WARNING}
                  title={message.validation.alerts.warning.manyChanges.title({
                    fieldName: item.field,
                  })}
                />
              );
            }
          })}
        </Stack>
      </Box>
    </Box>
  );
};

export default Validation;
