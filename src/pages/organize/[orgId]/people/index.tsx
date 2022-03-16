import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { useIntl } from 'react-intl';

import { PageWithLayout } from 'types';
import PeopleLayout from 'layout/organize/PeopleLayout';
import { scaffold } from 'utils/next';
import { viewsResource } from 'api/views';
import {
  CreateViewActionButton,
  SuggestedViews,
  ViewsListTable,
} from 'components/views';

const scaffoldOptions = {
  authLevelRequired: 2,
  localeScope: ['layout.organize', 'pages.people', 'misc'],
};

export const getServerSideProps: GetServerSideProps = scaffold(async (ctx) => {
  const { orgId } = ctx.params!;

  const { state: viewsQueryState } = await viewsResource(
    orgId as string
  ).prefetch(ctx);

  if (viewsQueryState?.status === 'success') {
    return {
      props: {
        orgId,
      },
    };
  } else {
    return {
      notFound: true,
    };
  }
}, scaffoldOptions);

type PeopleViewsPageProps = {
  orgId: string;
};

const PeopleViewsPage: PageWithLayout<PeopleViewsPageProps> = () => {
  const intl = useIntl();

  return (
    <>
      <Head>
        <title>
          {intl.formatMessage({
            id: 'layout.organize.people.title',
          })}
        </title>
      </Head>
      <SuggestedViews />
      <ViewsListTable />
      <CreateViewActionButton />
    </>
  );
};

PeopleViewsPage.getLayout = function getLayout(page) {
  return <PeopleLayout>{page}</PeopleLayout>;
};

export default PeopleViewsPage;
