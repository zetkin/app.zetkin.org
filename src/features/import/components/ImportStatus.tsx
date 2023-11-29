import { useState } from 'react';
import {
  Box,
  CircularProgress,
  Stack,
  Typography,
  useTheme,
} from '@mui/material';

import AddedOrgs from './AddedOrgs';
import AddedTags from './AddedTags';
import ChangedFields from './ChangedFields';
import CreatedAndUpdated from './CreatedAndUpdated';
import { fake } from './Validation';
import ImportFooter from './ImportFooter';
import messageIds from 'features/import/l10n/messageIds';
import useImportAlert from 'features/import/hooks/useImportAlert';
import useImportStep from '../hooks/useImportStep';
import { useNumericRouteParams } from 'core/hooks';
import ImportAlert, { ALERT_STATUS } from './ImportAlert';
import { Msg, useMessages } from 'core/i18n';

interface ImportStatusProps {
  onClickBack: () => void;
  onDone: () => void;
}

const ImportStatus = ({ onClickBack, onDone }: ImportStatusProps) => {
  const theme = useTheme();
  const messages = useMessages(messageIds);
  const { orgId } = useNumericRouteParams();
  const { addedTags, orgsWithNewPeople } = useImportStep(orgId, fake.summary);
  //TODO: get importAlert from real data
  const importAlert = useImportAlert('completed');
  //TODO: get loading status from real data
  const [loading] = useState(false);

  return (
    <>
      {loading && (
        <Box
          alignItems="center"
          display="flex"
          flexDirection="column"
          justifyContent="center"
          paddingY={4}
        >
          <CircularProgress sx={{ color: theme.palette.statusColors.blue }} />
          <Typography sx={{ color: theme.palette.text.primary }}>
            {messages.importStatus.loadingState()}
          </Typography>
        </Box>
      )}
      {!loading && (
        <Box
          display="flex"
          flexDirection="column"
          height="100%"
          overflow="hidden"
        >
          <Box
            display="flex"
            flexDirection="column"
            sx={{ overflowY: 'scroll' }}
          >
            <Box paddingY={2}>
              <ImportAlert alert={importAlert} onClickBack={onClickBack} />
            </Box>
            {importAlert.status !== ALERT_STATUS.INFO && (
              <>
                <Typography paddingBottom={2} variant="h5">
                  <Msg id={messageIds.importStatus.completedChanges} />
                </Typography>
                <CreatedAndUpdated summary={fake.summary} />
                <Stack spacing={2} sx={{ mt: 2 }}>
                  <ChangedFields
                    changedFields={fake.summary.peopleUpdated.byField}
                    orgId={orgId}
                  />
                  <AddedTags
                    addedTags={addedTags}
                    numPeopleWithTagsAdded={fake.summary.tagsCreated.total}
                  />
                  <AddedOrgs
                    numPeopleWithOrgsAdded={
                      fake.summary.membershipsCreated.total
                    }
                    orgsWithNewPeople={orgsWithNewPeople}
                  />
                </Stack>
              </>
            )}
          </Box>
          <ImportFooter
            onClickPrimary={onDone}
            onClickSecondary={onClickBack}
            primaryButtonDisabled={false}
            primaryButtonMsg={messages.actionButtons.done()}
            secondaryButtonMsg={
              importAlert.status == ALERT_STATUS.ERROR
                ? messages.actionButtons.back()
                : undefined
            }
          />
        </Box>
      )}
    </>
  );
};

export default ImportStatus;
