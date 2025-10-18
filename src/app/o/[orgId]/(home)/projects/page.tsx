'use server';

import { FC } from 'react';

import CampaignsPage from 'features/organizations/pages/CampaignsPage';

type Props = {
  params: {
    orgId: number;
  };
};

const Page: FC<Props> = ({ params }) => {
  return <CampaignsPage orgId={params.orgId} />;
};

export default Page;
