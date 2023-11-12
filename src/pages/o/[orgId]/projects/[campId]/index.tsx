import { CircularProgress } from '@mui/material';
import { FC, Suspense } from 'react';

import EventListing from 'features/campaigns/components/ProjectPage/ProjectEventListing';
import Header from 'features/campaigns/components/ProjectPage/Header';
import useCampaign from 'features/campaigns/hooks/useCampaign';
import { Box, Typography } from '@mui/material';
import ZUIFuture from 'zui/ZUIFuture';
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

  const { campaignFuture } = useCampaign(orgId, campId);

  return (
    <>
      <Header campId={campId} orgId={orgId} />

      <ZUIFuture future={campaignFuture}>
        {(data) => (
          <>
            <Box margin={4}>
              <Typography variant="h4">{data.title}</Typography>
              <Typography variant="h7">{data.info_text ?? ''}</Typography>
            </Box>
          </>
        )}
      </ZUIFuture>

      <Suspense fallback={<CircularProgress />}>
        <EventListing />
      </Suspense>
    </>
  );
};

export default Page;
