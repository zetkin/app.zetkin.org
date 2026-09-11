import { FC, Fragment, useState } from 'react';
import { Box, Collapse } from '@mui/material';
import {
  AccessTime,
  ExpandLess,
  ExpandMore,
  KeyboardTab,
  MessageOutlined,
  Phone,
  PhoneMissed,
  RemoveCircleOutline,
  Voicemail,
  WarningAmber,
} from '@mui/icons-material';
import { FormattedDate, FormattedTime } from 'react-intl';

import ZUIText from 'zui/components/ZUIText';
import ZUIPersonAvatar from 'zui/components/ZUIPersonAvatar';
import {
  CallState,
  callStateToString,
  FinishedCall,
  UnfinishedCall,
} from '../types';
import ZUIIcon from 'zui/components/ZUIIcon';
import { MUIIcon } from 'zui/components/types';
import { Msg, useMessages } from 'core/i18n';
import messageIds from '../l10n/messageIds';
import ZUILabel from 'zui/components/ZUILabel';
import ZUITooltip from 'zui/components/ZUITooltip';
import ZUIIconButton from 'zui/components/ZUIIconButton';
import ZUIDivider from 'zui/components/ZUIDivider';

type PreviousCallsInfoProps = {
  call: UnfinishedCall;
};

export const icons: Record<FinishedCall['state'], MUIIcon> = {
  [CallState.SUCCESSFUL]: Phone,
  [CallState.NO_PICKUP]: PhoneMissed,
  [CallState.LINE_BUSY]: KeyboardTab,
  [CallState.CALL_BACK]: AccessTime,
  [CallState.NOT_AVAILABLE]: RemoveCircleOutline,
  [CallState.LEFT_MESSAGE]: Voicemail,
  [CallState.WRONG_NUMBER]: WarningAmber,
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

const MostRecentCall: FC<{ call: FinishedCall }> = ({ call }) => {
  const fullName = call.caller.name;
  const [callerFirstName, ...rest] = fullName.split(' ');
  const callerLastName = rest.join(' ');

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 1,
        paddingBottom: 1,
      }}
    >
      <ZUIText variant="bodySmRegular">
        <FormattedTime value={call.update_time} />{' '}
        <FormattedDate dateStyle="full" value={call.update_time} />
      </ZUIText>
      <Box
        alignItems="center"
        display="flex"
        gap={1}
        sx={(theme) => {
          const color = colors[call.state];
          if (color == 'warning') {
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
        <ZUIText color="inherit" variant="bodySmRegular">
          <Msg
            id={
              messageIds.about.previousCalls.status[
                callStateToString[call.state]
              ]
            }
          />
        </ZUIText>
      </Box>
      <Box sx={{ alignItems: 'center', display: 'flex', gap: 1 }}>
        <ZUIPersonAvatar
          firstName={callerFirstName}
          id={call.caller.id}
          lastName={callerLastName}
          size="small"
        />
        <ZUIText variant="bodySmRegular">
          <Msg
            id={messageIds.about.previousCalls.calledBy}
            values={{ name: `${callerFirstName} ${callerLastName}` }}
          />
        </ZUIText>
      </Box>
      {call.notes && (
        <ZUIText variant="bodySmRegular">
          <Msg
            id={messageIds.about.previousCalls.note}
            values={{ note: call.notes }}
          />
        </ZUIText>
      )}
      {call.call_back_after && (
        <ZUIText variant="bodySmRegular">
          <Msg
            id={messageIds.about.previousCalls.callBackAfter}
            values={{
              name: call.target.first_name,
              time: (
                <>
                  <FormattedTime value={call.update_time} />{' '}
                  <FormattedDate dateStyle="full" value={call.update_time} />
                </>
              ),
            }}
          />
        </ZUIText>
      )}
    </Box>
  );
};

const PreviousCall: FC<{
  previousCall: FinishedCall;
}> = ({ previousCall }) => {
  const messages = useMessages(messageIds);
  const [showMore, setShowMore] = useState(false);

  const fullName = previousCall.caller.name;
  const [callerFirstName, ...rest] = fullName.split(' ');
  const callerLastName = rest.join(' ');

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Box
        sx={{
          alignItems: 'center',
          display: 'flex',
          gap: 1,
          justifyContent: 'space-between',
        }}
      >
        <Box
          sx={{
            alignItems: 'center',
            display: 'flex',
            gap: 1,
          }}
        >
          <ZUITooltip
            label={messages.about.previousCalls.status[
              callStateToString[previousCall.state]
            ]()}
            placement="top"
          >
            <ZUIIcon
              color={colors[previousCall.state]}
              icon={icons[previousCall.state]}
              size="small"
            />
          </ZUITooltip>
          <ZUILabel color="secondary" variant="labelMdMedium">
            <FormattedDate
              day="numeric"
              month="numeric"
              value={previousCall.update_time}
              year="2-digit"
            />{' '}
            <FormattedTime value={previousCall.update_time} />
          </ZUILabel>
          {previousCall.notes && (
            <ZUIIcon color="secondary" icon={MessageOutlined} size="small" />
          )}
        </Box>
        <ZUIIconButton
          icon={showMore ? ExpandLess : ExpandMore}
          onClick={() => setShowMore(!showMore)}
          size="small"
        />
      </Box>
      <Collapse in={showMore}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
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
            <ZUIText color="inherit" variant="bodySmRegular">
              <Msg
                id={
                  messageIds.about.previousCalls.status[
                    callStateToString[previousCall.state]
                  ]
                }
              />
            </ZUIText>
          </Box>
          <Box sx={{ alignItems: 'center', display: 'flex', gap: 1 }}>
            <ZUIPersonAvatar
              firstName={callerFirstName}
              id={previousCall.caller.id}
              lastName={callerLastName}
              size="small"
            />
            <ZUIText variant="bodySmRegular">
              <Msg
                id={messageIds.about.previousCalls.calledBy}
                values={{ name: `${callerFirstName} ${callerLastName}` }}
              />
            </ZUIText>
          </Box>
          {previousCall.notes && (
            <ZUIText variant="bodySmRegular">
              <Msg
                id={messageIds.about.previousCalls.note}
                values={{ note: previousCall.notes }}
              />
            </ZUIText>
          )}
          {previousCall.call_back_after && (
            <ZUIText variant="bodySmRegular">
              <Msg
                id={messageIds.about.previousCalls.callBackAfter}
                values={{
                  name: previousCall.target.first_name,
                  time: (
                    <>
                      <FormattedTime value={previousCall.update_time} />{' '}
                      <FormattedDate
                        dateStyle="full"
                        value={previousCall.update_time}
                      />
                    </>
                  ),
                }}
              />
            </ZUIText>
          )}
        </Box>
      </Collapse>
    </Box>
  );
};

const PreviousCallsInfo: FC<PreviousCallsInfoProps> = ({ call }) => {
  const callLog = call.target.call_log || [];

  const hasPreviousCalls = callLog.length > 0;

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 1,
        paddingBottom: 2,
      }}
    >
      <ZUIText variant="headingMd">
        <Msg id={messageIds.about.previousCalls.title} />
      </ZUIText>
      {!hasPreviousCalls && (
        <ZUIText color="secondary">
          <Msg id={messageIds.about.previousCalls.hasNoPreviousCalls} />
        </ZUIText>
      )}
      {hasPreviousCalls && (
        <Box>
          <MostRecentCall call={callLog[0]} />
          {callLog.length > 1 && <ZUIDivider />}
          {callLog.slice(1).map((previousCall, index) => {
            return (
              <Fragment key={previousCall.id}>
                <Box
                  sx={{
                    paddingBottom: index < callLog.length - 1 ? 1 : 0,
                    paddingTop: 1,
                  }}
                >
                  <PreviousCall previousCall={previousCall} />
                </Box>
                {index !== callLog.length - 1 && <ZUIDivider />}
              </Fragment>
            );
          })}
        </Box>
      )}
    </Box>
  );
};

export default PreviousCallsInfo;
