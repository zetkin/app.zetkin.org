import { GetServerSideProps } from 'next';

import { PageWithLayout } from 'utils/types';
import SingleCampaignLayout from 'features/campaigns/layout/SingleCampaignLayout';

import { scaffold } from 'utils/next';

export const getServerSideProps: GetServerSideProps = scaffold(
  async (ctx) => {
    const { orgId, campId } = ctx.params!;

    return {
      props: {
        campId,
        orgId,
      },
    };
  },
  {
    authLevelRequired: 2,
    localeScope: ['layout.organize.surveys', 'pages.organizeSurvey'],
  }
);

interface CampaignActivitiesPageProps {
  campId: string;
  orgId: string;
}

const CampaignActivitiesPage: PageWithLayout<CampaignActivitiesPageProps> = ({
  campId,
  orgId,
}) => {
  return <>{`Hello ${campId} ${orgId}`}</>;
};

CampaignActivitiesPage.getLayout = function getLayout(page) {
  return <SingleCampaignLayout>{page}</SingleCampaignLayout>;
};

export default CampaignActivitiesPage;
