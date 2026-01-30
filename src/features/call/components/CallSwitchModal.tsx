import React, { FC, Fragment, Suspense, useMemo, useState } from 'react';
import { Box, CircularProgress } from '@mui/material';
import { Search } from '@mui/icons-material';
import Fuse from 'fuse.js';

import { ZetkinCallAssignment } from 'utils/types/zetkin';
import ZUIModal from 'zui/components/ZUIModal';
import messageIds from '../l10n/messageIds';
import { useMessages } from 'core/i18n';
import ZUITextField from 'zui/components/ZUITextField';
import UnfinishedCallListItem from './UnfinishedCall';
import ZUIDivider from 'zui/components/ZUIDivider';
import useCallMutations from '../hooks/useCallMutations';
import useUnfinishedCalls from '../hooks/useUnfinishedCalls';
import useCurrentCall from '../hooks/useCurrentCall';
import useFinishedCalls from '../hooks/useFinishedCalls';
import ZUIPersonAvatar from 'zui/components/ZUIPersonAvatar';
import ZUIText from 'zui/components/ZUIText';
import ZUIButton from 'zui/components/ZUIButton';
import ZUIRelativeTime from 'zui/ZUIRelativeTime';
import { colors, labels } from './PreviousCallsInfo';

type CallSwitchModalProps = {
  assignment: ZetkinCallAssignment;
  onClose: () => void;
  onSwitch: (assignmentId: number) => void;
  open: boolean;
};

const UnfinishedCallsList: FC<{
  onCall: (assignmentId: number) => void;
  orgId: number;
  searchString: string;
}> = ({ onCall, orgId, searchString }) => {
  const { abandonUnfinishedCall, switchToUnfinishedCall } =
    useCallMutations(orgId);

  const currentCall = useCurrentCall();
  const unfinishedCalls = useUnfinishedCalls();

  const unfinishedExceptCurrentCall = unfinishedCalls.filter((call) =>
    currentCall ? currentCall.id != call.id : true
  );

  const fuse = new Fuse(unfinishedCalls, {
    keys: [
      'target.first_name',
      'target.last_name',
      'target.name',
      'target.phone',
      'target.alt_phone',
    ],
    threshold: 0.4,
  });

  const filteredUnfinishedCalls = useMemo(
    () =>
      searchString
        ? fuse.search(searchString).map((fuseResult) => fuseResult.item)
        : unfinishedExceptCurrentCall,
    [unfinishedExceptCurrentCall, searchString]
  );

  return (
    <>
      {filteredUnfinishedCalls.map((unfinishedCall) => (
        <Fragment key={unfinishedCall.id}>
          <UnfinishedCallListItem
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
    </>
  );
};

const FinishedCallsList: FC<{
  onCall: (assignmentId: number) => void;
  orgId: number;
  searchString: string;
}> = ({ onCall, orgId, searchString }) => {
  const messages = useMessages(messageIds);
  const finishedCalls = useFinishedCalls();
  const { switchToPreviousCall } = useCallMutations(orgId);

  const fuse = new Fuse(finishedCalls, {
    keys: [
      'target.first_name',
      'target.last_name',
      'target.name',
      'target.phone',
      'target.alt_phone',
    ],
    threshold: 0.4,
  });

  const filteredFinishedCalls = useMemo(
    () =>
      searchString
        ? fuse.search(searchString).map((fuseResult) => fuseResult.item)
        : finishedCalls,
    [finishedCalls, searchString]
  );

  return (
    <>
      {filteredFinishedCalls.map((finishedCall) => (
        <Fragment key={finishedCall.id}>
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
                  firstName={finishedCall.target.first_name}
                  id={finishedCall.target.id}
                  lastName={finishedCall.target.last_name}
                  size="medium"
                />
                <ZUIText noWrap variant="bodyMdSemiBold">
                  {finishedCall.target.name}
                </ZUIText>
              </Box>
              <ZUIButton
                label={messages.callLog.previousCall.logNew()}
                onClick={() => {
                  switchToPreviousCall(
                    finishedCall.assignment_id,
                    finishedCall.target.id
                  );
                  onCall(finishedCall.assignment_id);
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
                {finishedCall.target.phone}
              </ZUIText>
              <Box
                alignItems="center"
                display="flex"
                gap={1}
                sx={(theme) => {
                  const color = colors[finishedCall.state];
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
                  {labels[finishedCall.state]}
                </ZUIText>
                <ZUIText color="secondary" noWrap>
                  <ZUIRelativeTime datetime={finishedCall.update_time} />
                </ZUIText>
              </Box>
            </Box>
          </Box>
          <ZUIDivider />
        </Fragment>
      ))}
    </>
  );
};

const CallSwitchModal: FC<CallSwitchModalProps> = ({
  assignment,
  onClose,
  onSwitch,
  open,
}) => {
  const messages = useMessages(messageIds);
  const [searchString, setSearchString] = useState('');

  return (
    <ZUIModal
      onClose={() => {
        setSearchString('');
        onClose();
      }}
      open={open}
      size="medium"
      title={messages.callLog.title()}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 1,
          overflowX: 'hidden',
          paddingRight: 1,
          paddingTop: 2,
          width: '100%',
        }}
      >
        <ZUITextField
          fullWidth
          label={messages.callLog.searchLabel()}
          onChange={(newValue: string) => {
            setSearchString(newValue);
          }}
          startIcon={Search}
          value={searchString}
        />
        <Suspense fallback={'loading unfinished'}>
          <UnfinishedCallsList
            onCall={(assignmentId) => {
              onSwitch(assignmentId);
              onClose();
            }}
            orgId={assignment.organization.id}
            searchString={searchString}
          />
        </Suspense>
        <Suspense
          fallback={
            <Box
              sx={{
                alignItems: 'center',
                display: 'flex',
                height: '100%',
                justifyContent: 'center',
                width: '100%',
              }}
            >
              <CircularProgress />
            </Box>
          }
        >
          <FinishedCallsList
            onCall={(assignmentId) => {
              onSwitch(assignmentId);
              onClose();
            }}
            orgId={assignment.organization.id}
            searchString={searchString}
          />
        </Suspense>
      </Box>
    </ZUIModal>
  );
};

export default CallSwitchModal;
