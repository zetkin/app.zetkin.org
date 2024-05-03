import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { Suspense } from 'react';

import ActivitiesOverview from 'features/campaigns/components/ActivitiesOverview';
import messageIds from 'features/campaigns/l10n/messageIds';
import { PageWithLayout } from 'utils/types';
import { scaffold } from 'utils/next';
import SharedActivitiesLayout from 'features/campaigns/layout/SharedActivitiesLayout';
import { useMessages } from 'core/i18n';
import useServerSide from 'core/useServerSide';

const scaffoldOptions = {
  authLevelRequired: 2,
  localeScope: ['layout.organize.shared', 'pages.shared'],
};

export const getServerSideProps: GetServerSideProps = scaffold(async (ctx) => {
  const { orgId } = ctx.params!;
  return {
    props: {
      orgId,
    },
  };
}, scaffoldOptions);

interface SharedSummaryPageProps {
  orgId: string;
}

const SharedSummaryPage: PageWithLayout<SharedSummaryPageProps> = ({
  orgId,
}) => {
  const messages = useMessages(messageIds);
  const parsedOrgId = parseInt(orgId);
  const onServer = useServerSide();

  if (onServer) {
    return null;
  }

  return (
    <>
      <Head>
        <title>{messages.shared.title()}</title>
      </Head>
      <Suspense>
        <ActivitiesOverview isShared orgId={parsedOrgId} />
      </Suspense>
    </>
  );
};

SharedSummaryPage.getLayout = function getLayout(page, props) {
  return (
    <SharedActivitiesLayout orgId={props.orgId}>{page}</SharedActivitiesLayout>
  );
};

export default SharedSummaryPage;
