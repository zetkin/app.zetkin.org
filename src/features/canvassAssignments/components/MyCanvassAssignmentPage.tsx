'use client';

import dynamic from 'next/dynamic';
import { FC } from 'react';
import { Avatar, Box } from '@mui/material';

import useOrganization from 'features/organizations/hooks/useOrganization';
import ZUIFutures from 'zui/ZUIFutures';
import useServerSide from 'core/useServerSide';
import useMyCanvassAssignments from '../hooks/useMyCanvassAssignments';
import { AssignmentWithAreas } from '../types';

const CanvassAssignmentMap = dynamic(() => import('./CanvassAssignmentMap'), {
  ssr: false,
});

const AssignmentPage: FC<{ assignment: AssignmentWithAreas }> = ({
  assignment,
}) => {
  const orgFuture = useOrganization(assignment.organization.id);
  const isServer = useServerSide();

  if (isServer) {
    return null;
  }
  return (
    <ZUIFutures futures={{ org: orgFuture }}>
      {({ data: { org } }) => (
        <>
          <Box
            alignItems="center"
            display="flex"
            gap={1}
            height="10vh"
            justifyContent="space-between"
            padding={2}
          >
            <Box alignItems="center" display="flex" gap={1}>
              <Avatar src={`/api/orgs/${org.id}/avatar`} />
              {org.title}
            </Box>
            <Box alignItems="flex-end" display="flex" flexDirection="column">
              {assignment.title ?? 'Untitled canvassassignment'}
            </Box>
          </Box>
          <Box height="90vh">
            <CanvassAssignmentMap
              areas={assignment.areas}
              assignment={assignment}
            />
          </Box>
        </>
      )}
    </ZUIFutures>
  );
};

type MyCanvassAssignmentPageProps = {
  canvassAssId: string;
};

const MyCanvassAssignmentPage: FC<MyCanvassAssignmentPageProps> = ({
  canvassAssId,
}) => {
  const myAssignments = useMyCanvassAssignments().data || [];
  const assignment = myAssignments.find(
    (assignment) => assignment.id == canvassAssId
  );

  if (!assignment) {
    return null;
  }

  return <AssignmentPage assignment={assignment} />;
};

export default MyCanvassAssignmentPage;
