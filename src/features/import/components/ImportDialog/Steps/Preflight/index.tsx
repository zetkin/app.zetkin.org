import { FC } from 'react';
import {
  Box,
  CircularProgress,
  Stack,
  Typography,
  useTheme,
} from '@mui/material';

import AddedOrgs from '../AddedOrgs';
import AddedTags from '../AddedTags';
import ChangedFields from '../ChangedFields';
import CreatedAndUpdated from '../CreatedAndUpdated';
import ImportAlert from '../ImportAlert';
import ImportFooter from '../../ImportFooter';
import ImportHeader from '../../ImportHeader';
import { ImportStep } from '../..';
import messageIds from 'features/import/l10n/messageIds';
import { useNumericRouteParams } from 'core/hooks';
import usePreflight from '../../../../hooks/usePreflight';
import { Msg, useMessages } from 'core/i18n';

interface PreflightProps {
  onClose: () => void;
  onClickBack: () => void;
  onImportDone: () => void;
  onImportStart: () => void;
}

const Preflight: FC<PreflightProps> = ({
  onClickBack,
  onClose,
  onImportDone,
  onImportStart,
}) => {
  const theme = useTheme();
  const messages = useMessages(messageIds);
  const { orgId } = useNumericRouteParams();
  const {
    orgsWithNewPeople,
    addedTags,
    alerts,
    importDisabled,
    importPeople,
    loading,
    onCheckAlert,
    statusMessage,
    summary,
  } = usePreflight(orgId);

  return (
    <Box display="flex" flexDirection="column" height="90vh">
      <ImportHeader
        activeStep={loading ? undefined : ImportStep.PREFLIGHT}
        onClose={loading ? undefined : onClose}
      />
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
          justifyContent="space-between"
          overflow="hidden"
        >
          <Box display="flex" mt={3} overflow="hidden">
            <Box
              display="flex"
              flexDirection="column"
              sx={{ overflowY: 'scroll' }}
              width="50%"
            >
              <CreatedAndUpdated summary={summary} />
              <Stack spacing={2} sx={{ mt: 2 }}>
                <ChangedFields
                  changedFields={summary.updated.byField}
                  orgId={orgId}
                />
                {addedTags.length > 0 && (
                  <AddedTags
                    addedTags={addedTags}
                    numPeopleWithTagsAdded={summary.tagged.total}
                  />
                )}
                {orgsWithNewPeople.length > 0 && (
                  <AddedOrgs
                    numPeopleWithOrgsAdded={summary.addedToOrg.total}
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
            onClickPrimary={async () => {
              onImportStart();
              await importPeople();
              onImportDone();
            }}
            onClickSecondary={onClickBack}
            primaryButtonDisabled={importDisabled}
            primaryButtonMsg={messages.actionButtons.import()}
            secondaryButtonMsg={messages.actionButtons.back()}
            statusMessage={statusMessage}
          />
        </Box>
      )}
    </Box>
  );
};

export default Preflight;
