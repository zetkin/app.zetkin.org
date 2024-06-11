import { GetServerSideProps } from 'next';

import JoinFormList from 'features/joinForms/components/JoinFormList';
import { PageWithLayout } from 'utils/types';
import PeopleLayout from 'features/views/layout/PeopleLayout';
import { scaffold } from 'utils/next';
import useJoinForms from 'features/joinForms/hooks/useJoinForms';

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

  if (!data) {
    return null;
  }

  return (
    <JoinFormList
      forms={data}
      onItemClick={(form) => {
        // eslint-disable-next-line no-console
        console.log(form.title);
      }}
    />
  );
};

DuplicatesPage.getLayout = function getLayout(page) {
  return <PeopleLayout>{page}</PeopleLayout>;
};

export default DuplicatesPage;
