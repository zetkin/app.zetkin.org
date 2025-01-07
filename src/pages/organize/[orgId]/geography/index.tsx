import { GetServerSideProps } from 'next';
import Head from 'next/head';
import dynamic from 'next/dynamic';

import SimpleLayout from 'utils/layout/SimpleLayout';
import { scaffold } from 'utils/next';
import { PageWithLayout } from 'utils/types';
import useAreas from 'features/areas/hooks/useAreas';
import { useNumericRouteParams } from 'core/hooks';
import ZUIFuture from 'zui/ZUIFuture';
import { AREAS } from 'utils/featureFlags';
import { Msg, useMessages } from 'core/i18n';
import messageIds from 'features/areas/l10n/messageIds';

const scaffoldOptions = {
  authLevelRequired: 2,
  featuresRequired: [AREAS],
};

export const getServerSideProps: GetServerSideProps = scaffold(async () => {
  return {
    props: {},
  };
}, scaffoldOptions);

const GeographyMap = dynamic(
  () => import('../../../../features/geography/components/GeographyMap/index'),
  { ssr: false }
);

const GeographyPage: PageWithLayout = () => {
  const { orgId } = useNumericRouteParams();
  const messages = useMessages(messageIds);
  const areasFuture = useAreas(orgId);

  return (
    <>
      <Head>
        <title>{messages.page.title()}</title>
      </Head>
      <ZUIFuture future={areasFuture}>
        {(areas) => <GeographyMap areas={areas} />}
      </ZUIFuture>
    </>
  );
};

GeographyPage.getLayout = function getLayout(page) {
  return (
    <SimpleLayout
      ellipsisMenuItems={[]}
      fixedHeight
      title={<Msg id={messageIds.page.title} />}
    >
      {page}
    </SimpleLayout>
  );
};

export default GeographyPage;
