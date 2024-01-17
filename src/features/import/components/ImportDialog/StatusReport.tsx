import { Box, Typography } from '@mui/material';

import ImpactSummary from './elements/ImpactSummary';
import ImportFooter from './elements/ImportFooter';
import ImportHeader from './elements/ImportHeader';
import messageIds from 'features/import/l10n/messageIds';
import { useNumericRouteParams } from 'core/hooks';
import useStatusReport from '../../hooks/useStatusReport';
import ImportAlert, { ALERT_STATUS } from './elements/ImportAlert';
import { Msg, useMessages } from 'core/i18n';

interface StatusReportProps {
  onClickBack: () => void;
  onClose: () => void;
  onDone: () => void;
}

const StatusReport = ({ onClickBack, onClose, onDone }: StatusReportProps) => {
  const messages = useMessages(messageIds);
  const { orgId } = useNumericRouteParams();
  const { alert, summary } = useStatusReport();
  const fullHeight = alert.status != ALERT_STATUS.INFO;

  return (
    <Box
      display="flex"
      flexDirection="column"
      height={fullHeight ? '90vh' : ''}
      justifyContent="space-between"
      overflow="hidden"
    >
      <Box display="flex" flexDirection="column" overflow="hidden">
        <ImportHeader onClose={onClose} />
        <Box display="flex" flexDirection="column" sx={{ overflowY: 'auto' }}>
          <Box paddingY={2}>
            <ImportAlert alert={alert} onClickBack={onClickBack} />
          </Box>
          {alert.status !== ALERT_STATUS.INFO && (
            <>
              <Typography paddingBottom={2} variant="h5">
                <Msg id={messageIds.importStatus.completedChanges} />
              </Typography>
              <ImpactSummary orgId={orgId} summary={summary} />
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
