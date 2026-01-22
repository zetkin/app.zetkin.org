import { FC, useEffect } from 'react';
import { Stack } from '@mui/material';
import {
  Looks3Outlined,
  LooksOneOutlined,
  LooksTwoOutlined,
} from '@mui/icons-material';

import ZUIButton from 'zui/components/ZUIButton';
import { Msg, useMessages } from 'core/i18n';
import messageIds from 'features/call/l10n/messageIds';
import StepBase from './StepBase';
import useIsMobile from 'utils/hooks/useIsMobile';
import { Report } from 'features/call/types';

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
  const isMobile = useIsMobile();
  const messages = useMessages(messageIds);

  useEffect(() => {
    const onKeyDown = (ev: KeyboardEvent) => {
      if (ev.key === '1') {
        onReportUpdate({
          ...report,
          organizerActionNeeded: true,
          step: 'organizerLog',
          wrongNumber: 'phone',
        });
      } else if (ev.key === '2') {
        onReportUpdate({
          ...report,
          organizerActionNeeded: true,
          step: 'organizerLog',
          wrongNumber: 'altPhone',
        });
      } else if (ev.key === '3') {
        onReportUpdate({
          ...report,
          organizerActionNeeded: true,
          step: 'organizerLog',
          wrongNumber: 'both',
        });
      }
    };

    window.addEventListener('keydown', onKeyDown);

    return () => {
      window.removeEventListener('keydown', onKeyDown);
    };
  }, []);

  return (
    <StepBase
      state="active"
      title={<Msg id={messageIds.report.steps.wrongNumber.question.title} />}
    >
      <Stack sx={{ alignItems: 'flex-start', gap: '0.5rem' }}>
        <ZUIButton
          endIcon={!isMobile ? LooksOneOutlined : undefined}
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
          endIcon={!isMobile ? LooksTwoOutlined : undefined}
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
          endIcon={!isMobile ? Looks3Outlined : undefined}
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
