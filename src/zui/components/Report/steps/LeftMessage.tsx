import { FC } from 'react';
import { Stack } from '@mui/material';

import { ReportType } from '..';
import ZUIButtonGroup from 'zui/components/ZUIButtonGroup';
import ZUIText from 'zui/components/ZUIText';
import { Msg, useMessages } from 'core/i18n';
import messageIds from 'zui/l10n/messageIds';
import StepBase from './StepBase';

type Props = {
  onReportUpdate: (updatedReport: ReportType) => void;
  report: ReportType;
};

const LeftMessage: FC<Props> = ({ onReportUpdate, report }) => {
  const messages = useMessages(messageIds);
  return (
    <StepBase
      title={<Msg id={messageIds.report.steps.leftMessage.question.title} />}
    >
      <ZUIButtonGroup
        buttons={[
          {
            label: messages.report.steps.leftMessage.question.yesButton(),
            onClick: () =>
              onReportUpdate({
                ...report,
                leftMessage: true,
                step: 'orgAction',
              }),
          },
          {
            label: messages.report.steps.leftMessage.question.noButton(),
            onClick: () =>
              onReportUpdate({
                ...report,
                leftMessage: false,
                step: 'orgAction',
              }),
          },
        ]}
        fullWidth
        variant="secondary"
      />
    </StepBase>
  );
};

export default LeftMessage;
