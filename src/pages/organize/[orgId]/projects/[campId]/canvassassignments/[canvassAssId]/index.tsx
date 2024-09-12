import { GetServerSideProps } from 'next';
import { FC, useState } from 'react';
import { Box, Button, TextField, Typography } from '@mui/material';

import useCanvassAssignment from 'features/areas/hooks/useCanvassAssignment';
import CanvassAssignmentLayout from 'features/areas/layouts/CanvassAssignmentLayout';
import { scaffold } from 'utils/next';
import { PageWithLayout } from 'utils/types';
import useAddAssignee from 'features/areas/hooks/useAddAssignee';
import useAssignees from 'features/areas/hooks/useAssignees';
import ZUIFutures from 'zui/ZUIFutures';
import useAssigneeMutations from 'features/areas/hooks/useAssigneeMutations';

const scaffoldOptions = {
  authLevelRequired: 2,
};

export const getServerSideProps: GetServerSideProps = scaffold(async (ctx) => {
  const { orgId, campId, canvassAssId } = ctx.params!;
  return {
    props: { campId, canvassAssId, orgId },
  };
}, scaffoldOptions);

const AssigneeListItem: FC<{
  assigneeId: number;
  onAddUrl: (url: string) => void;
}> = ({ assigneeId, onAddUrl }) => {
  const [url, setUrl] = useState('');
  return (
    <Box alignItems="center" display="flex" gap={1}>
      <Typography>{assigneeId}</Typography>
      <TextField onChange={(ev) => setUrl(ev.target.value)} value={url} />
      <Button
        disabled={!url}
        onClick={() => {
          if (url) {
            onAddUrl(url);
          }
        }}
        variant="outlined"
      >
        Add this area url
      </Button>
    </Box>
  );
};

interface CanvassAssignmentPageProps {
  orgId: string;
  campId: string;
  canvassAssId: string;
}

const CanvassAssignmentPage: PageWithLayout<CanvassAssignmentPageProps> = ({
  orgId,
  campId,
  canvassAssId,
}) => {
  const [personId, setPersonId] = useState<number | null>(null);

  const addAssignee = useAddAssignee(
    parseInt(orgId),
    parseInt(campId),
    canvassAssId
  );

  const updateAssignee = useAssigneeMutations(
    parseInt(orgId),
    parseInt(campId),
    canvassAssId
  );

  const canvassAssignmentFuture = useCanvassAssignment(
    parseInt(orgId),
    parseInt(campId),
    canvassAssId
  );

  const assigneesFuture = useAssignees(
    parseInt(orgId),
    parseInt(campId),
    canvassAssId
  );
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
            {canvassAssignment.title}
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
              Ids of people that have been added as assignees
              {assignees.map((assignee) => (
                <AssigneeListItem
                  key={assignee.id}
                  assigneeId={assignee.id}
                  onAddUrl={(url) =>
                    updateAssignee(assignee.id, { areaUrl: url })
                  }
                />
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
