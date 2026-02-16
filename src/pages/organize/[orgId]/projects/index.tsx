import Fuse from 'fuse.js';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import {
  ReactElement,
  Suspense,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  Box,
  Button,
  Grid,
  IconButton,
  Skeleton,
  TextField,
  Typography,
  useTheme,
} from '@mui/material';
import { Close, Search } from '@mui/icons-material';

import ActivitiesOverview, {
  ActivitiesOverviewSkeleton,
} from 'features/campaigns/components/ActivitiesOverview';
import AllCampaignsLayout from 'features/campaigns/layout/AllCampaignsLayout';
import BackendApiClient from 'core/api/client/BackendApiClient';
import CampaignCard from 'features/campaigns/components/CampaignCard';
import messageIds from 'features/campaigns/l10n/messageIds';
import { PageWithLayout } from 'utils/types';
import { scaffold } from 'utils/next';
import SharedCard from 'features/campaigns/components/SharedCard';
import useCampaigns from 'features/campaigns/hooks/useCampaigns';
import { useNumericRouteParams } from 'core/hooks';
import useServerSide from 'core/useServerSide';
import useSurveys from 'features/surveys/hooks/useSurveys';
import { Msg, useMessages } from 'core/i18n';
import ZUINumberChip from 'zui/ZUINumberChip';
import { ZetkinCampaign } from 'utils/types/zetkin';
import useActivitiyOverview from 'features/campaigns/hooks/useActivityOverview';
import ZUIFutures from 'zui/ZUIFutures';
import { IFuture } from 'core/caching/futures';

const scaffoldOptions = {
  authLevelRequired: 2,
  localeScope: [
    'layout.organize',
    'misc.breadcrumbs',
    'pages.organizeAllCampaigns',
    'misc.formDialog',
  ],
};

export const getServerSideProps: GetServerSideProps = scaffold(async (ctx) => {
  const { orgId } = ctx.params!;

  const apiClient = new BackendApiClient(ctx.req.headers);
  const orgState = await apiClient.get(`/api/orgs/${orgId}`);

  if (orgState) {
    return {
      props: {},
    };
  } else {
    return {
      notFound: true,
    };
  }
}, scaffoldOptions);

const LoadingPageIndicator = () => {
  const messages = useMessages(messageIds);

  return (
    <>
      <Head>
        <title>{messages.layout.allCampaigns()}</title>
      </Head>
      <ActivitiesOverviewSkeleton />
      <Box
        sx={{
          alignItems: 'center',
          display: 'flex',
          justifyContent: 'space-between',
          paddingTop: 8,
        }}
      >
        <Typography sx={{ maxWidth: '100%' }} variant="h4">
          <Skeleton sx={{ maxWidth: '100%' }} width={'400px'} />
        </Typography>
      </Box>
      <Box component="section" mt={4} sx={{ maxWidth: '100%' }}>
        <Box
          component="header"
          sx={{
            alignItems: 'center',
            display: 'flex',
            justifyContent: 'space-between',
            paddingBottom: 1,
          }}
        >
          <Typography mb={2} sx={{ maxWidth: '100%' }} variant="h5">
            <Skeleton sx={{ maxWidth: '100%' }} width={'100px'} />
          </Typography>
        </Box>
        <Grid container spacing={2}>
          {new Array(8).fill(0).map((campaign, index) => (
            <Grid key={index} size={{ lg: 3, md: 4, xs: 12 }}>
              <Skeleton sx={{ height: '117px' }} variant={'rounded'} />
            </Grid>
          ))}
        </Grid>
      </Box>
    </>
  );
};

function LoadingBoundary<G extends Record<string, unknown>>({
  children,
  futures,
}: {
  children: ReactElement;
  futures: { [I in keyof G]: IFuture<G[I]> };
}) {
  return (
    <Suspense fallback={<LoadingPageIndicator />}>
      <ZUIFutures futures={futures} loadingIndicator={<LoadingPageIndicator />}>
        {children}
      </ZUIFutures>
    </Suspense>
  );
}

const AllCampaignsSummaryPage: PageWithLayout = () => {
  const theme = useTheme();
  const messages = useMessages(messageIds);
  const { orgId } = useNumericRouteParams();

  const campaignsFuture = useCampaigns(orgId);
  const surveysFuture = useSurveys(orgId);
  const activityOverviewFuture = useActivitiyOverview(orgId);

  const campaigns = campaignsFuture.data || [];
  campaigns.reverse();
  const [searchString, setSearchString] = useState('');
  const [showArchived, setShowArchived] = useState(false);

  const archivedRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (archivedRef.current) {
      archivedRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [showArchived]);

  const onServer = useServerSide();
  const surveys = surveysFuture.data ?? [];

  const search = () => {
    const fuse = new Fuse(campaigns, {
      keys: ['title', 'info_text'],
      threshold: 0.4,
    });

    return fuse.search(searchString).map((fuseResult) => fuseResult.item);
  };

  const campaignsThatMatchSearch = useMemo(() => search(), [searchString]);

  const [activeCampaigns, archivedCampaigns] = useMemo(() => {
    let archived: ZetkinCampaign[] = [];
    let active: ZetkinCampaign[] = [];

    if (searchString) {
      active = campaignsThatMatchSearch.filter(
        (campaign) => !campaign.archived
      );
      archived = campaignsThatMatchSearch.filter(
        (campaign) => campaign.archived
      );
    } else {
      active = campaigns.filter((campaign) => !campaign.archived);
      archived = campaigns.filter((campaign) => campaign.archived);
    }

    return [active, archived];
  }, [campaigns, searchString]);

  if (onServer) {
    return null;
  }

  //The shared card is currently only visible when there are shared surveys, but there will be more shared activities in the future.
  const sharedSurveys = surveys.filter(
    (survey) =>
      survey.org_access === 'suborgs' && survey.organization.id != orgId
  );

  return (
    <LoadingBoundary
      futures={{
        activityOverviewFuture,
        campaignsFuture,
        surveysFuture,
      }}
    >
      <>
        <Head>
          <title>{messages.layout.allCampaigns()}</title>
        </Head>
        <ActivitiesOverview orgId={orgId} />
        <Box
          sx={{
            alignItems: 'center',
            display: 'flex',
            justifyContent: 'space-between',
            paddingTop: 8,
          }}
        >
          <Typography variant="h4">
            <Msg id={messageIds.all.header} />
          </Typography>
          <TextField
            onChange={(evt) => {
              setSearchString(evt.target.value);
            }}
            placeholder={messages.all.campaignFilterPlaceholder()}
            slotProps={{
              input: {
                endAdornment: searchString ? (
                  <IconButton onClick={() => setSearchString('')}>
                    <Close color="secondary" />
                  </IconButton>
                ) : undefined,
                startAdornment: (
                  <Search color="secondary" sx={{ marginRight: 1 }} />
                ),
              },
            }}
            value={searchString}
            variant="outlined"
          />
        </Box>
        <Box component="section" mt={4}>
          <Box
            component="header"
            sx={{
              alignItems: 'center',
              display: 'flex',
              justifyContent: 'space-between',
              paddingBottom: 1,
            }}
          >
            <Typography mb={2} variant="h5">
              <Msg id={messageIds.activeCampaigns.header} />
            </Typography>
          </Box>
          <Grid container spacing={2}>
            {sharedSurveys.length > 0 && (
              <Grid size={{ lg: 3, md: 4, xs: 12 }}>
                <SharedCard />
              </Grid>
            )}
            {activeCampaigns.map((campaign) => (
              <Grid key={campaign.id} size={{ lg: 3, md: 4, xs: 12 }}>
                <CampaignCard campaign={campaign} />
              </Grid>
            ))}
          </Grid>
        </Box>
        {archivedCampaigns.length > 0 && (
          <Box component="section" sx={{ marginBottom: 16, marginTop: 4 }}>
            <Box
              component="header"
              sx={{
                alignItems: 'center',
                display: 'flex',
                justifyContent: 'space-between',
                paddingBottom: 1,
              }}
            >
              <Box sx={{ alignItems: 'center', display: 'flex', gap: 1 }}>
                <Typography variant="h5">
                  <Msg id={messageIds.archivedCampaigns.header} />
                </Typography>
                <ZUINumberChip
                  color={theme.palette.grey[200]}
                  size="sm"
                  value={archivedCampaigns.length}
                />
              </Box>
              <Button
                onClick={() => {
                  setShowArchived(!showArchived);
                }}
              >
                <Msg
                  id={
                    showArchived
                      ? messageIds.archivedCampaigns.hideShowButton.hide
                      : messageIds.archivedCampaigns.hideShowButton.show
                  }
                />
              </Button>
            </Box>
            {showArchived && (
              <Grid ref={archivedRef} container spacing={2}>
                {archivedCampaigns.map((campaign) => (
                  <Grid key={campaign.id} size={{ lg: 3, md: 4, xs: 12 }}>
                    <CampaignCard campaign={campaign} />
                  </Grid>
                ))}
              </Grid>
            )}
          </Box>
        )}
      </>
    </LoadingBoundary>
  );
};

AllCampaignsSummaryPage.getLayout = function getLayout(page) {
  return <AllCampaignsLayout>{page}</AllCampaignsLayout>;
};

export default AllCampaignsSummaryPage;
