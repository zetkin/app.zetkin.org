'use server';

import { FC } from 'react';

import PublicOrgPage from 'features/public/pages/PublicOrgPage';

type Props = {
  params: {
    orgId: number;
  };
};

const Page: FC<Props> = async (props) => {
  const params = await props.params;
  return <PublicOrgPage orgId={params.orgId} />;
};

export default Page;
