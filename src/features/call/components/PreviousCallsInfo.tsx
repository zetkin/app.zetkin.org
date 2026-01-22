import { FC } from 'react';
import { Box } from '@mui/material';
import {
  AccessTime,
  CallMade,
  CallMissedOutgoing,
  KeyboardTab,
  RemoveCircleOutline,
  TurnSlightLeft,
  Voicemail,
} from '@mui/icons-material';

import ZUIDateTime from 'zui/ZUIDateTime';
import ZUIText from 'zui/components/ZUIText';
import ZUIPersonAvatar from 'zui/components/ZUIPersonAvatar';
import { ZetkinCall } from '../types';
import ZUIDivider from 'zui/components/ZUIDivider';
import ZUIIcon from 'zui/components/ZUIIcon';
import useIsMobile from 'utils/hooks/useIsMobile';
import { MUIIcon } from 'zui/components/types';

type PreviousCallsInfoProps = {
  call: ZetkinCall;
};

export const labels: Record<number, string> = {
  1: 'Success',
  11: 'No response',
  12: 'Line busy',
  13: 'Unavailable to talk',
  14: 'No time to talk',
  15: 'Left voice mail',
  21: 'Wrong number',
};

export const icons: Record<number, MUIIcon> = {
  1: CallMade,
  11: CallMissedOutgoing,
  12: KeyboardTab,
  13: RemoveCircleOutline,
  14: AccessTime,
  15: Voicemail,
  21: TurnSlightLeft,
};

export const colors: Record<number, 'success' | 'warning' | 'error'> = {
  1: 'success',
  11: 'error',
  12: 'error',
  13: 'warning',
  14: 'warning',
  15: 'warning',
  21: 'error',
};

const PreviousCallsInfo: FC<PreviousCallsInfoProps> = ({ call }) => {
  const isMobile = useIsMobile();
  const fullName = call.caller.name;
  const [callerFirstName, ...rest] = fullName.split(' ');
  const callerLastName = rest.join(' ');
  const callLog = call.target.call_log || [];

  const hasPreviousCalls = callLog.length > 0;

  return (
    <>
      <ZUIText variant="headingMd">Previous calls</ZUIText>
      {!hasPreviousCalls && (
        <ZUIText color="secondary">Never been called</ZUIText>
      )}
      {hasPreviousCalls &&
        callLog.map((call, index) => {
          return (
            <Box key={call.id}>
              <Box mb={1}>
                <Box
                  alignItems="center"
                  display="flex"
                  justifyContent="space-between"
                >
                  <Box
                    alignItems="center"
                    display="flex"
                    gap={1}
                    sx={(theme) => {
                      const color = colors[call.state];
                      if (color === 'warning') {
                        return { color: theme.palette.warning.dark };
                      } else {
                        return { color: theme.palette[color].main };
                      }
                    }}
                  >
                    <ZUIIcon
                      color={colors[call.state]}
                      icon={icons[call.state]}
                      size="small"
                    />
                    <ZUIText color="inherit">{labels[call.state]}</ZUIText>
                  </Box>
                  {isMobile ? (
                    <ZUIPersonAvatar
                      firstName={callerFirstName}
                      id={call.caller.id}
                      lastName={callerLastName}
                      size="small"
                    />
                  ) : (
                    <Box alignItems="center" display="flex" gap={1}>
                      <ZUIText color="secondary">
                        <ZUIDateTime datetime={call.update_time} />
                      </ZUIText>
                      <ZUIPersonAvatar
                        firstName={callerFirstName}
                        id={call.caller.id}
                        lastName={callerLastName}
                        size="small"
                      />
                    </Box>
                  )}
                </Box>
                {isMobile && (
                  <Box ml="1.75rem">
                    <ZUIText color="secondary">
                      <ZUIDateTime datetime={call.update_time} />
                    </ZUIText>
                  </Box>
                )}
                {call.message_to_organizer && (
                  <Box display="flex" ml="1.75rem">
                    <ZUIText>Note: {call.message_to_organizer}</ZUIText>
                  </Box>
                )}
                {call.call_back_after && (
                  <Box display="flex" ml="1.75rem">
                    <ZUIText>
                      Call {call.target.first_name} back after:{' '}
                      <ZUIDateTime datetime={call.call_back_after} />
                    </ZUIText>
                  </Box>
                )}
              </Box>
              {index < callLog.length - 1 && <ZUIDivider />}
            </Box>
          );
        })}
    </>
  );
};

export default PreviousCallsInfo;
