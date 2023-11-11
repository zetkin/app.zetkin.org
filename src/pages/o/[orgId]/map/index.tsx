import dynamic from 'next/dynamic';
import { FC } from 'react';
import { scaffold } from 'utils/next';

import useEventActivities from 'features/campaigns/hooks/useEventActivities';

const ActivistMap = dynamic(
  () => import('features/events/components/ActivistMap'),
  { ssr: false }
);

const scaffoldOptions = {
  allowNonOfficials: true,
  authLevelRequired: 1,
};

export const getServerSideProps = scaffold(async (ctx) => {
  const { orgId } = ctx.params!;

  return {
    props: {
      orgId,
    },
  };
}, scaffoldOptions);

type PageProps = {
  orgId: string;
};

const Page: FC<PageProps> = ({ orgId }) => {
  useEventActivities(parseInt(orgId));
  return <ActivistMap />;
};

export default Page;
