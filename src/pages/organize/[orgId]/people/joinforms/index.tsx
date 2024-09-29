import { GetServerSideProps } from 'next';
import { useEffect, useState } from 'react';

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

type Organization = {
  id: number;
};

type Form = {
  id: number;
  organization: Organization;
};

type PageProps = {
  orgId: string;
};

const JoinFormsPage: PageWithLayout<PageProps> = ({ orgId }) => {
  const { data: joinForms } = useJoinForms(parseInt(orgId));
  const { openPane } = usePanes();
  const [formLength, setFormLength] = useState(0);

  useEffect(() => {
    if (joinForms && joinForms?.length > formLength) {
      const newForm = joinForms[joinForms.length - 1];
      if (newForm) {
        openNewFormPane(newForm);
      }
    }
  }, [joinForms]);

  if (!joinForms) {
    return null;
  }
  const openNewFormPane = (form: Form) => {
    setFormLength(joinForms.length);
    openPane({
      render: () => (
        <JoinFormPane formId={form.id} orgId={form.organization.id} />
      ),
      width: 500,
    });
  };

  return (
    <JoinFormList
      forms={joinForms}
      onItemClick={(form) => {
        openPane({
          render: () => (
            <JoinFormPane formId={form.id} orgId={form.organization.id} /> // behavior to replicate
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
