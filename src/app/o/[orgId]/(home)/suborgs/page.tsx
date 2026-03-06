'use server';

import { FC } from 'react';

import SubOrgsPage from 'features/public/pages/SubOrgsPage';

type Props = {
  params: {
    orgId: number;
  };
};

const Page: FC<Props> = async (props) => {
  const params = await props.params;
  return <SubOrgsPage orgId={params.orgId} />;
};

export default Page;
