import { Typography } from '@mui/material';
import { useState } from 'react';
import { Box, Stack } from '@mui/system';

import AddedTagsTracker from './AddedTagsTracker';
import { getOrgsStates } from 'features/import/utils/getOrgsStates';
import ImportAlert from './importAlert';
import ImportChangeTracker from './importChangeTracker';
import { Msg } from 'core/i18n';
import useAlertsStates from 'features/import/hooks/useAlertsStates';
import { useNumericRouteParams } from 'core/hooks';
import PeopleCounter, { COUNT_STATUS } from './PeopleCounter';

import messageIds from 'features/import/l10n/messageIds';

export interface FakeDataType {
  summary: {
    membershipsCreated: {
      byOrganization: {
        [key: number]: number;
      };
      total: number;
    };
    peopleCreated: {
      total: number;
    };
    peopleUpdated: {
      byField: {
        [key: string]: number;
      };
      total: number;
    };
    tagsCreated: {
      byTag: {
        [key: number]: number;
      };
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
  const [checkedIndexes, setCheckedIndexes] = useState<number[]>([]);
  const { orgId } = useNumericRouteParams();
  const alertStates = useAlertsStates(fake.summary, orgId);

  const orgsStates = getOrgsStates(fake.summary.membershipsCreated);

  const warningAlerts = alertStates.filter(
    (item) => item.alertStatus === 'warning'
  );
  const errorExists =
    alertStates.filter((item) => item.alertStatus === 'error').length > 0;

  if (
    (warningAlerts.length === checkedIndexes.length && !errorExists) ||
    alertStates.filter((item) => item.alertStatus === 'info').length > 0
  ) {
    onDisabled(false);
  } else {
    onDisabled(true);
  }

  return (
    <Box display="flex" mt={3}>
      <Box width="50%">
        <Typography sx={{ mb: 2 }} variant="h5">
          <Msg id={messageIds.validation.pendingChanges} />
        </Typography>
        <Stack spacing={2}>
          <Stack direction="row" spacing={2}>
            <PeopleCounter
              changedNum={fake.summary.peopleCreated.total}
              status={COUNT_STATUS.CREATED}
            />
            <PeopleCounter
              changedNum={fake.summary.peopleUpdated.total}
              status={COUNT_STATUS.UPDATED}
            />
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
                  onChecked={() =>
                    setCheckedIndexes((prev) => {
                      if (!checkedIndexes.includes(index)) {
                        return [...prev, index];
                      } else {
                        return checkedIndexes.filter((item) => item !== index);
                      }
                    })
                  }
                  onClickBack={() => {
                    onClickBack();
                    onDisabled(false);
                  }}
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
