'use server';

import { FC } from 'react';

import PublicOrgPage from 'features/organizations/pages/PublicOrgPage';

type Props = {
  params: {
    orgId: number;
  };
};

const Page: FC<Props> = ({ params }) => {
  return <PublicOrgPage orgId={params.orgId} />;
};

export default Page;
