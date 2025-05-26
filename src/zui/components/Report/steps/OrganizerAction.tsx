import { FC } from 'react';
import { Stack } from '@mui/system';

import { ReportType } from '..';
import ZUIText from 'zui/components/ZUIText';
import ZUIButtonGroup from 'zui/components/ZUIButtonGroup';
import messageIds from 'zui/l10n/messageIds';
import { Msg, useMessages } from 'core/i18n';

type Props = {
  onReportUpdate: (updatedReport: ReportType) => void;
  report: ReportType;
};

const OrganizerAction: FC<Props> = ({ onReportUpdate, report }) => {
  const messages = useMessages(messageIds);
  return (
    <Stack gap="0.5rem">
      <ZUIText variant="headingMd">
        <Msg id={messageIds.report.steps.organizerAction.question.title} />
      </ZUIText>
      <ZUIButtonGroup
        buttons={[
          {
            label: messages.report.steps.organizerAction.question.yesButton(),
            onClick: () =>
              onReportUpdate({
                ...report,
                organizerActionNeeded: true,
                step: 'orgLog',
              }),
          },
          {
            label: messages.report.steps.organizerAction.question.noButton(),
            onClick: () =>
              onReportUpdate({
                ...report,
                organizerActionNeeded: false,
                step: 'callerLog',
              }),
          },
        ]}
        fullWidth
        variant="secondary"
      />
    </Stack>
  );
};

export default OrganizerAction;
