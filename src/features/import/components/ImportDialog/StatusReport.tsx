import { Box, Typography } from '@mui/material';

import ImpactSummary from './elements/ImpactSummary';
import ImportFooter from './elements/ImportFooter';
import ImportHeader from './elements/ImportHeader';
import ImportMessage from './elements/ImportMessageList/ImportMessage';
import messageIds from 'features/import/l10n/messageIds';
import { Msg, useMessages } from 'core/i18n';
import { useAppSelector, useNumericRouteParams } from 'core/hooks';

interface StatusReportProps {
  onClickBack: () => void;
  onClose: () => void;
  onDone: () => void;
}

const StatusReport = ({ onClickBack, onClose, onDone }: StatusReportProps) => {
  const messages = useMessages(messageIds);
  const { orgId } = useNumericRouteParams();

  const result = useAppSelector((state) => state.import.importResult);
  if (!result) {
    // Should never happen
    return null;
  }

  const isScheduled = result.status == 'pending';
  const isComplete = result.status == 'completed';

  return (
    <Box
      display="flex"
      flexDirection="column"
      height={isComplete ? '90vh' : ''}
      justifyContent="space-between"
      overflow="hidden"
    >
      <Box display="flex" flexDirection="column" overflow="hidden">
        <ImportHeader onClose={onClose} />
        <Box display="flex" flexDirection="column" sx={{ overflowY: 'auto' }}>
          <Box paddingY={2}>
            {result.status == 'error' && (
              <ImportMessage
                description={messages.importStatus.error.desc()}
                onClickBack={onClickBack}
                status="error"
                title={messages.importStatus.error.title()}
              />
            )}
            {result.status == 'completed' && (
              <ImportMessage
                description={messages.importStatus.completed.desc()}
                onClickBack={onClickBack}
                status="success"
                title={messages.importStatus.completed.title()}
              />
            )}
            {result.status == 'pending' && (
              <ImportMessage
                description={messages.importStatus.scheduled.desc()}
                onClickBack={onClickBack}
                status="info"
                title={messages.importStatus.scheduled.title()}
              />
            )}
          </Box>
          {result.report && (
            <>
              <Typography paddingBottom={2} variant="h5">
                <Msg id={messageIds.importStatus.completedChanges} />
              </Typography>
              <ImpactSummary
                orgId={orgId}
                summary={result.report.person.summary}
                tense={isScheduled ? 'future' : 'past'}
              />
            </>
          )}
        </Box>
      </Box>
      <ImportFooter
        onClickPrimary={onDone}
        onClickSecondary={onClickBack}
        primaryButtonDisabled={false}
        primaryButtonMsg={
          isScheduled
            ? messages.actionButtons.close()
            : messages.actionButtons.done()
        }
        secondaryButtonMsg={
          result.status == 'error' ? messages.actionButtons.back() : undefined
        }
      />
    </Box>
  );
};

export default StatusReport;
