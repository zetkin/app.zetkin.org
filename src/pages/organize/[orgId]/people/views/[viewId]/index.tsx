import { GetServerSideProps } from 'next';
import Head from 'next/head';

import getOrg from 'utils/fetching/getOrg';
import getUserMemberships from 'utils/getUserMemberships';
import getView from 'features/views/fetching/getView';
import { PageWithLayout } from 'utils/types';
import { scaffold } from 'utils/next';
import SingleViewLayout from 'features/views/layout/SingleViewLayout';
import useModel from 'core/useModel';
import ViewDataModel from 'features/views/models/ViewDataModel';
import ViewDataTable from 'features/views/components/ViewDataTable';
import ZUIFutures from 'zui/ZUIFutures';

const scaffoldOptions = {
  allowNonOfficials: true,
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
    // Check if user is an official
    // TODO: Consider moving this to some more general-purpose utility
    const officialMemberships = await getUserMemberships(ctx, false);
    if (!officialMemberships.includes(parseInt(orgId as string))) {
      // The user does NOT have this organization among it's official memberships
      // but they did have access to the view, so the view must have been shared
      // with them.
      return {
        props: {
          orgId,
          viewId,
        },
        redirect: {
          destination: `/organize/${orgId}/people/views/${viewId}/shared`,
          permament: false,
        },
      };
    } else {
      return {
        props: {
          orgId,
          viewId,
        },
      };
    }
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
  const model = useModel(
    (env) => new ViewDataModel(env, parseInt(orgId), parseInt(viewId))
  );

  return (
    <ZUIFutures
      futures={{
        cols: model.getColumns(),
        rows: model.getRows(),
        view: model.getView(),
      }}
    >
      {({ data: { cols, rows, view } }) => (
        <>
          <Head>
            <title>{view.title}</title>
          </Head>
          <ViewDataTable columns={cols} rows={rows} view={view} />
        </>
      )}
    </ZUIFutures>
  );
};

SingleViewPage.getLayout = function getLayout(page) {
  return <SingleViewLayout>{page}</SingleViewLayout>;
};

export default SingleViewPage;
