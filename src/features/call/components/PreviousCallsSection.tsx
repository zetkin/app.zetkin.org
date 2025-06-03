import { Box } from '@mui/material';
import { FC } from 'react';

import useCallMutations from '../hooks/useCallMutations';
import useOutgoingCalls from '../hooks/useOutgoingCalls';
import ZUIPersonAvatar from 'zui/components/ZUIPersonAvatar';
import ZUIText from 'zui/components/ZUIText';
import ZUIButton from 'zui/components/ZUIButton';
import ZUIDateTime from 'zui/ZUIDateTime';
import ZUIDivider from 'zui/components/ZUIDivider';
import { labels, colors } from './PreviousCallsInfo';
import { ZetkinCall } from '../types';

type PreviousCallsSectionProps = {
  assingmentId: number;
  onClose?: () => void;
  onSwitchCall?: () => void;
  orgId: number;
  searchTerm?: string;
  showUnfinishedCalls: boolean;
};

const PreviousCallsSection: FC<PreviousCallsSectionProps> = ({
  assingmentId,
  onClose,
  onSwitchCall,
  orgId,
  searchTerm,
  showUnfinishedCalls,
}) => {
  assingmentId;
  const { deleteCall, switchCurrentCall } = useCallMutations(orgId);
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

  const previousCallsList = outgoingCalls.filter(
    (call) => call.state !== 0 && matchesSearch(call)
  );
  const unfinishedCallList = outgoingCalls.filter(
    (call) => call.state === 0 && matchesSearch(call)
  );
  return (
    <Box>
      {showUnfinishedCalls &&
        unfinishedCallList.map((call) => (
          <>
            <Box key={call.id} sx={{ my: 2 }}>
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
                  sx={{ flex: 1, minWidth: 0 }}
                >
                  <Box>
                    <ZUIPersonAvatar
                      firstName={call.target.first_name}
                      id={call.target.id}
                      lastName={call.target.last_name}
                      size="medium"
                    />
                  </Box>
                  <ZUIText noWrap variant="bodyMdSemiBold">
                    {call.target.first_name + ' ' + call.target.last_name}
                  </ZUIText>
                </Box>
                <Box
                  alignItems="flex-end"
                  display="flex"
                  flexDirection="column"
                  gap={0.5}
                  justifyContent="center"
                >
                  <Box display="flex" gap={1}>
                    <ZUIButton
                      label="Abandon"
                      onClick={async () => {
                        await deleteCall(call.id);
                        if (unfinishedCallList.length <= 1) {
                          window.location.reload();
                        }
                      }}
                      variant="tertiary"
                    />
                    <ZUIButton
                      label="Switch to"
                      onClick={() => {
                        switchCurrentCall(call);
                        onClose?.();
                        onSwitchCall?.();
                      }}
                      variant="primary"
                    />
                  </Box>
                  <ZUIText color="secondary" noWrap>
                    <ZUIDateTime datetime={call.update_time} />
                  </ZUIText>
                </Box>
              </Box>
            </Box>
            <ZUIDivider />
          </>
        ))}
      {previousCallsList.map((call) => (
        <Box key={call.id} mt={1}>
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
              <Box>
                <ZUIPersonAvatar
                  firstName={call.target.first_name}
                  id={call.target.id}
                  lastName={call.target.last_name}
                  size="medium"
                />
              </Box>

              <ZUIText noWrap variant="bodyMdSemiBold">
                {call.target.first_name + ' ' + call.target.last_name}
              </ZUIText>
            </Box>

            <ZUIButton
              label="Log another call"
              onClick={() => {
                switchCurrentCall(call);
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
            my={0.5}
          >
            <ZUIText variant="bodyMdRegular">{call.target.phone}</ZUIText>
            <Box
              alignItems="center"
              display="flex"
              gap={1}
              sx={(theme) => {
                const color = colors[call.state];
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
                {labels[call.state]}
              </ZUIText>
              <ZUIText color="secondary" noWrap>
                <ZUIDateTime datetime={call.update_time} />
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
