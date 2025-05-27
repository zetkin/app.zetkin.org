import { FC } from 'react';

import { ReportType } from '..';
import ZUIButtonGroup from 'zui/components/ZUIButtonGroup';
import { Msg, useMessages } from 'core/i18n';
import messageIds from 'features/call/l10n/messageIds';
import StepBase from './StepBase';

type Props = {
  onReportUpdate: (updatedReport: ReportType) => void;
  report: ReportType;
};

const LeftMessage: FC<Props> = ({ onReportUpdate, report }) => {
  const messages = useMessages(messageIds);
  return (
    <StepBase
      state="active"
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
