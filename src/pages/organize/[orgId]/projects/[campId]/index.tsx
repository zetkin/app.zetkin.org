import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { Box, Grid, Link, Typography } from '@mui/material';
import React, { Suspense, useCallback, useState } from 'react';

import ActivitiesOverview from 'features/campaigns/components/ActivitiesOverview';
import BackendApiClient from 'core/api/client/BackendApiClient';
import { PageWithLayout } from 'utils/types';
import { scaffold } from 'utils/next';
import SingleCampaignLayout from 'features/campaigns/layout/SingleCampaignLayout';
import useCampaign from 'features/campaigns/hooks/useCampaign';
import { useNumericRouteParams } from 'core/hooks';
import useServerSide from 'core/useServerSide';
import { ZetkinCampaign } from 'utils/types/zetkin';
import CampaignURLCard from 'features/campaigns/components/CampaignURLCard';
import ZUIFuture from 'zui/ZUIFuture';
import { useMessages } from 'core/i18n';
import messageIds from 'features/campaigns/l10n/messageIds';
import ZUIDialog from 'zui/ZUIDialog';
import CampaignDetailsForm from 'features/campaigns/components/CampaignDetailsForm';

const scaffoldOptions = {
  authLevelRequired: 2,
  localeScope: ['layout.organize', 'pages.organizeCampaigns'],
};

export const getServerSideProps: GetServerSideProps = scaffold(async (ctx) => {
  const { orgId, campId } = ctx.params!;

  const apiClient = new BackendApiClient(ctx.req.headers);

  try {
    await apiClient.get<ZetkinCampaign>(
      `/api/orgs/${orgId}/campaigns/${campId}`
    );
    return {
      props: {},
    };
  } catch (err) {
    return {
      notFound: true,
    };
  }
}, scaffoldOptions);

const CampaignSummaryPage: PageWithLayout = () => {
  const isOnServer = useServerSide();
  const { orgId, campId } = useNumericRouteParams();
  const { campaignFuture, updateCampaign } = useCampaign(orgId, campId);
  const messages = useMessages(messageIds);
  const [editCampaignDialogOpen, setEditCampaignDialogOpen] = useState(false);

  const openEditCampaign = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setEditCampaignDialogOpen(true);
    },
    [setEditCampaignDialogOpen]
  );

  if (isOnServer) {
    return null;
  }

  return (
    <ZUIFuture future={campaignFuture}>
      {(campaign) => {
        return (
          <>
            <Head>
              <title>{campaign.title}</title>
            </Head>
            <Grid container spacing={2}>
              <Grid size={{ lg: 8, md: 6 }}>
                <Box mb={campaign.info_text || campaign.manager ? 2 : 0}>
                  <Grid container spacing={2}>
                    <Grid size={{ lg: 12, md: 12, xs: 12 }}>
                      {campaign.info_text ? (
                        <Typography variant="body1">
                          {campaign.info_text}
                        </Typography>
                      ) : (
                        <Typography
                          sx={(theme) => ({
                            color: theme.palette.text.secondary,
                          })}
                          variant="body1"
                        >
                          {messages.activitiesOverview.noDescription.text({
                            addOneNow: (
                              <Link
                                onClick={openEditCampaign}
                                sx={{
                                  '&:hover': {
                                    textDecoration: 'underline',
                                  },
                                  cursor: 'pointer',
                                  textDecoration: 'none',
                                }}
                              >
                                {messages.activitiesOverview.noDescription.addOneNow()}
                              </Link>
                            ),
                          })}
                        </Typography>
                      )}
                    </Grid>
                  </Grid>
                </Box>
              </Grid>
              <Grid size={{ lg: 4, md: 6 }}>
                <CampaignURLCard
                  campId={campId}
                  isOpen={!!campaign.published}
                  orgId={orgId}
                />
              </Grid>
            </Grid>

            <Suspense>
              <ActivitiesOverview campaignId={campId} orgId={orgId} />
            </Suspense>

            <ZUIDialog
              onClose={() => setEditCampaignDialogOpen(false)}
              open={editCampaignDialogOpen}
              title={messages.form.edit()}
            >
              <CampaignDetailsForm
                campaign={campaign}
                onCancel={() => setEditCampaignDialogOpen(false)}
                onSubmit={(data) => {
                  updateCampaign({ ...data });
                  setEditCampaignDialogOpen(false);
                }}
              />
            </ZUIDialog>
          </>
        );
      }}
    </ZUIFuture>
  );
};

CampaignSummaryPage.getLayout = function getLayout(page) {
  return <SingleCampaignLayout>{page}</SingleCampaignLayout>;
};

export default CampaignSummaryPage;
