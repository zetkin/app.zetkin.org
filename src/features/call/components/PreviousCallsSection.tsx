import { Box } from '@mui/material';
import { FC, Fragment } from 'react';

import useCallMutations from '../hooks/useCallMutations';
import useOutgoingCalls from '../hooks/useOutgoingCalls';
import ZUIPersonAvatar from 'zui/components/ZUIPersonAvatar';
import ZUIText from 'zui/components/ZUIText';
import ZUIButton from 'zui/components/ZUIButton';
import ZUIDivider from 'zui/components/ZUIDivider';
import { labels, colors } from './PreviousCallsInfo';
import { ZetkinCall } from '../types';
import ZUIRelativeTime from 'zui/ZUIRelativeTime';
import useCurrentCall from '../hooks/useCurrentCall';
import UnfinishedCall from './UnfinishedCall';
import { useMessages } from 'core/i18n';
import messageIds from '../l10n/messageIds';

type PreviousCallsSectionProps = {
  onCall: (assignmentId: number) => void;
  orgId: number;
  searchTerm?: string;
};

const PreviousCallsSection: FC<PreviousCallsSectionProps> = ({
  orgId,
  onCall,
  searchTerm,
}) => {
  const messages = useMessages(messageIds);
  const {
    abandonUnfinishedCall,
    switchToPreviousCall,
    switchToUnfinishedCall,
  } = useCallMutations(orgId);
  const currentCall = useCurrentCall();
  const outgoingCalls = useOutgoingCalls();
  const search = searchTerm?.toLowerCase().trim();

  //TODO: Use Fuse libray to fuzzy search.
  const matchesSearch = (call: ZetkinCall) => {
    if (!search) {
      return true;
    }
    const name =
      `${call.target.first_name} ${call.target.last_name}`.toLowerCase();
    const phone = call.target.phone?.toLowerCase() || '';

    const searchParts = search.split(' ').filter((part) => part !== '');

    return searchParts.every(
      (part) => name.includes(part) || phone.includes(part)
    );
  };

  const previousCalls = outgoingCalls.filter((call) => {
    const matches = matchesSearch(call);
    const isFinishedCall = call.state != 0;
    const isNotCurrentCall = currentCall ? currentCall.id != call.id : true;

    return matches && isFinishedCall && isNotCurrentCall;
  });

  const unfinishedCalls = outgoingCalls.filter((call) => {
    const matches = matchesSearch(call);
    const isUnfinishedCall = call.state == 0;
    const isNotCurrentCall = currentCall ? currentCall.id != call.id : true;

    return matches && isUnfinishedCall && isNotCurrentCall;
  });

  return (
    <Box>
      {unfinishedCalls.map((unfinishedCall) => (
        <Fragment key={unfinishedCall.id}>
          <UnfinishedCall
            onAbandonCall={() => abandonUnfinishedCall(unfinishedCall.id)}
            onSwitchToCall={() => {
              switchToUnfinishedCall(
                unfinishedCall.id,
                unfinishedCall.assignment_id
              );
              onCall(unfinishedCall.assignment_id);
            }}
            unfinishedCall={unfinishedCall}
          />
          <ZUIDivider />
        </Fragment>
      ))}
      {previousCalls.map((previousCall) => (
        <Fragment key={previousCall.id}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 0.5,
              paddingY: 1,
            }}
          >
            <Box
              sx={{
                alignItems: 'center',
                display: 'flex',
                justifyContent: 'space-between',
              }}
            >
              <Box
                sx={{
                  alignItems: 'center',
                  display: 'flex',
                  flex: 1,
                  gap: 1,
                  minWidth: 0,
                }}
              >
                <ZUIPersonAvatar
                  firstName={previousCall.target.first_name}
                  id={previousCall.target.id}
                  lastName={previousCall.target.last_name}
                  size="medium"
                />
                <ZUIText noWrap variant="bodyMdSemiBold">
                  {previousCall.target.name}
                </ZUIText>
              </Box>
              <ZUIButton
                label={messages.callLog.previousCall.logNew()}
                onClick={() => {
                  switchToPreviousCall(
                    previousCall.assignment_id,
                    previousCall.target.id
                  );
                  onCall(previousCall.assignment_id);
                }}
                size="small"
                variant="secondary"
              />
            </Box>
            <Box
              sx={{
                alignItems: 'center',
                display: 'flex',
                justifyContent: 'space-between',
                paddingLeft: 5,
              }}
            >
              <ZUIText variant="bodyMdRegular">
                {previousCall.target.phone}
              </ZUIText>
              <Box
                alignItems="center"
                display="flex"
                gap={1}
                sx={(theme) => {
                  const color = colors[previousCall.state];
                  return {
                    color:
                      color === 'warning'
                        ? theme.palette.warning.dark
                        : theme.palette[color].main,
                    minWidth: 0,
                  };
                }}
              >
                <ZUIText color="inherit" noWrap>
                  {labels[previousCall.state]}
                </ZUIText>
                <ZUIText color="secondary" noWrap>
                  <ZUIRelativeTime datetime={previousCall.update_time} />
                </ZUIText>
              </Box>
            </Box>
          </Box>
          <ZUIDivider />
        </Fragment>
      ))}
    </Box>
  );
};

export default PreviousCallsSection;
