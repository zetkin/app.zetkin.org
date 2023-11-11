import { FC } from 'react';
import { scaffold } from 'utils/next';
import useEventActivities from 'features/campaigns/hooks/useEventActivities';

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
  return <h1>Map page for org {orgId}</h1>;
};

export default Page;
