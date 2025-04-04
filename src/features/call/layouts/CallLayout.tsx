'use client';

import { Box, Button } from '@mui/material';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { FC, ReactNode } from 'react';

import { Msg } from 'core/i18n';
import messageIds from '../l10n/messageIds';
import SkipCallDialog from '../components/SkipCallDialog';
import useMyCallAssignments from 'features/callAssignments/hooks/useMyCallAssignments';
import useAllocateCall from '../hooks/useAllocateCall';
import useCallMutations from '../hooks/useCallMutations';
import useCurrentCall from '../hooks/useCurrentCall';

type Props = {
  callAssId: string;
  children?: ReactNode;
};

const CallLayout: FC<Props> = ({ callAssId, children }) => {
  const router = useRouter();
  const call = useCurrentCall();
  const assignments = useMyCallAssignments();

  const getDetailsPage = (pathname: string) => {
    if (!pathname) {
      return false;
    }
    const segments = pathname.split('/');
    if (segments.length === 3 && segments[1] === 'call') {
      const callId = Number(segments[2]);
      return !isNaN(callId);
    }
    return false;
  };

  const pathname = usePathname() || '';
  const isPreparePage = pathname.endsWith('/prepare');
  const isDetailsPage = getDetailsPage(pathname);

  const assignment = assignments.find(
    (assignment) => assignment.id === parseInt(callAssId)
  );

  const { allocateCall } = useAllocateCall(
    assignment!.organization.id,
    parseInt(callAssId)
  );
  const { deleteCall } = useCallMutations(assignment!.organization.id);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          p: 2,
        }}
      >
        {isDetailsPage && (
          <Link href="/my/home" passHref>
            <Button variant="outlined">
              <Msg id={messageIds.nav.backToHome} />
            </Button>
          </Link>
        )}
        {isPreparePage && (
          <Link href="/my/home" passHref>
            <Button
              onClick={() => {
                if (call) {
                  deleteCall(call.id);
                }
              }}
              variant="outlined"
            >
              Stop calling
            </Button>
          </Link>
        )}
        <Box>
          {isPreparePage && call && assignment && (
            <SkipCallDialog
              assignment={assignment}
              callId={call?.id}
              targetName={
                call?.target.first_name + ' ' + call?.target.last_name
              }
            />
          )}
          {isDetailsPage && (
            <Button
              onClick={() => {
                router.push(`/call/${callAssId}/prepare`);
                allocateCall();
              }}
              variant="contained"
            >
              <Msg id={messageIds.nav.startCalling} />
            </Button>
          )}
          {isPreparePage && <Button variant="contained">Start Call</Button>}
        </Box>
      </Box>
      <Box>{children}</Box>
    </Box>
  );
};

export default CallLayout;
