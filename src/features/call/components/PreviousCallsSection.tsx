import { useRouter } from 'next/navigation';
import { Box } from '@mui/material';

import useCallMutations from '../hooks/useCallMutations';
import useOutgoingCalls from '../hooks/useOutgoingCalls';
import ZUIPersonAvatar from 'zui/components/ZUIPersonAvatar';
import ZUIText from 'zui/components/ZUIText';
import ZUIButton from 'zui/components/ZUIButton';
import { labels, colors } from './PreviousCallsInfo';
import ZUIDateTime from 'zui/ZUIDateTime';
import ZUIDivider from 'zui/components/ZUIDivider';

type PreviousCallsSectionProps = {
  assingmentId: number;
  onClose: () => void;
  orgId: number;
  showUnfinishedCalls: boolean;
};

const PreviousCallsSection: React.FC<PreviousCallsSectionProps> = ({
  assingmentId,
  onClose,
  orgId,
  showUnfinishedCalls,
}) => {
  assingmentId;
  const { deleteCall, switchCurrentCall } = useCallMutations(orgId);
  const router = useRouter();
  const outgoingCalls = useOutgoingCalls();
  const previousCallsList = outgoingCalls.filter((call) => call.state !== 0);
  const unfinishedCallList = outgoingCalls.filter((call) => call.state === 0);
  return (
    <Box>
      {showUnfinishedCalls &&
        unfinishedCallList.map((call) => (
          <>
            <Box key={call.id} sx={{ my: 2 }}>
              <Box
                alignItems="center"
                display="flex"
                gap={1}
                justifyContent="space-between"
              >
                <Box alignItems="center" display="flex" gap={1}>
                  <ZUIPersonAvatar
                    firstName={call.target.first_name}
                    id={call.target.id}
                    lastName={call.target.last_name}
                    size="medium"
                  />

                  <ZUIText noWrap variant="bodyMdSemiBold">
                    {call.target.first_name + ' ' + call.target.last_name}
                  </ZUIText>
                </Box>
                <Box>
                  <ZUIButton
                    label="Abandon"
                    onClick={() => {
                      deleteCall(call.id);
                      if (unfinishedCallList.length <= 1) {
                        router.push(`/call/${assingmentId}`);
                      }
                      onClose();
                    }}
                    variant="tertiary"
                  />
                  <ZUIButton
                    label="Switch to"
                    onClick={() => {
                      switchCurrentCall(call);
                      onClose();
                    }}
                    variant="primary"
                  />
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
            <Box alignItems="center" display="flex" gap={1}>
              <ZUIPersonAvatar
                firstName={call.target.first_name}
                id={call.target.id}
                lastName={call.target.last_name}
                size="medium"
              />

              <ZUIText noWrap variant="bodyMdSemiBold">
                {call.target.first_name + ' ' + call.target.last_name}
              </ZUIText>
            </Box>

            <ZUIButton
              label="Log another call"
              onClick={() => {
                switchCurrentCall(call);
                onClose();
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
