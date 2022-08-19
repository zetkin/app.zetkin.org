import APIError from 'utils/apiError';
import CallAssignmentLayout from 'layout/organize/CallAssignmentLayout';
import { callAssignmentQuery } from 'api/callAssignments';
import { GetServerSideProps } from 'next';
import { PageWithLayout } from 'types';
import { scaffold } from 'utils/next';
import { useQuery } from 'react-query';
import ZetkinQuery from 'components/ZetkinQuery';

export const getServerSideProps: GetServerSideProps = scaffold(
  async (ctx) => {
    const { orgId, campId, callAssId } = ctx.params!;

    await callAssignmentQuery(orgId as string, callAssId as string).prefetch(
      ctx
    );

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

interface AssignmentPageProps {
  assignmentId: string;
  campId: string;
  orgId: string;
}

const AssignmentPage: PageWithLayout<AssignmentPageProps> = ({
  orgId,
  assignmentId,
}) => {
  const assQuery = callAssignmentQuery(orgId, assignmentId).useQuery();

  return <p>Placeholder</p>;
};

AssignmentPage.getLayout = function getLayout(page, props) {
  return (
    <CallAssignmentLayout
      assignmentId={props.assignmentId}
      campaignId={props.campId}
      orgId={props.orgId}
    >
      {page}
    </CallAssignmentLayout>
  );
};

export default AssignmentPage;
