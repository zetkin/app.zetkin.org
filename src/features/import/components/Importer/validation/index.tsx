import { Typography } from '@mui/material';
import { Box, Stack } from '@mui/system';

// import AddedTagsTracker from './AddedTagsTracker';
import globalMessageIds from 'core/i18n/globalMessageIds';
import ImportChangeTracker from './importChangeTracker';
import messageIds from 'features/import/l10n/messageIds';
import { NATIVE_PERSON_FIELDS } from 'features/views/components/types';
import ImportAlert, { ALERT_STATUS } from './importAlert';
import { Msg, useMessages } from 'core/i18n';
import PeopleCounter, { COUNT_STATUS } from './PeopleCounter';

interface ValidationProps {
  onClickBack: () => void;
  onDisabled: (value: boolean) => void;
}

const Validation = ({ onClickBack, onDisabled }: ValidationProps) => {
  const fake = {
    summary: {
      createdPeople: {
        appliedTagsCreated: {
          2: 20,
          3: 10,
        },
        organizationMembershipCreated: {
          4: 10,
        },
        total: 200,
      },
      updatedPeople: {
        appliedTagsCreated: {
          2: 20,
          3: 10,
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

  const orgsChangeSum = Object.values(
    fake.summary.updatedPeople.organizationMembershipsCreated
  ).reduce((acc, cur) => acc + cur, 0);

  const orgs = Object.keys(
    fake.summary.updatedPeople.organizationMembershipsCreated
  );

  const globalMessages = useMessages(globalMessageIds);

  const message = useMessages(messageIds);

  const getAlerts = (fake: any) => {
    const result = [];

    const fieldsWithManyChanges = Object.entries(
      fake.summary.updatedPeople.fields
    ).filter((item) => {
      const fieldValue = item[1] as number;
      return fake.summary.updatedPeople.total * 0.2 < fieldValue;
    });

    //Error when no one imported
    if (fake.createdPeople === null && fake.updatedPeople === null) {
      onDisabled(true);
      result.push({
        alertStatus: ALERT_STATUS.ERROR,
        msg: message.validation.alerts.error.desc(),
        onBack: () => {
          onClickBack();
          onDisabled(false);
        },
        title: message.validation.alerts.error.title(),
      });
    }
    //Warning when there are many changes to field
    else if (fieldsWithManyChanges.length > 0) {
      fieldsWithManyChanges.forEach((item) =>
        result.push({
          alertStatus: ALERT_STATUS.WARNING,
          msg: message.validation.alerts.warning.manyChanges.desc(),
          title: message.validation.alerts.warning.manyChanges.title({
            fieldName:
              globalMessages.personFields[item[0] as NATIVE_PERSON_FIELDS](),
          }),
        })
      );
    } else {
      result.push({
        alertStatus: ALERT_STATUS.INFO,
        msg: message.validation.alerts.info.desc(),
        title: message.validation.alerts.info.title(),
      });
    }

    return result;
  };
  const alertStates = getAlerts(fake);

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
          {/* {fakeTag.tags && (
            <AddedTagsTracker
              changedNum={fakeTag.changedNum}
              fieldName={fakeTag.field}
              tags={fakeTag.tags}
            />
          )} */}
          <ImportChangeTracker
            changedNum={orgsChangeSum}
            fieldName={message.validation.organization()}
            orgs={orgs}
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
