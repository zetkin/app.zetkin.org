import dynamic from 'next/dynamic';
import { FC } from 'react';
import { scaffold } from 'utils/next';

import useEventActivities from 'features/campaigns/hooks/useEventActivities';
import { ACTIVITIES, EventActivity } from 'features/campaigns/types';

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
  const { data: activities } = useEventActivities(parseInt(orgId));

  if (activities) {
    const events = activities.filter(
      (activity) => activity.kind === ACTIVITIES.EVENT
    ) as EventActivity[];

    return <ActivistMap events={events} />;
  }

  return null;
};

export default Page;
