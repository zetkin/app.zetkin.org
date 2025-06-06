'use server';

import { FC } from 'react';

import PublicProjPage from 'features/organizations/pages/PublicProjPage';

type Props = {
  params: {
    orgId: number;
  };
};

const Page: FC<Props> = ({ params }) => {
  return <PublicProjPage orgId={params.orgId} />;
};

export default Page;
