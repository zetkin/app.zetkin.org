'use server';

import { FC } from 'react';

import PublicProjPage from 'features/campaigns/pages/PublicProjPage';

type Props = {
  params: {
    orgId: number;
    projId: number;
  };
};

const Page: FC<Props> = ({ params }) => {
  return <PublicProjPage orgId={params.orgId} projId={params.projId} />;
};

export default Page;
