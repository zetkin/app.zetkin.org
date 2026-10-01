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
import { ZetkinView } from 'features/views/components/types';
import useCustomFields from 'features/profile/hooks/useCustomFields';

const scaffoldOptions = {
  allowNonOfficials: true,
  authLevelRequired: 2,
  localeScope: ['layout.organize', 'pages.people.lists'],
};

export const getServerSideProps: GetServerSideProps = scaffold(async (ctx) => {
  const { orgId, viewId } = ctx.params!;

  const apiClient = new BackendApiClient(ctx.req.headers);

  // Verify that the user may read the view. Officials are allowed by role,
  // while non-officials are only allowed if the view has been shared with them.
  try {
    await apiClient.get<ZetkinView>(`/api/orgs/${orgId}/people/views/${viewId}`);
  } catch {
    return {
      notFound: true,
    };
  }

  // Check if user is an official
  const officialMemberships = await getUserMemberships(ctx, false);
  const isOfficialMember = officialMemberships.includes(
    parseInt(orgId as string)
  );

  const isSuperUser = !!ctx.user?.is_superuser;

  if (isOfficialMember || isSuperUser) {
    return {
      props: {
        orgId,
        viewId,
      },
    };
  }

  // The user is not an official, so the list must have been explicitly shared
  // with them for them to have access. Send them to the read-only view.
  return {
    props: {
      orgId,
      viewId,
    },
    redirect: {
      destination: `/organize/${orgId}/people/lists/${viewId}/shared`,
      permanent: false,
    },
  };
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
  const viewFuture = useView(parsedOrgId, parsedViewId);
  const customFieldsFuture = useCustomFields(parsedOrgId);

  if (onServer) {
    return null;
  }

  return (
    <ZUIFutures
      futures={{
        cols: columnsFuture,
        customFields: customFieldsFuture,
        rows: rowsFuture,
        view: viewFuture,
      }}
    >
      {({ data: { cols, customFields, rows, view } }) => (
        <>
          <Head>
            <title>{view.title}</title>
          </Head>

          <AccessLevelProvider>
            {!columnsFuture.isLoading || !!columnsFuture.data?.length ? (
              <ViewDataTable
                columns={cols}
                customFields={customFields}
                rows={rows}
                rowSelection={{
                  mode: 'selectWithBulkActions',
                }}
                view={view}
              />
            ) : null}
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
