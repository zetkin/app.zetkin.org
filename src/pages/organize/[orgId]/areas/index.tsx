import { GetServerSideProps } from 'next';
import Head from 'next/head';
import dynamic from 'next/dynamic';

import SimpleLayout from 'utils/layout/SimpleLayout';
import { scaffold } from 'utils/next';
import { PageWithLayout } from 'utils/types';

const scaffoldOptions = {
  authLevelRequired: 2,
};

export const getServerSideProps: GetServerSideProps = scaffold(async () => {
  return {
    props: {},
  };
}, scaffoldOptions);

const AreasMap = dynamic(
  () => import('../../../../features/areas/components/AreasMap'),
  { ssr: false }
);

const AreasPage: PageWithLayout = () => {
  return (
    <>
      <Head>
        <title>Areas</title>
      </Head>
      <AreasMap />
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
