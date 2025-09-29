'use client';

import { Box } from '@mui/material';
import { FC } from 'react';
import { notFound, useSearchParams } from 'next/navigation';

import { useAppDispatch } from 'core/hooks';
import { initiateAssignment } from '../store';
import useServerSide from 'core/useServerSide';
import ZUILogoLoadingIndicator from 'zui/ZUILogoLoadingIndicator';
import Call from '../components/Call';
import useCurrentAssignment from '../hooks/useCurrentAssignment';

type Props = {
  assignmentId: number;
};

const CallPage: FC<Props> = ({ assignmentId }) => {
  const queryParams = useSearchParams();
  const dispatch = useAppDispatch();
  if (queryParams?.get('assignment')) {
    history.replaceState(null, '', '/call');
    dispatch(initiateAssignment(assignmentId));
  }

  const assignment = useCurrentAssignment();
  const onServer = useServerSide();

  if (!assignment) {
    return notFound();
  }

  if (onServer) {
    return (
      <Box
        sx={{
          alignItems: 'center',
          display: 'flex',
          height: '100dvh',
          justifyContent: 'center',
        }}
      >
        <ZUILogoLoadingIndicator />
      </Box>
    );
  }

  return (
    <main>
      <Call assignment={assignment} />
    </main>
  );
};

export default CallPage;
