import { FC } from 'react';
import { Stack } from '@mui/material';

import { ReportType } from '..';
import ZUIButtonGroup from 'zui/components/ZUIButtonGroup';
import ZUIText from 'zui/components/ZUIText';
import { Msg, useMessages } from 'core/i18n';
import messageIds from 'zui/l10n/messageIds';

type Props = {
  onReportUpdate: (updatedReport: ReportType) => void;
  report: ReportType;
};

const CouldTalk: FC<Props> = ({ onReportUpdate, report }) => {
  const messages = useMessages(messageIds);
  return (
    <Stack gap="1rem">
      <ZUIText>
        <Msg id={messageIds.report.steps.couldTalk.question.title} />
      </ZUIText>
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
        variant="secondary"
      />
    </Stack>
  );
};

export default CouldTalk;
