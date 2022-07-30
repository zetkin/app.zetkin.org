import CallAssignmentLayout from 'layout/organize/CallAssignmentLayout';
import { GetServerSideProps } from 'next';
import { PageWithLayout } from 'types';
import { scaffold } from 'utils/next';

export const getServerSideProps: GetServerSideProps = scaffold(
  async (ctx) => {
    const { orgId, campId, callAssId } = ctx.params!;
    return {
      props: {
        assignmentId: callAssId,
        campId,
        orgId,
      },
    };
  },
  {
    authLevelRequired: 2,
    localeScope: ['layout.organize.callAssignment'],
  }
);

const AssignmentPage: PageWithLayout = () => {
  return <p>Placeholder</p>;
};

AssignmentPage.getLayout = function getLayout(page) {
  return (
    <CallAssignmentLayout assignmentId="3" campaignId="2" orgId="1">
      {page}
    </CallAssignmentLayout>
  );
};

export default AssignmentPage;
