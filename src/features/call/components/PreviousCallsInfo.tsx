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
import {
  CallState,
  callStateToString,
  FinishedCall,
  UnfinishedCall,
} from '../types';
import ZUIDivider from 'zui/components/ZUIDivider';
import ZUIIcon from 'zui/components/ZUIIcon';
import useIsMobile from 'utils/hooks/useIsMobile';
import { MUIIcon } from 'zui/components/types';
import { Msg } from 'core/i18n';
import messageIds from '../l10n/messageIds';

type PreviousCallsInfoProps = {
  call: UnfinishedCall;
};

export const icons: Record<FinishedCall['state'], MUIIcon> = {
  [CallState.SUCCESSFUL]: CallMade,
  [CallState.NO_PICKUP]: CallMissedOutgoing,
  [CallState.LINE_BUSY]: KeyboardTab,
  [CallState.CALL_BACK]: RemoveCircleOutline,
  [CallState.NOT_AVAILABLE]: AccessTime,
  [CallState.LEFT_MESSAGE]: Voicemail,
  [CallState.WRONG_NUMBER]: TurnSlightLeft,
};

export const colors: Record<
  FinishedCall['state'],
  'success' | 'warning' | 'error'
> = {
  [CallState.SUCCESSFUL]: 'success',
  [CallState.NO_PICKUP]: 'error',
  [CallState.LINE_BUSY]: 'error',
  [CallState.CALL_BACK]: 'warning',
  [CallState.NOT_AVAILABLE]: 'warning',
  [CallState.LEFT_MESSAGE]: 'warning',
  [CallState.WRONG_NUMBER]: 'error',
};

const PreviousCallsInfo: FC<PreviousCallsInfoProps> = ({ call }) => {
  const isMobile = useIsMobile();
  const callLog = call.target.call_log || [];

  const hasPreviousCalls = callLog.length > 0;

  return (
    <>
      <ZUIText variant="headingMd">
        <Msg id={messageIds.about.previousCalls.title} />
      </ZUIText>
      {!hasPreviousCalls && (
        <ZUIText color="secondary">
          <Msg id={messageIds.about.previousCalls.hasNoPreviousCalls} />
        </ZUIText>
      )}
      {hasPreviousCalls &&
        callLog.map((previousCall, index) => {
          const fullName = previousCall.caller.name;
          const [callerFirstName, ...rest] = fullName.split(' ');
          const callerLastName = rest.join(' ');

          return (
            <Box key={previousCall.id}>
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
                      const color = colors[previousCall.state];
                      if (color == 'warning') {
                        return { color: theme.palette.warning.dark };
                      } else {
                        return { color: theme.palette[color].main };
                      }
                    }}
                  >
                    <ZUIIcon
                      color={colors[previousCall.state]}
                      icon={icons[previousCall.state]}
                      size="small"
                    />
                    <ZUIText color="inherit">
                      <Msg
                        id={
                          messageIds.about.previousCalls.status[
                            callStateToString[previousCall.state]
                          ]
                        }
                      />
                    </ZUIText>
                  </Box>
                  {isMobile ? (
                    <ZUIPersonAvatar
                      firstName={callerFirstName}
                      id={previousCall.caller.id}
                      lastName={callerLastName}
                      size="small"
                    />
                  ) : (
                    <Box alignItems="center" display="flex" gap={1}>
                      <ZUIText color="secondary">
                        <ZUIDateTime datetime={previousCall.update_time} />
                      </ZUIText>
                      <ZUIPersonAvatar
                        firstName={callerFirstName}
                        id={previousCall.caller.id}
                        lastName={callerLastName}
                        size="small"
                      />
                    </Box>
                  )}
                </Box>
                {isMobile && (
                  <Box ml="1.75rem">
                    <ZUIText color="secondary">
                      <ZUIDateTime datetime={previousCall.update_time} />
                    </ZUIText>
                  </Box>
                )}
                {previousCall.notes && (
                  <Box display="flex" ml="1.75rem">
                    <ZUIText>
                      <Msg
                        id={messageIds.about.previousCalls.note}
                        values={{ note: previousCall.notes }}
                      />
                    </ZUIText>
                  </Box>
                )}
                {previousCall.call_back_after && (
                  <Box display="flex" ml="1.75rem">
                    <ZUIText>
                      <Msg
                        id={messageIds.about.previousCalls.callBackAfter}
                        values={{
                          name: previousCall.target.first_name,
                          time: (
                            <ZUIDateTime
                              datetime={previousCall.call_back_after}
                            />
                          ),
                        }}
                      />
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
