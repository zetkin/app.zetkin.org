import { GetServerSideProps } from 'next';
import Head from 'next/head';

import { AccessLevelProvider } from 'features/views/hooks/useAccessLevel';
import BackendApiClient from 'core/api/client/BackendApiClient';
import IApiClient from 'core/api/client/IApiClient';
import { PageWithLayout } from 'utils/types';
import { scaffold } from 'utils/next';
import SharedViewLayout from 'features/views/layout/SharedViewLayout';
import useServerSide from 'core/useServerSide';
import useView from 'features/views/hooks/useView';
import useViewGrid from 'features/views/hooks/useViewGrid';
import ViewDataTable from 'features/views/components/ViewDataTable';
import { ListAccessLevel, Zetkin2ListAccess } from 'features/views/types';
import ZUIFutures from 'zui/ZUIFutures';
import { ZetkinView } from 'features/views/components/types';
import useCustomFields from 'features/profile/hooks/useCustomFields';

const scaffoldOptions = {
  allowNonOfficials: true,
  authLevelRequired: 2,
  localeScope: ['layout.organize', 'pages.people.lists'],
};

async function getAccessLevel(
  apiClient: IApiClient,
  orgId: number,
  viewId: number
): Promise<ListAccessLevel | null> {
  try {
    const access = await apiClient.get<Zetkin2ListAccess>(
      `/api2/orgs/${orgId}/lists/${viewId}/access/me`
    );

    return access.level;
  } catch (e) {
    return null;
  }
}

export const getServerSideProps: GetServerSideProps = scaffold(async (ctx) => {
  const { orgId, viewId } = ctx.params!;

  const apiClient = new BackendApiClient(ctx.req.headers);
  const accessLevel = await getAccessLevel(
    apiClient,
    parseInt(orgId as string),
    parseInt(viewId as string)
  );

  if (accessLevel == null) {
    return {
      notFound: true,
    };
  }

  try {
    await apiClient.get<ZetkinView>(
      `/api/orgs/${orgId}/people/views/${viewId}`
    );
  } catch (err) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      accessLevel,
      orgId,
      viewId,
    },
  };
}, scaffoldOptions);

type SharedViewPageProps = {
  accessLevel: ListAccessLevel;
  orgId: string;
  viewId: string;
};

const SharedViewPage: PageWithLayout<SharedViewPageProps> = ({
  accessLevel,
  orgId,
  viewId,
}) => {
  const parsedOrgId = parseInt(orgId);
  const parsedViewId = parseInt(viewId);

  const { columnsFuture, rowsFuture } = useViewGrid(parsedOrgId, parsedViewId);
  const viewFuture = useView(parsedOrgId, parsedViewId);
  const customFieldsFuture = useCustomFields(parsedOrgId);
  const canConfigure = accessLevel == 'configure';

  const onServer = useServerSide();
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
          <AccessLevelProvider accessLevel={accessLevel} isRestricted={true}>
            {!columnsFuture.isLoading ? (
              <ViewDataTable
                columns={cols}
                customFields={customFields}
                disableConfigure={!canConfigure}
                rows={rows}
                view={view}
              />
            ) : null}
          </AccessLevelProvider>
        </>
      )}
    </ZUIFutures>
  );
};

SharedViewPage.getLayout = function getLayout(page) {
  return <SharedViewLayout>{page}</SharedViewLayout>;
};

export default SharedViewPage;
