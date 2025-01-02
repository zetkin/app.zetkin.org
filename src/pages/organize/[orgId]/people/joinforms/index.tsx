import { GetServerSideProps } from 'next';

import JoinFormList from 'features/joinForms/components/JoinFormList';
import JoinFormPane from 'features/joinForms/panes/JoinFormPane';
import { PageWithLayout } from 'utils/types';
import PeopleLayout from 'features/views/layout/PeopleLayout';
import { scaffold } from 'utils/next';
import useJoinForms from 'features/joinForms/hooks/useJoinForms';
import { usePanes } from 'utils/panes';

export const getServerSideProps: GetServerSideProps = scaffold(async (ctx) => {
  const { orgId } = ctx.params!;

  return {
    props: {
      orgId,
    },
  };
});

type PageProps = {
  orgId: string;
};

const JoinFormsPage: PageWithLayout<PageProps> = ({ orgId }) => {
  const { data: joinForms } = useJoinForms(parseInt(orgId));
  const { openPane } = usePanes();

  if (!joinForms) {
    return null;
  }

  const ownJoinForms = joinForms.filter(
    (form) => form.organization.id == parseInt(orgId)
  );

  return (
    <JoinFormList
      forms={ownJoinForms}
      onItemClick={(form) => {
        openPane({
          render: () => (
            <JoinFormPane formId={form.id} orgId={form.organization.id} />
          ),
          width: 500,
        });
      }}
    />
  );
};

JoinFormsPage.getLayout = function getLayout(page) {
  return <PeopleLayout>{page}</PeopleLayout>;
};

export default JoinFormsPage;
