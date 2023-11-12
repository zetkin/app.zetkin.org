import { CircularProgress } from '@mui/material';
import { Box, Typography } from '@mui/material';
import { FC, Suspense } from 'react';

import EventListing from 'features/campaigns/components/ProjectPage/ProjectEventListing';
import Header from 'features/campaigns/components/ProjectPage/Header';
import { scaffold } from 'utils/next';
import useCampaign from 'features/campaigns/hooks/useCampaign';
import ZUIFuture from 'zui/ZUIFuture';

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
      <Header orgId={orgId} />

      <ZUIFuture future={campaignFuture}>
        {(data) => (
          <>
            <Box margin={2} marginBottom={6}>
              <Typography variant="h4">{data.title}</Typography>
              <Typography>{data.info_text ?? ''}</Typography>
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
