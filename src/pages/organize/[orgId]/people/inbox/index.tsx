import { GetServerSideProps } from 'next';

import JoinSubmissionTable from 'features/joinForms/components/JoinSubmissionTable';
import { PageWithLayout } from 'utils/types';
import PeopleLayout from 'features/views/layout/PeopleLayout';
import { scaffold } from 'utils/next';
import useJoinSubmissions from 'features/joinForms/hooks/useJoinSubmissions';

export const getServerSideProps: GetServerSideProps = scaffold(async (ctx) => {
  const { orgId } = ctx.params!;
  return {
    props: { orgId },
  };
});

type Props = {
  orgId: string;
};

const DuplicatesPage: PageWithLayout<Props> = ({ orgId }) => {
  const { data } = useJoinSubmissions(parseInt(orgId));

  if (!data) {
    return null;
  }

  return <JoinSubmissionTable submissions={data} />;
};

DuplicatesPage.getLayout = function getLayout(page) {
  return <PeopleLayout>{page}</PeopleLayout>;
};

export default DuplicatesPage;
