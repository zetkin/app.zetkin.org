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
import { ZetkinMembership } from 'utils/types/zetkin';
import { ZetkinObjectAccess } from 'core/api/types';
import ZUIFutures from 'zui/ZUIFutures';
import { ZetkinView } from 'features/views/components/types';
import messageIds from 'features/views/l10n/messageIds';
import { getBrowserLanguage } from 'utils/locale';
import getServerMessages from 'core/i18n/server';

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

  let accessList: ZetkinObjectAccess[] = [];
  try {
    accessList = await apiClient.get<ZetkinObjectAccess[]>(
      `/api/orgs/${orgId}/people/views/${viewId}/access`
    );
  } catch (e) {
    if ((e as Error).message == 'Error during request: 403') {
      return null;
    }
  }
  const accessObject = accessList.find(
    (obj) => obj.person.id == myMembership.profile.id
  );

  return accessObject?.level ?? null;
}

export const getServerSideProps: GetServerSideProps = scaffold(async (ctx) => {
  const { orgId, viewId } = ctx.params!;

  // TODO: Handle this some other way with server-side models?
  const apiClient = new BackendApiClient(ctx.req.headers);
  let accessLevel = await getAccessLevel(
    apiClient,
    parseInt(orgId as string),
    parseInt(viewId as string)
  );

  try {
    await apiClient.get<ZetkinView>(
      `/api/orgs/${orgId}/people/views/${viewId}`
    );
  } catch (err) {
    accessLevel = null;
  }

  let message = '';
  if (accessLevel == null) {
    const lang = getBrowserLanguage(ctx.req);
    const messages = await getServerMessages(lang, messageIds);
    message = messages.shareDialog.share.disallowedAccess();
  }

  return {
    props: {
      accessLevel,
      message,
      orgId,
      viewId,
    },
  };
}, scaffoldOptions);

type SharedViewPageProps = {
  accessLevel: ZetkinObjectAccess['level'];
  message: string;
  orgId: string;
  viewId: string;
};

const SharedViewPage: PageWithLayout<SharedViewPageProps> = ({
  accessLevel,
  message,
  orgId,
  viewId,
}) => {
  if (accessLevel === null) {
    return <p>{message}</p>;
  }

  const parsedOrgId = parseInt(orgId);
  const parsedViewId = parseInt(viewId);

  // Allow conditional hooks here since `accessLevel` will never change, meaning we will not break
  // the rules of hooks.
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { columnsFuture, rowsFuture } = useViewGrid(parsedOrgId, parsedViewId);
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const viewFuture = useView(parsedOrgId, parsedViewId);
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const canConfigure = accessLevel == 'configure';

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const onServer = useServerSide();
  if (onServer) {
    return null;
  }

  return (
    <ZUIFutures
      futures={{
        cols: columnsFuture,
        rows: rowsFuture,
        view: viewFuture,
      }}
    >
      {({ data: { cols, rows, view } }) => (
        <>
          <Head>
            <title>{view.title}</title>
          </Head>
          <AccessLevelProvider accessLevel={accessLevel} isRestricted={true}>
            {!columnsFuture.isLoading ? (
              <ViewDataTable
                columns={cols}
                disableBulkActions
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
  return page.props.accessLevel == null ? (
    <div>{page}</div>
  ) : (
    <SharedViewLayout>{page}</SharedViewLayout>
  );
};

export default SharedViewPage;
