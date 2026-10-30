import Head from 'next/head';
import { GetServerSideProps } from 'next';

import { scaffold } from 'utils/next';
import { PageWithLayout } from 'utils/types';
import { useNumericRouteParams } from 'core/hooks';
import useServerSide from 'core/useServerSide';
import useCallAssignment from 'features/callAssignments/hooks/useCallAssignment';
import CallAssignmentLayout from 'features/callAssignments/layout/CallAssignmentLayout';
import CallLog from 'features/callAssignments/components/CallLog';

export const getServerSideProps: GetServerSideProps = scaffold(
  async (ctx) => {
    const { orgId, projectId, callAssId } = ctx.params!;

    return {
      props: {
        assignmentId: callAssId,
        orgId,
        projectId,
      },
    };
  },
  {
    authLevelRequired: 2,
  }
);

const CallsPage: PageWithLayout = () => {
  const { orgId, callAssId } = useNumericRouteParams();
  const onServer = useServerSide();
  const { data: callAssignment } = useCallAssignment(orgId, callAssId);

  if (onServer || !callAssignment) {
    return null;
  }

  return (
    <>
      <Head>
        <title>{callAssignment?.title}</title>
      </Head>
      <CallLog callAssId={callAssId} orgId={orgId} />
    </>
  );
};

CallsPage.getLayout = function getLayout(page) {
  return <CallAssignmentLayout removePadding>{page}</CallAssignmentLayout>;
};

export default CallsPage;
