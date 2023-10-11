import { GetServerSideProps } from 'next';
import Head from 'next/head';

import { AccessLevelProvider } from 'features/views/hooks/useAccessLevel';
import BackendApiClient from 'core/api/client/BackendApiClient';
import IApiClient from 'core/api/client/IApiClient';
import { PageWithLayout } from 'utils/types';
import { scaffold } from 'utils/next';
import SharedViewLayout from 'features/views/layout/SharedViewLayout';
import useGrid from 'features/views/hooks/useGrid';
import useModel from 'core/useModel';
import useServerSide from 'core/useServerSide';
import useView from 'features/views/hooks/useView';
import ViewDataModel from 'features/views/models/ViewDataModel';
import { ViewDataModelProvider } from 'features/views/hooks/useViewDataModel';
import ViewDataTable from 'features/views/components/ViewDataTable';
import { ZetkinMembership } from 'utils/types/zetkin';
import { ZetkinObjectAccess } from 'core/api/types';
import ZUIFutures from 'zui/ZUIFutures';

const scaffoldOptions = {
  allowNonOfficials: true,
  authLevelRequired: 2,
  localeScope: ['layout.organize', 'pages.people.lists'],
};

async function getAccessLevel(
  apiClient: IApiClient,
  orgId: number,
  viewId: number
): Promise<ZetkinObjectAccess['level'] | null> {
  const memberships = await apiClient.get<ZetkinMembership[]>(
    `/api/users/me/memberships`
  );
  const myMembership = memberships.find((mem) => mem.organization.id == orgId);

  if (!myMembership) {
    // NOTE: Might be superuser
    return null;
  }

  const isOfficial = Boolean(myMembership.role);
  if (isOfficial) {
    return 'configure';
  }

  const accessList = await apiClient.get<ZetkinObjectAccess[]>(
    `/api/orgs/${orgId}/people/views/${viewId}/access`
  );
  const accessObject = accessList.find(
    (obj) => obj.person.id == myMembership.profile.id
  );

  return accessObject?.level ?? null;
}

export const getServerSideProps: GetServerSideProps = scaffold(async (ctx) => {
  const { orgId, viewId } = ctx.params!;

  // TODO: Handle this some other way with server-side models?
  const apiClient = new BackendApiClient(ctx.req.headers);
  const accessLevel = await getAccessLevel(
    apiClient,
    parseInt(orgId as string),
    parseInt(viewId as string)
  );

  try {
    await apiClient.get(`/api/orgs/${orgId}/people/views/${viewId}`);

    return {
      props: {
        accessLevel,
        orgId,
        viewId,
      },
    };
  } catch (err) {
    return {
      notFound: true,
    };
  }
}, scaffoldOptions);

type SharedViewPageProps = {
  accessLevel: ZetkinObjectAccess['level'];
  orgId: string;
  viewId: string;
};

const SharedViewPage: PageWithLayout<SharedViewPageProps> = ({
  accessLevel,
  orgId,
  viewId,
}) => {
  const model = useModel(
    (env) => new ViewDataModel(env, parseInt(orgId), parseInt(viewId))
  );
  const parsedOrgId = parseInt(orgId);
  const parsedViewId = parseInt(viewId);

  const { columnsFuture, rowsFuture } = useGrid(parsedOrgId, parsedViewId);
  const { getView } = useView(parsedOrgId);
  const canConfigure = accessLevel == 'configure';

  const onServer = useServerSide();
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
          <ViewDataModelProvider model={model}>
            <AccessLevelProvider accessLevel={accessLevel} isRestricted={true}>
              <>
                {!columnsFuture.isLoading && (
                  <ViewDataTable
                    columns={cols}
                    disableBulkActions
                    disableConfigure={!canConfigure}
                    rows={rows}
                    view={view}
                  />
                )}
              </>
            </AccessLevelProvider>
          </ViewDataModelProvider>
        </>
      )}
    </ZUIFutures>
  );
};

SharedViewPage.getLayout = function getLayout(page) {
  return <SharedViewLayout>{page}</SharedViewLayout>;
};

export default SharedViewPage;
