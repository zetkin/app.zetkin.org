import { Box, Stack, Typography } from '@mui/material';

import AddedOrgs from '../AddedOrgs';
import AddedTags from '../AddedTags';
import ChangedFields from '../ChangedFields';
import CreatedAndUpdated from '../CreatedAndUpdated';
import ImportFooter from '../../ImportFooter';
import ImportHeader from '../../ImportHeader';
import messageIds from 'features/import/l10n/messageIds';
import { useNumericRouteParams } from 'core/hooks';
import useStatusReport from '../../../../hooks/useStatusReport';
import ImportAlert, { ALERT_STATUS } from '../ImportAlert';
import { Msg, useMessages } from 'core/i18n';

interface StatusReportProps {
  onClickBack: () => void;
  onClose: () => void;
  onDone: () => void;
}

const StatusReport = ({ onClickBack, onClose, onDone }: StatusReportProps) => {
  const messages = useMessages(messageIds);
  const { orgId } = useNumericRouteParams();
  const { addedTags, alert, orgsWithNewPeople, summary } =
    useStatusReport(orgId);

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
      overflow="hidden"
    >
      <Box display="flex" flexDirection="column" overflow="hidden">
        <ImportHeader onClose={onClose} />
        <Box display="flex" flexDirection="column" sx={{ overflowY: 'scroll' }}>
          <Box paddingY={2}>
            <ImportAlert alert={alert} onClickBack={onClickBack} />
          </Box>
          {alert.status !== ALERT_STATUS.INFO && (
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
            </>
          )}
        </Box>
      </Box>
      <ImportFooter
        onClickPrimary={onDone}
        onClickSecondary={onClickBack}
        primaryButtonDisabled={false}
        primaryButtonMsg={
          alert.status == ALERT_STATUS.INFO
            ? messages.actionButtons.close()
            : messages.actionButtons.done()
        }
        secondaryButtonMsg={
          alert.status == ALERT_STATUS.ERROR
            ? messages.actionButtons.back()
            : undefined
        }
      />
    </Box>
  );
};

export default StatusReport;
