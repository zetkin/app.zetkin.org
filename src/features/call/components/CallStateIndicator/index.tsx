import { Check, PhoneInTalk } from '@mui/icons-material';
import { FC, useEffect, useState } from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';

import { VoipCallState } from 'features/call/types';
import { Msg } from 'core/i18n';
import messageIds from 'features/call/l10n/messageIds';
import ZUIDuration from 'zui/ZUIDuration';

type Props = {
  startTime?: Date | null;
  state: VoipCallState;
};

const CallStateIndicator: FC<Props> = ({ state, startTime }) => {
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    setTimeout(() => {
      const now = new Date();
      const newDuration = startTime
        ? (now.getTime() - startTime.getTime()) / 1000
        : 0;
      setDuration(newDuration);
    }, 1000);
  }, [startTime, duration]);

  return (
    <Box sx={{ alignItems: 'center', display: 'flex', gap: 1 }}>
      {state == 'dialling' && (
        <>
          <CircularProgress size={18} />
          <Typography>
            <Msg id={messageIds.stateIndicator.calling} />
          </Typography>
        </>
      )}
      {state == 'connected' && (
        <>
          <PhoneInTalk color="secondary" />
          <Typography>
            <ZUIDuration
              lowerTimeUnit="seconds"
              seconds={duration}
              upperTimeUnit="hours"
            />
          </Typography>
        </>
      )}
      {state == 'hungup' && (
        <>
          <Check />
          <Typography>
            <Msg id={messageIds.stateIndicator.hungup} />
          </Typography>
        </>
      )}
    </Box>
  );
};

export default CallStateIndicator;
