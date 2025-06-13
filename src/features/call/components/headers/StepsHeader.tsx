import { ArrowBackIos } from '@mui/icons-material';
import { Box } from '@mui/material';
import { FC, ReactNode, useState } from 'react';

import { ZetkinCallAssignment } from 'utils/types/zetkin';
import ZUIPersonAvatar from 'zui/components/ZUIPersonAvatar';
import ZUIText from 'zui/components/ZUIText';
import ZUIButton from 'zui/components/ZUIButton';
import SkipCallDialog from '../SkipCallDialog';
import useCallMutations from '../../hooks/useCallMutations';
import ZUIDivider from 'zui/components/ZUIDivider';
import CallSwitchModal from '../CallSwitchModal';
import ZUIBadge from 'zui/components/ZUIBadge';
import useOutgoingCalls from '../../hooks/useOutgoingCalls';
import useIsMobile from 'utils/hooks/useIsMobile';
import { ZetkinCall } from 'features/call/types';

type IconTextLinkProps = {
  icon: ReactNode;
  label: string;
  onClick: () => void;
};

const IconTextLink: FC<IconTextLinkProps> = ({ icon, label, onClick }) => {
  return (
    <Box
      alignItems="center"
      display="flex"
      gap={0.5}
      mb={1}
      minWidth={0}
      onClick={onClick}
      sx={{ cursor: 'pointer' }}
    >
      {icon}
      <ZUIText noWrap variant="bodyMdRegular">
        {label}
      </ZUIText>
    </Box>
  );
};

type StepsHeaderProps = {
  assignment: ZetkinCallAssignment;
  call: ZetkinCall;
  forwardButtonDisabled?: boolean;
  forwardButtonIsLoading?: boolean;
  onBack: () => void;
  onPrimaryAction: () => void;
  onPrimaryActionLabel: string;
  onSecondaryAction?: () => void;
  onSecondaryActionLabel?: string;
  onSwitchCall: () => void;
};

const StepsHeader: FC<StepsHeaderProps> = ({
  assignment,
  call,
  forwardButtonDisabled,
  forwardButtonIsLoading,
  onBack,
  onPrimaryAction,
  onPrimaryActionLabel,
  onSecondaryAction,
  onSecondaryActionLabel,
  onSwitchCall,
}) => {
  const { deleteCall } = useCallMutations(assignment.organization.id);
  const [showModal, setShowModal] = useState(false);
  const outgoingCalls = useOutgoingCalls();
  const unfinishedCallList = outgoingCalls.filter((call) => call.state === 0);
  const isMobile = useIsMobile();

  return (
    <>
      <Box
        sx={(theme) => ({
          backgroundColor: theme.palette.common.white,
          position: 'sticky',
          top: 0,
          zIndex: 1100,
        })}
      >
        <Box p={2}>
          {isMobile && (
            <>
              <IconTextLink
                icon={<ArrowBackIos sx={{ fontSize: 16 }} />}
                label={assignment.title}
                onClick={() => {
                  deleteCall(call.id);
                  onBack();
                }}
              />
              <Box
                alignItems="flex-start"
                display="flex"
                justifyContent="space-between"
              >
                <Box display="flex" flexDirection="column" mb={1} minWidth={0}>
                  <ZUIText noWrap variant="headingLg">
                    {call.target.phone}
                  </ZUIText>
                  <Box
                    alignItems="center"
                    display="flex"
                    gap={0.5}
                    minWidth={0}
                  >
                    <ZUIPersonAvatar
                      firstName={call.target.first_name}
                      id={call.target.id}
                      lastName={call.target.last_name}
                      size="small"
                    />
                    <ZUIText noWrap variant="bodyMdRegular">
                      {call.target.first_name} {call.target.last_name}
                    </ZUIText>
                  </Box>
                </Box>

                <Box alignItems="center" display="flex">
                  <ZUIBadge color="warning" number={unfinishedCallList.length}>
                    <ZUIButton
                      label="Switch"
                      onClick={() => setShowModal(true)}
                      variant="secondary"
                    />
                  </ZUIBadge>
                </Box>
              </Box>
              <Box display="flex" gap={2} justifyContent="flex-end">
                {onPrimaryActionLabel === 'Call' && (
                  <SkipCallDialog
                    assignment={assignment}
                    callId={call.id}
                    targetName={`${call.target.first_name} ${call.target.last_name}`}
                  />
                )}
                {onSecondaryAction && onSecondaryActionLabel && (
                  <ZUIButton
                    label={onSecondaryActionLabel}
                    onClick={onSecondaryAction}
                    variant="secondary"
                  />
                )}
                <ZUIButton
                  disabled={forwardButtonDisabled}
                  label={onPrimaryActionLabel}
                  onClick={onPrimaryAction}
                  variant={forwardButtonIsLoading ? 'loading' : 'primary'}
                />
              </Box>
            </>
          )}
          {!isMobile && (
            <>
              <IconTextLink
                icon={<ArrowBackIos sx={{ fontSize: 16 }} />}
                label={assignment.title}
                onClick={() => {
                  deleteCall(call.id);
                  onBack();
                }}
              />
              <Box
                alignItems="flex-start"
                display="flex"
                justifyContent="space-between"
              >
                <Box display="flex">
                  <Box display="flex" flexDirection="column" minWidth={0}>
                    <ZUIText variant="headingLg">{call.target.phone}</ZUIText>
                    <Box
                      alignItems="center"
                      display="flex"
                      gap={1}
                      minWidth={0}
                    >
                      <ZUIPersonAvatar
                        firstName={call.target.first_name}
                        id={call.target.id}
                        lastName={call.target.last_name}
                        size="small"
                      />
                      <ZUIText noWrap variant="bodyMdRegular">
                        {call.target.first_name} {call.target.last_name}
                      </ZUIText>
                    </Box>
                  </Box>

                  <Box alignItems="center" display="flex" ml={2}>
                    <ZUIBadge
                      color="warning"
                      number={unfinishedCallList.length}
                    >
                      <ZUIButton
                        label="Switch"
                        onClick={() => setShowModal(true)}
                        variant="secondary"
                      />
                    </ZUIBadge>
                  </Box>
                </Box>
                <Box display="flex" gap={2} justifyContent="flex-end">
                  {onPrimaryActionLabel === 'Call' && (
                    <SkipCallDialog
                      assignment={assignment}
                      callId={call.id}
                      targetName={`${call.target.first_name} ${call.target.last_name}`}
                    />
                  )}
                  {onSecondaryAction && onSecondaryActionLabel && (
                    <ZUIButton
                      label={onSecondaryActionLabel}
                      onClick={onSecondaryAction}
                      variant="secondary"
                    />
                  )}
                  <ZUIButton
                    disabled={forwardButtonDisabled}
                    label={onPrimaryActionLabel}
                    onClick={onPrimaryAction}
                    variant={forwardButtonIsLoading ? 'loading' : 'primary'}
                  />
                </Box>
              </Box>
            </>
          )}
        </Box>
        <ZUIDivider />
      </Box>
      <CallSwitchModal
        assignment={assignment}
        onClose={() => setShowModal(false)}
        onSwitchCall={onSwitchCall}
        open={showModal}
      />
    </>
  );
};

export default StepsHeader;
