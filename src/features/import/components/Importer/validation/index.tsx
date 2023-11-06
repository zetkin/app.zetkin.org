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
          11: 20,
          9: 20,
        },
        organizationMembershipsCreated: {
          4: 10,
          7: 10,
        },
        total: 200,
      },
      updatedPeople: {
        appliedTagsCreated: {
          11: 20,
          12: 20,
        },
        appliedTagsUpdated: {
          2: 10,
        },
        fields: {
          // custom_field: 96,
          email: 22,
          first_name: 21,
          last_name: 11,
        },
        organizationMembershipsCreated: {
          1: 10,
          2: 10,
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
    return Object.keys(obj).every((value) => value.length === 0);
  };
  const alertStates = useAlertsStates(fake, onDisabled, onClickBack);

  const getOrgsStates = (
    createdOrgs: FakeDataType['summary']['createdPeople']['organizationMembershipsCreated'],
    updatedOrgs: FakeDataType['summary']['updatedPeople']['organizationMembershipsCreated']
  ) => {
    const orgs = [];
    let updatedNum = 0;

    if (!isEmptyObj(createdOrgs)) {
      updatedNum += Object.values(createdOrgs).reduce(
        (acc, val) => acc + val,
        0
      );
      orgs.push(...Object.keys(createdOrgs));
    }

    if (!isEmptyObj(updatedOrgs)) {
      updatedNum += Object.values(updatedOrgs).reduce(
        (acc, val) => acc + val,
        0
      );
      orgs.push(...Object.keys(updatedOrgs));
    }
    return { orgs, updatedNum };
  };

  const test = getOrgsStates(
    fake.summary.createdPeople.organizationMembershipsCreated,
    fake.summary.updatedPeople.organizationMembershipsCreated
  );

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
            changedNum={test.updatedNum}
            fieldName={message.validation.organization()}
            orgs={test.orgs}
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
