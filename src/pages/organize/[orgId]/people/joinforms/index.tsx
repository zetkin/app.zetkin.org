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

const DuplicatesPage: PageWithLayout<PageProps> = ({ orgId }) => {
  const { data } = useJoinForms(parseInt(orgId));
  const { openPane } = usePanes();

  if (!data) {
    return null;
  }

  return (
    <JoinFormList
      forms={data}
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

DuplicatesPage.getLayout = function getLayout(page) {
  return <PeopleLayout>{page}</PeopleLayout>;
};

export default DuplicatesPage;
