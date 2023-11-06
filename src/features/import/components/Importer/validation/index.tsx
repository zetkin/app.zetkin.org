import { Typography } from '@mui/material';
import { Box, Stack } from '@mui/system';

import AddedTagsTracker from './AddedTagsTracker';
import globalMessageIds from 'core/i18n/globalMessageIds';
import ImportAlert from './importAlert';
import ImportChangeTracker from './importChangeTracker';
import messageIds from 'features/import/l10n/messageIds';
import { NATIVE_PERSON_FIELDS } from 'features/views/components/types';
import useAlertsStates from 'features/import/hooks/useAlertsStates';
import { Msg, useMessages } from 'core/i18n';
import PeopleCounter, { COUNT_STATUS } from './PeopleCounter';

interface FakeDataType {
  summary: {
    createdPeople: {
      appliedTagsCreated: { [key: number]: number };
      organizationMembershipsCreated: { [key: number]: number };
      total: number;
    };
    updatedPeople: {
      appliedTagsCreated: { [key: number]: number };
      appliedTagsUpdated: { [key: number]: number };
      fields: any;
      organizationMembershipsCreated: { [key: number]: number };
      total: number;
    };
  };
}

interface ValidationProps {
  onClickBack: () => void;
  onDisabled: (value: boolean) => void;
}

const Validation = ({ onClickBack, onDisabled }: ValidationProps) => {
  const fake = {
    summary: {
      createdPeople: {
        appliedTagsCreated: {
          11: 12,
          9: 20,
        },
        organizationMembershipsCreated: {
          4: 10,
        },
        total: 200,
      },
      updatedPeople: {
        appliedTagsCreated: {
          11: 20,
          12: 10,
        },
        appliedTagsUpdated: {
          2: 10,
        },
        fields: {
          // custom_field: 96,
          email: 15,
          first_name: 22,
          last_name: 42,
        },
        organizationMembershipsCreated: {
          1: 5,
          2: 1,
          4: 10,
          7: 10,
        },
        total: 100,
      },
    },
  };
  // const [checkedIndexes, setCheckedIndexes] = useState<number[]>([]);

  const globalMessages = useMessages(globalMessageIds);
  const message = useMessages(messageIds);

  const isEmptyObj = (obj: { [key: number]: number }) => {
    return Object.values(obj).every((value) => value === 0);
  };
  const alertStates = useAlertsStates(fake, onDisabled, onClickBack);

  const getOrgsStates = (
    createdOrgs: FakeDataType['summary']['createdPeople']['organizationMembershipsCreated'],
    updatedOrgs: FakeDataType['summary']['updatedPeople']['organizationMembershipsCreated']
  ) => {
    let resultNum = 0;
    const resultOrgs = [];
    if (!isEmptyObj(createdOrgs)) {
      const yeah = Object.values(createdOrgs).reduce(
        (acc, val) => acc + val,
        0
      );
      resultNum += yeah;
    }
    if (!isEmptyObj(updatedOrgs)) {
      resultNum += Object.values(updatedOrgs).reduce(
        (acc, val) => acc + val,
        0
      );
    }
    return { resultNum, resultOrgs };
  };

  const test = getOrgsStates(
    fake.summary.createdPeople.organizationMembershipsCreated,
    fake.summary.updatedPeople.organizationMembershipsCreated
  );

  // const createdPeopleOrgsNum = Object.values(
  //   fake.summary.createdPeople.organizationMembershipsCreated
  // ).reduce((acc, val) => acc + val, 0);

  // const updatedPeopleOrgsNum = Object.values(
  //   fake.summary.updatedPeople.organizationMembershipsCreated
  // ).reduce((acc, val) => acc + val, 0);

  // const createdOrgs = Object.keys(
  //   fake.summary.createdPeople.organizationMembershipsCreated
  // );
  // const updatedOrgs = Object.keys(
  //   fake.summary.updatedPeople.organizationMembershipsCreated
  // );

  return (
    <Box display="flex" mt={3}>
      <Box width="50%">
        <Typography sx={{ mb: 2 }} variant="h5">
          <Msg id={messageIds.validation.pendingChanges} />
        </Typography>
        <Stack spacing={2}>
          <Stack direction="row" spacing={2}>
            <PeopleCounter
              changedNum={fake.summary.createdPeople.total}
              status={COUNT_STATUS.CREATED}
            />
            <PeopleCounter
              changedNum={fake.summary.updatedPeople.total}
              status={COUNT_STATUS.UPDATED}
            />
          </Stack>
          {Object.entries(fake.summary.updatedPeople.fields).map(
            (item, index) => {
              return (
                <Box key={`tracker-${index}`}>
                  <ImportChangeTracker
                    changedNum={item[1]}
                    fieldName={globalMessages.personFields[
                      item[0] as NATIVE_PERSON_FIELDS
                    ]()}
                  />
                </Box>
              );
            }
          )}
          <AddedTagsTracker
            createdTags={fake.summary.createdPeople.appliedTagsCreated}
            updatedTags={fake.summary.updatedPeople.appliedTagsCreated}
          />
          <ImportChangeTracker
            changedNum={test.resultNum}
            fieldName={message.validation.organization()}
            orgs={test.resultOrgs}
          />
        </Stack>
      </Box>
      <Box ml={2} width="50%">
        <Typography sx={{ mb: 2 }} variant="h5">
          <Msg id={messageIds.validation.messages} />
        </Typography>
        <Stack spacing={2}>
          {alertStates.map((item, index) => {
            return (
              <Box key={`alert-${index}`}>
                <ImportAlert
                  msg={item.msg}
                  onClickBack={item?.onBack}
                  status={item.alertStatus}
                  title={item.title}
                />
              </Box>
            );
          })}
        </Stack>
      </Box>
    </Box>
  );
};

export default Validation;
