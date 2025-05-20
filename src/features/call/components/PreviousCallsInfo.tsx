import { FC } from 'react';
import { Box, Theme } from '@mui/material';
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

type PreviousCallsInfoProps = {
  call: ZetkinCall;
};

const PreviousCallsInfo: FC<PreviousCallsInfoProps> = ({ call }) => {
  const isMobile = useIsMobile();
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
        additionalInfo = <ZUIText>Note: {call.message_to_organizer}</ZUIText>;
      }
    } else if (call.state === 21) {
      icon = <ZUIIcon color="danger" icon={TurnSlightLeft} size="small" />;
      label = 'Wrong number';
      color = (theme: Theme) => ({ color: theme.palette.error.main });
      if (call.message_to_organizer) {
        additionalInfo = <ZUIText>Note: {call.message_to_organizer}</ZUIText>;
      }
    } else if (call.state === 12) {
      icon = <ZUIIcon color="danger" icon={KeyboardTab} size="small" />;
      label = 'Line busy';
      color = (theme: Theme) => ({ color: theme.palette.error.main });
      if (call.message_to_organizer) {
        additionalInfo = <ZUIText>Note: {call.message_to_organizer}</ZUIText>;
      }
    } else if (call.state === 15) {
      icon = <ZUIIcon color="warning" icon={Voicemail} size="small" />;
      label = 'Left voice mail';
      color = (theme: Theme) => ({ color: theme.palette.warning.main });
      if (call.message_to_organizer) {
        additionalInfo = <ZUIText>Note: {call.message_to_organizer}</ZUIText>;
      }
    } else if (call.state === 14) {
      icon = <ZUIIcon color="warning" icon={AccessTime} size="small" />;
      label = 'No time to talk';
      color = (theme: Theme) => ({ color: theme.palette.warning.main });
      if (call.message_to_organizer) {
        additionalInfo = <ZUIText>Note: {call.message_to_organizer}</ZUIText>;
      }
      if (call.call_back_after) {
        additionalInfo = (
          <ZUIText>
            Call {call.target.first_name} back after:{' '}
            <ZUIDateTime datetime={call.call_back_after} />
          </ZUIText>
        );
      }
    } else if (call.state === 13) {
      icon = (
        <ZUIIcon color="warning" icon={RemoveCircleOutline} size="small" />
      );
      label = 'Unavailable to talk';
      color = (theme: Theme) => ({ color: theme.palette.warning.main });
      if (call.call_back_after) {
        additionalInfo = (
          <ZUIText>
            Call {call.target.first_name} back after:{' '}
            <ZUIDateTime datetime={call.call_back_after} />
          </ZUIText>
        );
      }
    } else {
      return null;
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
      <ZUIText variant="headingMd">Previous calls</ZUIText>
      {call.target.call_log.length > 0 &&
        callLog.map((call, index) =>
          renderCallStatus(call, index, callLog.length)
        )}

      {call.target.call_log.length == 0 && (
        <ZUIText color="secondary">Never called</ZUIText>
      )}
    </>
  );
};

export default PreviousCallsInfo;
