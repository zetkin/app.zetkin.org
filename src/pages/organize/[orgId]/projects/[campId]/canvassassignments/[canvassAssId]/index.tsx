import { GetServerSideProps } from 'next';

import useCanvassAssignment from 'features/areas/hooks/useCanvassAssignment';
import CanvassAssignmentLayout from 'features/areas/layouts/CanvassAssignmentLayout';
import { scaffold } from 'utils/next';
import { PageWithLayout } from 'utils/types';
import ZUIFuture from 'zui/ZUIFuture';

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
  const canvassAssignmentFuture = useCanvassAssignment(
    parseInt(orgId),
    parseInt(campId),
    canvassAssId
  );
  return (
    <ZUIFuture future={canvassAssignmentFuture}>
      {(canvassAssignment) => {
        return <div>{canvassAssignment.title}</div>;
      }}
    </ZUIFuture>
  );
};

CanvassAssignmentPage.getLayout = function getLayout(page) {
  return <CanvassAssignmentLayout>{page}</CanvassAssignmentLayout>;
};

export default CanvassAssignmentPage;
