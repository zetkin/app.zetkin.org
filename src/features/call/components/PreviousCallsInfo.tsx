import { FC } from 'react';
import { Box, useMediaQuery } from '@mui/material';
import { Theme, useTheme } from '@mui/material/styles';
import { AccessTime, CallMade, CallMissedOutgoing } from '@mui/icons-material';

import ZUIDateTime from 'zui/ZUIDateTime';
import ZUIText from 'zui/components/ZUIText';
import ZUIPersonAvatar from 'zui/components/ZUIPersonAvatar';
import { ZetkinCall } from '../types';
import ZUIDivider from 'zui/components/ZUIDivider';
import ZUIIcon from 'zui/components/ZUIIcon';

type PreviousCallsInfoProps = {
  call: ZetkinCall;
};

const PreviousCallsInfo: FC<PreviousCallsInfoProps> = ({ call }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const fullName = call.caller.name;
  const [callerFirstName, ...rest] = fullName.split(' ');
  const callerLastName = rest.join(' ');
  const callLog = call.target.call_log ?? [];
  const infoIndent = `calc(1.25rem + 0.5rem)`; //calculation: 1.25 of icon space + 0.5 of margin

  const renderCallStatus = (
    call: ZetkinCall,
    index: number,
    totalPreviousCalls: number
  ) => {
    let icon = null;
    let label = '';
    let color;
    let additionalInfo = null;

    if (call.state === 1) {
      icon = <ZUIIcon color="success" icon={CallMade} size="small" />;
      label = 'Success';
      color = (theme: Theme) => ({ color: theme.palette.success.main });
    } else if (call.state === 11) {
      icon = <ZUIIcon color="danger" icon={CallMissedOutgoing} size="small" />;
      label = 'No response';
      color = (theme: Theme) => ({ color: theme.palette.error.main });
      if (call.message_to_organizer) {
        additionalInfo = <ZUIText>{call.message_to_organizer}</ZUIText>;
      }
    } else if (call.state === 21) {
      icon = <ZUIIcon color="danger" icon={CallMissedOutgoing} size="small" />;
      label = 'Wrong number';
      color = (theme: Theme) => ({ color: theme.palette.error.main });
      if (call.message_to_organizer) {
        additionalInfo = <ZUIText>Note: {call.message_to_organizer}</ZUIText>;
      }
    } else if (
      call.state === 12 ||
      call.state === 13 ||
      call.state === 14 ||
      call.state === 15
    ) {
      icon = <ZUIIcon color="warning" icon={AccessTime} size="small" />;
      label = call.state == 15 ? 'Message left' : 'Not available';
      color = (theme: Theme) => ({ color: theme.palette.warning.main });
      if (call.call_back_after) {
        additionalInfo = (
          <ZUIText>
            Call {call.target.first_name} back after:{' '}
            <ZUIDateTime datetime={call.call_back_after} />
          </ZUIText>
        );
      }
    }

    return (
      <>
        <Box key={call.id}>
          <Box
            alignItems="center"
            display="flex"
            justifyContent="space-between"
            sx={color}
          >
            <Box alignItems="center" display="flex" gap={1} sx={color}>
              {icon}
              <ZUIText color="inherit">{label}</ZUIText>
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
            <Box ml={infoIndent}>
              <ZUIText color="secondary">
                <ZUIDateTime datetime={call.update_time} />
              </ZUIText>
            </Box>
          )}

          {additionalInfo && (
            <Box display="flex" ml={infoIndent}>
              {additionalInfo}
            </Box>
          )}
        </Box>
        {index < totalPreviousCalls - 1 && <ZUIDivider />}
      </>
    );
  };
  return (
    <>
      <ZUIText variant="headingMd">Previous Calls</ZUIText>
      {callLog.map((call, index) =>
        renderCallStatus(call, index, callLog.length)
      )}
    </>
  );
};

export default PreviousCallsInfo;
