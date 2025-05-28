import { FC } from 'react';
import { Stack } from '@mui/material';

import { Report } from '..';
import ZUIButton from 'zui/components/ZUIButton';
import { Msg, useMessages } from 'core/i18n';
import messageIds from 'features/call/l10n/messageIds';
import StepBase from './StepBase';

type Props = {
  onReportUpdate: (updatedReport: Report) => void;
  phoneAndAltPhone: { altPhone: string; phone: string };
  report: Report;
};

const WrongNumber: FC<Props> = ({
  onReportUpdate,
  report,
  phoneAndAltPhone,
}) => {
  const messages = useMessages(messageIds);
  return (
    <StepBase
      state="active"
      title={<Msg id={messageIds.report.steps.wrongNumber.question.title} />}
    >
      <Stack sx={{ alignItems: 'flex-start', gap: '0.5rem' }}>
        <ZUIButton
          label={phoneAndAltPhone.phone}
          onClick={() =>
            onReportUpdate({
              ...report,
              organizerActionNeeded: true,
              step: 'organizerLog',
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
              step: 'organizerLog',
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
              step: 'organizerLog',
              wrongNumber: 'both',
            })
          }
          variant="secondary"
        />
      </Stack>
    </StepBase>
  );
};

export default WrongNumber;
