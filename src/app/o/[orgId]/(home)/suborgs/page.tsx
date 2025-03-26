'use server';

import { FC } from 'react';

import SubOrgsPage from 'features/organizations/pages/SubOrgsPage';

type Props = {
  params: {
    orgId: number;
  };
};

const Page: FC<Props> = ({ params }) => {
  return <SubOrgsPage orgId={params.orgId} />;
};

export default Page;
