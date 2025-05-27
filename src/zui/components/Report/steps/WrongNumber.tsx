import { FC } from 'react';

import { ReportType } from '..';
import ZUIButton from 'zui/components/ZUIButton';
import { Msg, useMessages } from 'core/i18n';
import messageIds from 'zui/l10n/messageIds';
import StepBase from './StepBase';

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
    <StepBase
      state="active"
      title={<Msg id={messageIds.report.steps.wrongNumber.question.title} />}
    >
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
    </StepBase>
  );
};

export default WrongNumber;
