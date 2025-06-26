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

type PreviousCallsSectionProps = {
  assingmentId: number;
  onClose?: () => void;
  onSwitchCall?: () => void;
  orgId: number;
  searchTerm?: string;
};

const PreviousCallsSection: FC<PreviousCallsSectionProps> = ({
  assingmentId,
  onClose,
  onSwitchCall,
  orgId,
  searchTerm,
}) => {
  const { deleteCall, logNewCall } = useCallMutations(orgId);
  const currentCall = useCurrentCall();
  const outgoingCalls = useOutgoingCalls();
  const search = searchTerm?.toLowerCase().trim();

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
          <Box mt={1}>
            <Box
              alignItems="flex-start"
              display="flex"
              gap={1}
              justifyContent="space-between"
              sx={{ minWidth: 0 }}
            >
              <Box
                alignItems="center"
                display="flex"
                gap={1}
                mt={1}
                sx={{ flex: 1, minWidth: 0 }}
              >
                <ZUIPersonAvatar
                  firstName={unfinishedCall.target.first_name}
                  id={unfinishedCall.target.id}
                  lastName={unfinishedCall.target.last_name}
                  size="medium"
                />

                <ZUIText noWrap variant="bodyMdSemiBold">
                  {unfinishedCall.target.first_name +
                    ' ' +
                    unfinishedCall.target.last_name}
                </ZUIText>
              </Box>
              <Box
                alignItems="flex-end"
                display="flex"
                flexDirection="column"
                gap={0.5}
                justifyContent="center"
                my={1}
              >
                <Box display="flex" gap={1}>
                  <ZUIButton
                    label="Abandon"
                    onClick={async () => {
                      await deleteCall(unfinishedCall.id);
                    }}
                    variant="tertiary"
                  />
                  <ZUIButton
                    label="Switch to"
                    onClick={() => {
                      logNewCall(assingmentId, unfinishedCall.target.id);
                      onClose?.();
                      onSwitchCall?.();
                    }}
                    variant="primary"
                  />
                </Box>
                <ZUIText color="secondary" noWrap>
                  <ZUIRelativeTime datetime={unfinishedCall.update_time} />
                </ZUIText>
              </Box>
            </Box>
          </Box>
          <ZUIDivider />
        </Fragment>
      ))}
      {previousCalls.map((previousCall) => (
        <Box key={previousCall.id} mt={2}>
          <Box
            alignItems="center"
            display="flex"
            justifyContent="space-between"
          >
            <Box
              alignItems="center"
              display="flex"
              gap={1}
              sx={{ flex: 1, minWidth: 0 }}
            >
              <ZUIPersonAvatar
                firstName={previousCall.target.first_name}
                id={previousCall.target.id}
                lastName={previousCall.target.last_name}
                size="medium"
              />
              <ZUIText noWrap variant="bodyMdSemiBold">
                {previousCall.target.first_name +
                  ' ' +
                  previousCall.target.last_name}
              </ZUIText>
            </Box>

            <ZUIButton
              label="Log another call"
              onClick={() => {
                logNewCall(assingmentId, previousCall.target.id);
                onClose?.();
                onSwitchCall?.();
              }}
              variant="secondary"
            />
          </Box>
          <Box
            alignItems="center"
            display="flex"
            gap={1}
            justifyContent="space-between"
            ml="2.5rem"
            my={1}
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
          <ZUIDivider />
        </Box>
      ))}
    </Box>
  );
};

export default PreviousCallsSection;
