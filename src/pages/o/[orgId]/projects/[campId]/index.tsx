import { CircularProgress } from '@mui/material';
import { FC, Suspense } from 'react';

import EventListing from 'features/campaigns/components/ProjectPage/ProjectEventListing';
import Header from 'features/campaigns/components/ProjectPage/Header';
import { scaffold } from 'utils/next';

const scaffoldOptions = {
  allowNonOfficials: true,
  authLevelRequired: 1,
};

export const getServerSideProps = scaffold(async (ctx) => {
  const { campId, orgId } = ctx.params!;

  return {
    props: {
      campId,
      orgId,
    },
  };
}, scaffoldOptions);

type PageProps = {
  campId: number;
  orgId: number;
};

const Page: FC<PageProps> = ({ orgId, campId }) => {
  return (
    <>
      <Header campId={campId} orgId={orgId} />
      <Suspense fallback={<CircularProgress />}>
        <EventListing />
      </Suspense>
    </>
  );
};

export default Page;
