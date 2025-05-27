import { FC } from 'react';

import { ReportType } from '..';
import ZUIButtonGroup from 'zui/components/ZUIButtonGroup';
import { Msg, useMessages } from 'core/i18n';
import messageIds from 'zui/l10n/messageIds';
import StepBase from './StepBase';

type Props = {
  firstName: string;
  onReportUpdate: (updatedReport: ReportType) => void;
  report: ReportType;
};

const CouldTalk: FC<Props> = ({ firstName, onReportUpdate, report }) => {
  const messages = useMessages(messageIds);
  return (
    <StepBase
      title={
        <Msg
          id={messageIds.report.steps.couldTalk.question.title}
          values={{ firstName }}
        />
      }
    >
      <ZUIButtonGroup
        buttons={[
          {
            label: messages.report.steps.couldTalk.question.yesButton(),
            onClick: () => {
              if (onReportUpdate) {
                onReportUpdate({
                  ...report,
                  step: 'orgAction',
                  targetCouldTalk: true,
                });
              }
            },
          },
          {
            label: messages.report.steps.couldTalk.question.noButton(),
            onClick: () => {
              if (onReportUpdate) {
                onReportUpdate({
                  ...report,
                  step: 'callBack',
                  targetCouldTalk: false,
                });
              }
            },
          },
        ]}
        fullWidth
        variant="secondary"
      />
    </StepBase>
  );
};

export default CouldTalk;
