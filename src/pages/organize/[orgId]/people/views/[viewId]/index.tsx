import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { useQuery } from 'react-query';

import getOrg from 'utils/fetching/getOrg';
import getView from 'features/views/fetching/getView';
import getViewColumns from 'features/views/fetching/getViewColumns';
import getViewRows from 'features/views/fetching/getViewRows';
import { PageWithLayout } from 'utils/types';
import { scaffold } from 'utils/next';
import SingleViewLayout from 'features/views/layout/SingleViewLayout';
import ViewDataTable from 'features/views/components/ViewDataTable';
import ZUIQuery from 'zui/ZUIQuery';

const scaffoldOptions = {
  authLevelRequired: 2,
  localeScope: ['layout.organize', 'pages.people.views'],
};

export const getServerSideProps: GetServerSideProps = scaffold(async (ctx) => {
  const { orgId, viewId } = ctx.params!;

  await ctx.queryClient.prefetchQuery(
    ['org', orgId],
    getOrg(orgId as string, ctx.apiFetch)
  );
  const orgState = ctx.queryClient.getQueryState(['org', orgId]);

  await ctx.queryClient.prefetchQuery(
    ['view', viewId],
    getView(orgId as string, viewId as string, ctx.apiFetch)
  );

  const viewState = ctx.queryClient.getQueryState(['view', viewId]);

  if (orgState?.data && viewState?.data) {
    return {
      props: {
        orgId,
        viewId,
      },
    };
  } else {
    return {
      notFound: true,
    };
  }
}, scaffoldOptions);

type SingleViewPageProps = {
  orgId: string;
  viewId: string;
};

const SingleViewPage: PageWithLayout<SingleViewPageProps> = ({
  orgId,
  viewId,
}) => {
  return (
    <ZUIQuery
      queries={{
        colsQuery: useQuery(
          ['view', viewId, 'columns'],
          getViewColumns(orgId, viewId)
        ),
        rowsQuery: useQuery(
          ['view', viewId, 'rows'],
          getViewRows(orgId, viewId)
        ),
        viewQuery: useQuery(['view', viewId], getView(orgId, viewId)),
      }}
    >
      {({ queries: { colsQuery, rowsQuery, viewQuery } }) => (
        <>
          <Head>
            <title>{viewQuery.data.title}</title>
          </Head>
          <ViewDataTable
            columns={colsQuery.data}
            rows={rowsQuery.data}
            view={viewQuery.data}
          />
        </>
      )}
    </ZUIQuery>
  );
};

SingleViewPage.getLayout = function getLayout(page) {
  return <SingleViewLayout>{page}</SingleViewLayout>;
};

export default SingleViewPage;
