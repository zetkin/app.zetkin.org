import { FC } from 'react';
import { Box, Stack, Typography } from '@mui/material';

import AddedOrgs from './AddedOrgs';
import AddedTags from './AddedTags';
import ChangedFields from './ChangedFields';
import CreatedAndUpdated from './CreatedAndUpdated';
import ImportAlert from './ImportAlert';
import ImportFooter from './ImportFooter';
import messageIds from 'features/import/l10n/messageIds';
import { useNumericRouteParams } from 'core/hooks';
import useValidationStep from '../hooks/useValidationStep';
import { Msg, useMessages } from 'core/i18n';

//TODO: Create real datatype
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

//TODO: remove and use real data from API
export const fake = {
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

interface ValidationProps {
  onClickBack: () => void;
  onImport: () => void;
}

const Validation: FC<ValidationProps> = ({ onClickBack, onImport }) => {
  const messages = useMessages(messageIds);
  const { orgId } = useNumericRouteParams();
  const {
    orgsWithNewPeople,
    addedTags,
    alerts,
    importDisabled,
    onCheckAlert,
    statusMessage,
  } = useValidationStep(orgId, fake.summary);

  return (
    <Box display="flex" flexDirection="column" height="100%" overflow="hidden">
      <Box display="flex" mt={3} overflow="hidden">
        <Box
          display="flex"
          flexDirection="column"
          sx={{ overflowY: 'scroll' }}
          width="50%"
        >
          <CreatedAndUpdated summary={fake.summary} />
          <Stack spacing={2} sx={{ mt: 2 }}>
            <ChangedFields
              changedFields={fake.summary.peopleUpdated.byField}
              orgId={orgId}
            />
            {addedTags.length > 0 && (
              <AddedTags
                addedTags={addedTags}
                numPeopleWithTagsAdded={fake.summary.tagsCreated.total}
              />
            )}
            {orgsWithNewPeople.length > 0 && (
              <AddedOrgs
                numPeopleWithOrgsAdded={fake.summary.membershipsCreated.total}
                orgsWithNewPeople={orgsWithNewPeople}
              />
            )}
          </Stack>
        </Box>
        <Box ml={2} sx={{ overflowY: 'scroll' }} width="50%">
          <Typography sx={{ mb: 2 }} variant="h5">
            <Msg id={messageIds.validation.messages} />
          </Typography>
          <Box display="flex" flexDirection="column">
            <Stack spacing={2}>
              {alerts.map((alert, index) => (
                <ImportAlert
                  key={`alert-${index}`}
                  alert={alert}
                  onCheck={() => onCheckAlert(index)}
                  onClickBack={onClickBack}
                />
              ))}
            </Stack>
          </Box>
        </Box>
      </Box>
      <ImportFooter
        onClickPrimary={onImport}
        onClickSecondary={onClickBack}
        primaryButtonDisabled={importDisabled}
        primaryButtonMsg={messages.actionButtons.import()}
        secondaryButtonMsg={messages.actionButtons.back()}
        statusMessage={statusMessage}
      />
    </Box>
  );
};

export default Validation;
