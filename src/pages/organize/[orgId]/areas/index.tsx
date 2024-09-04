import { GetServerSideProps } from 'next';
import Head from 'next/head';
import dynamic from 'next/dynamic';

import SimpleLayout from 'utils/layout/SimpleLayout';
import { scaffold } from 'utils/next';
import { PageWithLayout } from 'utils/types';
import useAreas from 'features/areas/hooks/useAreas';
import { useNumericRouteParams } from 'core/hooks';
import ZUIFuture from 'zui/ZUIFuture';
import hasFeature from 'utils/featureFlags/hasFeature';

const scaffoldOptions = {
  authLevelRequired: 2,
};

export const getServerSideProps: GetServerSideProps = scaffold(async (ctx) => {
  const { orgId } = ctx.params!;
  const hasAreas = hasFeature('AREAS', parseInt(orgId as string), process.env);

  if (!hasAreas) {
    return {
      notFound: true,
    };
  }

  return {
    props: {},
  };
}, scaffoldOptions);

const AreasMap = dynamic(
  () => import('../../../../features/areas/components/AreasMap'),
  { ssr: false }
);

const AreasPage: PageWithLayout = () => {
  const { orgId } = useNumericRouteParams();
  const areasFuture = useAreas(orgId);

  return (
    <>
      <Head>
        <title>Areas</title>
      </Head>
      <ZUIFuture future={areasFuture}>
        {(areas) => <AreasMap areas={areas} />}
      </ZUIFuture>
    </>
  );
};

AreasPage.getLayout = function getLayout(page) {
  return (
    <SimpleLayout ellipsisMenuItems={[]} fixedHeight title={'Areas'}>
      {page}
    </SimpleLayout>
  );
};

export default AreasPage;
