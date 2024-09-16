import { GetServerSideProps } from 'next';
import { useState } from 'react';
import { Box, Button, TextField, Typography } from '@mui/material';

import useCanvassAssignment from 'features/areas/hooks/useCanvassAssignment';
import CanvassAssignmentLayout from 'features/areas/layouts/CanvassAssignmentLayout';
import { scaffold } from 'utils/next';
import { PageWithLayout } from 'utils/types';
import useAddAssignee from 'features/areas/hooks/useAddAssignee';
import useAssignees from 'features/areas/hooks/useAssignees';
import ZUIFutures from 'zui/ZUIFutures';
import { Msg } from 'core/i18n';
import messageIds from 'features/areas/l10n/messageIds';

const scaffoldOptions = {
  authLevelRequired: 2,
};

export const getServerSideProps: GetServerSideProps = scaffold(async (ctx) => {
  const { orgId, campId, canvassAssId } = ctx.params!;
  return {
    props: { campId, canvassAssId, orgId },
  };
}, scaffoldOptions);

interface CanvassAssignmentPageProps {
  orgId: string;
  canvassAssId: string;
}

const CanvassAssignmentPage: PageWithLayout<CanvassAssignmentPageProps> = ({
  orgId,
  canvassAssId,
}) => {
  const [personId, setPersonId] = useState<number | null>(null);

  const addAssignee = useAddAssignee(parseInt(orgId), canvassAssId);

  const canvassAssignmentFuture = useCanvassAssignment(
    parseInt(orgId),
    canvassAssId
  );

  const assigneesFuture = useAssignees(parseInt(orgId), canvassAssId);
  return (
    <ZUIFutures
      futures={{
        assignees: assigneesFuture,
        canvassAssignment: canvassAssignmentFuture,
      }}
    >
      {({ data: { canvassAssignment, assignees } }) => {
        return (
          <Box>
            {canvassAssignment.title || (
              <Msg id={messageIds.canvassAssignment.empty.title} />
            )}
            <Box display="flex" flexDirection="column">
              <Typography>Add a person Id</Typography>
              <TextField
                onChange={(ev) => {
                  const value = ev.target.value;
                  if (value) {
                    setPersonId(parseInt(value));
                  }
                }}
                type="number"
                value={personId}
              />
              <Button
                onClick={() => {
                  if (personId) {
                    addAssignee(personId);
                  }
                }}
                variant="contained"
              >
                Add assignee
              </Button>
            </Box>

            <Box>
              Ids of people that have been added
              {assignees.map((assignee) => (
                <Box key={assignee.id}>{assignee.id}</Box>
              ))}
            </Box>
          </Box>
        );
      }}
    </ZUIFutures>
  );
};

CanvassAssignmentPage.getLayout = function getLayout(page) {
  return (
    <CanvassAssignmentLayout {...page.props}>{page}</CanvassAssignmentLayout>
  );
};

export default CanvassAssignmentPage;
