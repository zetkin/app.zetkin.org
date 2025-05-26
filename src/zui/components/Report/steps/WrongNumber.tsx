import { FC } from 'react';
import { Stack } from '@mui/material';

import { ReportType } from '..';
import ZUIButton from 'zui/components/ZUIButton';
import ZUIText from 'zui/components/ZUIText';
import { Msg, useMessages } from 'core/i18n';
import messageIds from 'zui/l10n/messageIds';

type Props = {
  onReportUpdate: (updatedReport: ReportType) => void;
  phoneAndAltPhone: { altPhone: string; phone: string };
  report: ReportType;
};

const WrongNumber: FC<Props> = ({
  onReportUpdate,
  report,
  phoneAndAltPhone,
}) => {
  const messages = useMessages(messageIds);
  return (
    <Stack gap="0.5rem" sx={{ alignItems: 'flex-start' }}>
      <ZUIText variant="headingMd">
        <Msg id={messageIds.report.steps.wrongNumber.question.title} />
      </ZUIText>
      <ZUIButton
        label={phoneAndAltPhone.phone}
        onClick={() =>
          onReportUpdate({
            ...report,
            organizerActionNeeded: true,
            step: 'orgLog',
            wrongNumber: 'phone',
          })
        }
        variant="secondary"
      />
      <ZUIButton
        label={phoneAndAltPhone.altPhone}
        onClick={() =>
          onReportUpdate({
            ...report,
            organizerActionNeeded: true,
            step: 'orgLog',
            wrongNumber: 'altPhone',
          })
        }
        variant="secondary"
      />
      <ZUIButton
        label={messages.report.steps.wrongNumber.question.bothButton()}
        onClick={() =>
          onReportUpdate({
            ...report,
            organizerActionNeeded: true,
            step: 'orgLog',
            wrongNumber: 'both',
          })
        }
        variant="secondary"
      />
    </Stack>
  );
};

export default WrongNumber;
