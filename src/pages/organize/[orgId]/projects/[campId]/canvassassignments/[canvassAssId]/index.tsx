import { Typography } from '@mui/material';
import { GetServerSideProps } from 'next';

import CanvassAssignmentLayout from 'features/areas/layouts/CanvassAssignmentLayout';
import { scaffold } from 'utils/next';
import { PageWithLayout } from 'utils/types';
import ZUIFuture from 'zui/ZUIFuture';
import useCanvassAssignment from 'features/areas/hooks/useCanvassAssignment';

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
  const assignmentFuture = useCanvassAssignment(parseInt(orgId), canvassAssId);
  return (
    <ZUIFuture future={assignmentFuture}>
      {(assignment) => <Typography>{assignment.title}</Typography>}
    </ZUIFuture>
  );
};

CanvassAssignmentPage.getLayout = function getLayout(page) {
  return (
    <CanvassAssignmentLayout {...page.props}>{page}</CanvassAssignmentLayout>
  );
};

export default CanvassAssignmentPage;
