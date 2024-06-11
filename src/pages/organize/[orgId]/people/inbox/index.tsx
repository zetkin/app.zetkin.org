import { GetServerSideProps } from 'next';

import JoinSubmissionPane from 'features/joinForms/panes/JoinSubmissionPane';
import JoinSubmissionTable from 'features/joinForms/components/JoinSubmissionTable';
import { PageWithLayout } from 'utils/types';
import PeopleLayout from 'features/views/layout/PeopleLayout';
import { scaffold } from 'utils/next';
import useJoinSubmissions from 'features/joinForms/hooks/useJoinSubmissions';
import { usePanes } from 'utils/panes';

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
  const { openPane } = usePanes();

  if (!data) {
    return null;
  }

  return (
    <JoinSubmissionTable
      onSelect={(submission) => {
        openPane({
          render: () => (
            <JoinSubmissionPane
              orgId={parseInt(orgId)}
              submissionId={submission.id}
            />
          ),
          width: 500,
        });
      }}
      submissions={data}
    />
  );
};

DuplicatesPage.getLayout = function getLayout(page) {
  return <PeopleLayout>{page}</PeopleLayout>;
};

export default DuplicatesPage;
