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
  return <PublicProjPage campId={params.projId} orgId={params.orgId} />;
};

export default Page;
