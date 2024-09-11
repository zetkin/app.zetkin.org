import { GetServerSideProps } from 'next';
import { useState } from 'react';
import { Box, Button, TextField, Typography } from '@mui/material';

import useCanvassAssignment from 'features/areas/hooks/useCanvassAssignment';
import CanvassAssignmentLayout from 'features/areas/layouts/CanvassAssignmentLayout';
import { scaffold } from 'utils/next';
import { PageWithLayout } from 'utils/types';
import ZUIFuture from 'zui/ZUIFuture';
import useAddAssignee from 'features/areas/hooks/useAddAssignee';

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

  const canvassAssignmentFuture = useCanvassAssignment(
    parseInt(orgId),
    parseInt(campId),
    canvassAssId
  );
  return (
    <ZUIFuture future={canvassAssignmentFuture}>
      {(canvassAssignment) => {
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
                Do it
              </Button>
            </Box>
          </Box>
        );
      }}
    </ZUIFuture>
  );
};

CanvassAssignmentPage.getLayout = function getLayout(page) {
  return (
    <CanvassAssignmentLayout {...page.props}>{page}</CanvassAssignmentLayout>
  );
};

export default CanvassAssignmentPage;
