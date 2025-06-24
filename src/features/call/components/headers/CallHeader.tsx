import { Box } from '@mui/material';
import { FC, ReactNode, useState } from 'react';
import { ArrowBackIos } from '@mui/icons-material';

import useCallMutations from 'features/call/hooks/useCallMutations';
import useOutgoingCalls from 'features/call/hooks/useOutgoingCalls';
import { ZetkinCall } from 'features/call/types';
import { ZetkinCallAssignment } from 'utils/types/zetkin';
import CallSwitchModal from '../CallSwitchModal';
import HeaderBase from './HeaderBase';
import ZUIText from 'zui/components/ZUIText';
import ZUIButton from 'zui/components/ZUIButton';
import ZUIBadge from 'zui/components/ZUIBadge';
import ZUIPersonAvatar from 'zui/components/ZUIPersonAvatar';
import ZUIIcon from 'zui/components/ZUIIcon';

type IconTextLinkProps = {
  icon: ReactNode;
  label: string;
  onClick: () => void;
};

const IconTextLink: FC<IconTextLinkProps> = ({ icon, label, onClick }) => {
  return (
    <Box
      alignItems="center"
      border="none"
      component="button"
      display="flex"
      gap={0.5}
      maxWidth="100%"
      mb={1}
      minWidth={0}
      onClick={onClick}
      sx={{ backgroundColor: 'transparent', cursor: 'pointer' }}
    >
      {icon}
      <ZUIText noWrap variant="bodyMdRegular">
        {label}
      </ZUIText>
    </Box>
  );
};

type Props = {
  assignment: ZetkinCallAssignment;
  call: ZetkinCall;
  forwardButtonDisabled?: boolean;
  forwardButtonLabel: string;
  forwardButtonLoading?: boolean;
  onBack: () => void;
  onForward: () => void;
  onSecondaryAction?: () => void;
  onSwitchCall: () => void;
  secondaryActionLabel?: string;
};

const CallHeader: FC<Props> = ({
  assignment,
  call,
  forwardButtonDisabled,
  forwardButtonLabel,
  forwardButtonLoading,
  onBack,
  onForward,
  onSecondaryAction,
  onSwitchCall,
  secondaryActionLabel,
}) => {
  const [showModal, setShowModal] = useState(false);
  const { abandonCurrentCall } = useCallMutations(assignment.organization.id);
  const outgoingCalls = useOutgoingCalls();
  const unfinishedCalls = outgoingCalls.filter(
    (c) => c.state == 0 && c.id != call.id
  );

  const hasSecondaryButton = secondaryActionLabel && onSecondaryAction;

  return (
    <>
      <HeaderBase
        primaryButton={
          <ZUIButton
            disabled={forwardButtonDisabled}
            label={forwardButtonLabel}
            onClick={onForward}
            variant={forwardButtonLoading ? 'loading' : 'primary'}
          />
        }
        secondaryButton={
          hasSecondaryButton ? (
            <ZUIButton
              label={secondaryActionLabel}
              onClick={onSecondaryAction}
              variant="secondary"
            />
          ) : undefined
        }
        title={
          <Box
            sx={{
              alignItems: 'center',
              display: 'grid',
              gap: 1,
              gridTemplateColumns: '1fr auto',
            }}
          >
            <Box display="flex" flexDirection="column" minWidth={0}>
              <ZUIText noWrap variant="headingLg">
                {call.target.phone}
              </ZUIText>
              <Box alignItems="center" display="flex" gap={0.5} minWidth={0}>
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
            <Box sx={{ marginLeft: 1 }}>
              <ZUIBadge color="warning" number={unfinishedCalls.length}>
                <ZUIButton
                  label="Switch"
                  onClick={() => setShowModal(true)}
                  variant="secondary"
                />
              </ZUIBadge>
            </Box>
          </Box>
        }
        topLeft={
          <IconTextLink
            icon={<ZUIIcon color="primary" icon={ArrowBackIos} size="small" />}
            label={assignment.title}
            onClick={() => {
              abandonCurrentCall();
              onBack();
            }}
          />
        }
      />
      <CallSwitchModal
        assignment={assignment}
        onClose={() => setShowModal(false)}
        onSwitchCall={onSwitchCall}
        open={showModal}
      />
    </>
  );
};

export default CallHeader;
