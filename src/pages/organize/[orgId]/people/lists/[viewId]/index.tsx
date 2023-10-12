import { GetServerSideProps } from 'next';
import Head from 'next/head';

import { AccessLevelProvider } from 'features/views/hooks/useAccessLevel';
import BackendApiClient from 'core/api/client/BackendApiClient';
import getUserMemberships from 'utils/getUserMemberships';
import { PageWithLayout } from 'utils/types';
import { scaffold } from 'utils/next';
import SingleViewLayout from 'features/views/layout/SingleViewLayout';
import useServerSide from 'core/useServerSide';
import useView from 'features/views/hooks/useView';
import useViewGrid from 'features/views/hooks/useViewGrid';
import ViewDataTable from 'features/views/components/ViewDataTable';
import ZUIFutures from 'zui/ZUIFutures';

const scaffoldOptions = {
  allowNonOfficials: true,
  authLevelRequired: 2,
  localeScope: ['layout.organize', 'pages.people.lists'],
};

export const getServerSideProps: GetServerSideProps = scaffold(async (ctx) => {
  const { orgId, viewId } = ctx.params!;

  const apiClient = new BackendApiClient(ctx.req.headers);
  const view = await apiClient.get(`/api/orgs/${orgId}/people/views/${viewId}`);

  if (view) {
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
          destination: `/organize/${orgId}/people/lists/${viewId}/shared`,
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
  const onServer = useServerSide();

  const parsedOrgId = parseInt(orgId);
  const parsedViewId = parseInt(viewId);

  const { columnsFuture, rowsFuture } = useViewGrid(parsedOrgId, parsedViewId);
  const { getView } = useView(parsedOrgId);

  if (onServer) {
    return null;
  }

  return (
    <ZUIFutures
      futures={{
        cols: columnsFuture,
        rows: rowsFuture,
        view: getView(parsedViewId),
      }}
    >
      {({ data: { cols, rows, view } }) => (
        <>
          <Head>
            <title>{view.title}</title>
          </Head>

          <AccessLevelProvider>
            <>
              {(!columnsFuture.isLoading || !!columnsFuture.data?.length) && (
                <ViewDataTable columns={cols} rows={rows} view={view} />
              )}
            </>
          </AccessLevelProvider>
        </>
      )}
    </ZUIFutures>
  );
};

SingleViewPage.getLayout = function getLayout(page) {
  return <SingleViewLayout>{page}</SingleViewLayout>;
};

export default SingleViewPage;
