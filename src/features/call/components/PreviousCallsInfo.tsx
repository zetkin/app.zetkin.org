import { FC } from 'react';
import { Box } from '@mui/material';
import { Theme } from '@mui/material/styles';
import { AccessTime, CallMade, CallMissedOutgoing } from '@mui/icons-material';

import ZUIDateTime from 'zui/ZUIDateTime';
import ZUIText from 'zui/components/ZUIText';
import ZUIPersonAvatar from 'zui/components/ZUIPersonAvatar';
import { ZetkinCall } from '../types';
import ZUIDivider from 'zui/components/ZUIDivider';

type PreviousCallsInfoProps = {
  call: ZetkinCall;
};

const PreviousCallsInfo: FC<PreviousCallsInfoProps> = ({ call }) => {
  const fullName = call.caller.name;
  const [callerFirstName, ...rest] = fullName.split(' ');
  const callerLastName = rest.join(' ');

  const renderCallStatus = (
    call: ZetkinCall,
    index: number,
    totalCalls: number
  ) => {
    let icon = null;
    let label = '';
    let color;
    let additionalInfo = null;

    if (call.state === 1) {
      icon = <CallMade color="inherit" sx={{ fontSize: '1.3rem' }} />;
      label = 'Success';
      color = (theme: Theme) => ({ color: theme.palette.success.main });
    } else if (call.state === 11) {
      icon = <CallMissedOutgoing color="inherit" sx={{ fontSize: '1.3rem' }} />;
      label = 'No response';
      color = (theme: Theme) => ({ color: theme.palette.error.main });
      if (call.message_to_organizer) {
        additionalInfo = <ZUIText>{call.message_to_organizer}</ZUIText>;
      }
    } else if (call.state === 21) {
      icon = <CallMissedOutgoing color="inherit" sx={{ fontSize: '1.3rem' }} />;
      label = 'Wrong number';
      color = (theme: Theme) => ({ color: theme.palette.error.main });
      if (call.message_to_organizer) {
        additionalInfo = <ZUIText>Note: {call.message_to_organizer}</ZUIText>;
      }
    } else if (call.state === 12 || call.state === 13 || call.state === 14) {
      icon = <AccessTime color="inherit" sx={{ fontSize: '1.3rem' }} />;
      label = 'Not available';
      color = (theme: Theme) => ({ color: theme.palette.warning.dark });
      if (call.call_back_after) {
        additionalInfo = (
          <ZUIText>
            Call {call.target.first_name} back after:{' '}
            <ZUIDateTime datetime={call.call_back_after} />
          </ZUIText>
        );
      }
    } else {
      return (
        <ZUIText key={call.id}>
          Status {call.state}: {call.message_to_organizer}
        </ZUIText>
      );
    }

    return (
      <>
        <Box key={call.id}>
          <Box
            alignItems="center"
            display="flex"
            justifyContent="space-between"
          >
            <Box alignItems="center" display="flex" gap={1} sx={color}>
              {icon}
              <ZUIText color="inherit">{label}</ZUIText>
            </Box>

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
          </Box>
          {additionalInfo && <Box display="flex">{additionalInfo}</Box>}
        </Box>
        {index < totalCalls - 1 && <ZUIDivider />}
      </>
    );
  };
  const callLogs = Array.isArray(call.target.call_log)
    ? call.target.call_log
    : [];
  return (
    <>
      <ZUIText variant="headingMd">Previous Calls</ZUIText>
      {callLogs.map((call, index) =>
        renderCallStatus(call, index, callLogs.length)
      )}
    </>
  );
};

export default PreviousCallsInfo;
