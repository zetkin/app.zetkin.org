import { Box, Stack } from '@mui/system';
import { FC, useState } from 'react';
import { Typography, useTheme } from '@mui/material';

import AddedOrgs from './AddedOrgs';
import AddedTags from './AddedTags';
import ChangedFields from './ChangedFields';
import messageIds from 'features/import/l10n/messageIds';
import { Msg } from 'core/i18n';
import useAlerts from 'features/import/hooks/useAlerts';
import { useNumericRouteParams } from 'core/hooks';
import useOrgUpdates from 'features/import/hooks/useOrgUpdates';
import useTagUpdates from 'features/import/hooks/useTagUpdates';
import ImportAlert, { ALERT_STATUS } from './ImportAlert';

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

const Validation: FC<ValidationProps> = ({ onClickBack, onDisabled }) => {
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
          alt_phone: 20,
          city: 2,
          date_of_birth: 25,
          email: 10,
          first_name: 25,
          gender: 3,
          join_date: 20,
          last_name: 20,
          zip_code: 2,
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
  const theme = useTheme();
  const [checkedIndexes, setCheckedIndexes] = useState<number[]>([]);
  const { orgId } = useNumericRouteParams();
  const { numPeopleWithOrgsAdded, orgsWithNewPeople } = useOrgUpdates(
    fake.summary.membershipsCreated
  );
  const { numPeopleWithTagsAdded, addedTags } = useTagUpdates(
    orgId,
    fake.summary.tagsCreated
  );
  const alerts = useAlerts(fake.summary, orgId);

  const warningAlerts = alerts.filter(
    (alert) => alert.status === ALERT_STATUS.WARNING
  );
  const hasError =
    alerts.filter((item) => item.status === ALERT_STATUS.ERROR).length > 0;

  if (
    (warningAlerts.length === checkedIndexes.length && !hasError) ||
    alerts.filter((item) => item.status === ALERT_STATUS.INFO).length > 0
  ) {
    onDisabled(false);
  } else {
    onDisabled(true);
  }

  return (
    <Box display="flex" height="100%" mt={3}>
      <Box width="50%">
        <Typography sx={{ mb: 2 }} variant="h5">
          <Msg id={messageIds.validation.pendingChanges} />
        </Typography>
        <Box
          display="flex"
          flexDirection="column"
          height="100%"
          sx={{ mt: 2, overflowY: 'scroll' }}
        >
          <Stack direction="row" spacing={2}>
            <Box
              border={1}
              borderColor={theme.palette.grey[300]}
              borderRadius={1}
              padding={2}
              width="100%"
            >
              <Msg
                id={messageIds.validation.updateOverview.created}
                values={{
                  numPeople: fake.summary.peopleCreated.total,
                  number: (
                    <Typography
                      sx={{
                        color: theme.palette.success.main,
                      }}
                      variant="h2"
                    >
                      {fake.summary.peopleCreated.total}
                    </Typography>
                  ),
                }}
              />
            </Box>
            <Box
              border={1}
              borderColor={theme.palette.grey[300]}
              borderRadius={1}
              padding={2}
              width="100%"
            >
              <Msg
                id={messageIds.validation.updateOverview.updated}
                values={{
                  numPeople: fake.summary.peopleUpdated.total,
                  number: (
                    <Typography
                      sx={{
                        color: theme.palette.info.light,
                      }}
                      variant="h2"
                    >
                      {fake.summary.peopleUpdated.total}
                    </Typography>
                  ),
                }}
              />
            </Box>
          </Stack>
          <Stack spacing={2} sx={{ mt: 2 }}>
            <ChangedFields
              changedFields={fake.summary.peopleUpdated.byField}
              orgId={orgId}
            />
            {addedTags.length > 0 && (
              <AddedTags
                addedTags={addedTags}
                numPeopleWithTagsAdded={numPeopleWithTagsAdded}
              />
            )}
            {orgsWithNewPeople.length > 0 && (
              <AddedOrgs
                numPeopleWithOrgsAdded={numPeopleWithOrgsAdded}
                orgsWithNewPeople={orgsWithNewPeople}
              />
            )}
          </Stack>
        </Box>
      </Box>
      <Box ml={2} width="50%">
        <Typography sx={{ mb: 2 }} variant="h5">
          <Msg id={messageIds.validation.messages} />
        </Typography>
        <Box display="flex" flexDirection="column" height="100%">
          <Stack spacing={2} sx={{ overflowY: 'scroll' }}>
            {alerts.map((alert, index) => (
              <ImportAlert
                key={`alert-${index}`}
                alert={alert}
                onCheck={() =>
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
              />
            ))}
          </Stack>
        </Box>
      </Box>
    </Box>
  );
};

export default Validation;
