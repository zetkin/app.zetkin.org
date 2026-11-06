'use server';

import { FC } from 'react';

import PublicProjPage from 'features/public/pages/PublicProjPage';

type Props = {
  params: {
    orgId: number;
    projId: number;
  };
};

const Page: FC<Props> = async (props) => {
  const params = await props.params;
  return <PublicProjPage orgId={params.orgId} projectId={params.projId} />;
};

export default Page;
