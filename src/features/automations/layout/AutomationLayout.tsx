import { FC, ReactNode } from 'react';
import { Box, Divider, Typography } from '@mui/material';

import SimpleLayout from 'utils/layout/SimpleLayout';
import { useNumericRouteParams } from 'core/hooks';
import useAutomation from '../hooks/useAutomation';
import AutomationStatusChip from '../components/AutomationStatusChip';
import useAutomationMutations from '../hooks/useAutomationMutations';
import ZUIEditTextinPlace from 'zui/ZUIEditTextInPlace';
import SchedulingButton from '../components/SchedulingButton';
import AutomationInterval from '../components/AutomationInterval';
import { Msg } from 'core/i18n';
import messageIds from '../l10n/messageIds';
import ZUIRelativeTime from 'zui/ZUIRelativeTime';

type Props = {
  children: ReactNode;
};

const AutomationLayout: FC<Props> = ({ children }) => {
  const { orgId, automationId } = useNumericRouteParams();
  const automation = useAutomation(orgId, automationId);
  const { updateAutomation } = useAutomationMutations(orgId, automationId);

  return (
    <SimpleLayout
      actionButtons={<SchedulingButton automation={automation} />}
      subtitle={
        <Box
          sx={{
            alignItems: 'center',
            display: 'flex',
            gap: 2,
          }}
        >
          <AutomationStatusChip automation={automation} />
          {automation.active && (
            <>
              <Divider orientation="vertical" sx={{ height: '1rem' }} />
              <Typography variant="body1">
                <AutomationInterval seconds={automation.interval} />
              </Typography>
            </>
          )}
          <Divider orientation="vertical" sx={{ height: '1rem' }} />
          <Typography color="secondary" variant="body1">
            {!automation.last_run && (
              <Msg id={messageIds.labels.lastRun.never} />
            )}
            {automation.last_run && (
              <Msg
                id={messageIds.labels.lastRun.relative}
                values={{
                  relative: <ZUIRelativeTime datetime={automation.last_run} />,
                }}
              />
            )}
          </Typography>
        </Box>
      }
      title={
        <ZUIEditTextinPlace
          onChange={(title) => updateAutomation({ title })}
          value={automation.title}
        />
      }
    >
      {children}
    </SimpleLayout>
  );
};

export default AutomationLayout;
