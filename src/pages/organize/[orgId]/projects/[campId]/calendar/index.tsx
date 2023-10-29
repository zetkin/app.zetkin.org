import { GetServerSideProps } from 'next';
import Head from 'next/head';

import BackendApiClient from 'core/api/client/BackendApiClient';
import Calendar from 'features/calendar/components';
import messageIds from 'features/campaigns/l10n/messageIds';
import { PageWithLayout } from 'utils/types';
import { scaffold } from 'utils/next';
import SingleCampaignLayout from 'features/campaigns/layout/SingleCampaignLayout';
import useCampaign from 'features/campaigns/hooks/useCampaign';
import { useMessages } from 'core/i18n';
import { useNumericRouteParams } from 'core/hooks';
import useServerSide from 'core/useServerSide';
import { ZetkinCampaign } from 'utils/types/zetkin';

const scaffoldOptions = {
  authLevelRequired: 2,
  localeScope: [
    'layout.organize',
    'misc.breadcrumbs',
    'misc.calendar',
    'misc.formDialog',
    'misc.speedDial',
    'misc.tasks',
    'pages.organizeCampaigns',
  ],
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
  } catch (error) {
    return {
      notFound: true,
    };
  }
}, scaffoldOptions);

const CampaignCalendarPage: PageWithLayout = () => {
  const messages = useMessages(messageIds);
  const { orgId, campId } = useNumericRouteParams();
  const { campaignFuture } = useCampaign(orgId, campId);
  const campaign = campaignFuture.data;

  const isOnServer = useServerSide();
  if (isOnServer) {
    return null;
  }

  return (
    <>
      <Head>
        <title>{`${campaign?.title} - ${messages.layout.calendar()}`}</title>
      </Head>
      <Calendar />
    </>
  );
};

CampaignCalendarPage.getLayout = function getLayout(page) {
  return <SingleCampaignLayout fixedHeight>{page}</SingleCampaignLayout>;
};

export default CampaignCalendarPage;
