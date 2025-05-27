import { FC } from 'react';

import { ReportType } from '..';
import ZUIButtonGroup from 'zui/components/ZUIButtonGroup';
import messageIds from 'features/call/l10n/messageIds';
import { Msg, useMessages } from 'core/i18n';
import StepBase from './StepBase';

type Props = {
  onReportUpdate: (updatedReport: ReportType) => void;
  report: ReportType;
};

const OrganizerAction: FC<Props> = ({ onReportUpdate, report }) => {
  const messages = useMessages(messageIds);
  return (
    <StepBase
      state="active"
      title={
        <Msg id={messageIds.report.steps.organizerAction.question.title} />
      }
    >
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
    </StepBase>
  );
};

export default OrganizerAction;
