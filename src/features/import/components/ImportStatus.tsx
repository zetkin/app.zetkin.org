import { Box, Stack, Typography } from '@mui/material';

import AddedOrgs from './AddedOrgs';
import AddedTags from './AddedTags';
import ChangedFields from './ChangedFields';
import CreatedAndUpdated from './CreatedAndUpdated';
import ImportFooter from './ImportFooter';
import ImportHeader from './ImportHeader';
import messageIds from 'features/import/l10n/messageIds';
import useImportAlert from 'features/import/hooks/useImportAlert';
import useImportSummary from '../hooks/useImportSummary';
import { useNumericRouteParams } from 'core/hooks';
import ImportAlert, { ALERT_STATUS } from './ImportAlert';
import { Msg, useMessages } from 'core/i18n';

interface ImportStatusProps {
  onClickBack: () => void;
  onClose: () => void;
  onDone: () => void;
}

const ImportStatus = ({ onClickBack, onClose, onDone }: ImportStatusProps) => {
  const messages = useMessages(messageIds);
  const { orgId } = useNumericRouteParams();
  const { addedTags, orgsWithNewPeople, summary } = useImportSummary(orgId);

  //TODO: get importAlert from real data
  const importAlert = useImportAlert('completed');

  return (
    <Box display="flex" flexDirection="column" height="100%" overflow="hidden">
      <ImportHeader onClose={onClose} />
      <Box display="flex" flexDirection="column" sx={{ overflowY: 'scroll' }}>
        <Box paddingY={2}>
          <ImportAlert alert={importAlert} onClickBack={onClickBack} />
        </Box>
        {importAlert.status !== ALERT_STATUS.INFO && (
          <>
            <Typography paddingBottom={2} variant="h5">
              <Msg id={messageIds.importStatus.completedChanges} />
            </Typography>
            <CreatedAndUpdated summary={summary} />
            <Stack spacing={2} sx={{ mt: 2 }}>
              <ChangedFields
                changedFields={summary.updated.byField}
                orgId={orgId}
              />
              <AddedTags
                addedTags={addedTags}
                numPeopleWithTagsAdded={summary.tagged.total}
              />
              <AddedOrgs
                numPeopleWithOrgsAdded={summary.addedToOrg.total}
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
  );
};

export default ImportStatus;
