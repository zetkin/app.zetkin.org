import { PropsWithChildren } from 'react';

import PeopleActionButton from '../components/PeopleActionButton';
import { useMessages } from 'core/i18n';
import useServerSide from 'core/useServerSide';
import ViewFolderSubtitle from '../components/ViewFolderSubtitle';
import ZUIFuture from 'zui/ZUIFuture';
import messageIds from '../l10n/messageIds';
import { TabbedLayoutHeader } from 'utils/layout/TabbedLayout';
import useItemSummary from '../hooks/useItemSummary';
import useJoinSubmissions from 'features/joinForms/hooks/useJoinSubmissions';
import { useNumericRouteParams } from 'core/hooks';
import DefaultLayout from 'utils/layout/DefaultLayout';

interface PeopleLayoutProps {
  children: React.ReactNode;
  hideHeader?: boolean;
}

export const PeopleHeader: React.FunctionComponent<PropsWithChildren> = ({
  children,
}) => {
  const { orgId } = useNumericRouteParams();
  const messages = useMessages(messageIds);
  const itemSummaryFuture = useItemSummary(orgId, null);

  const { data: submissions } = useJoinSubmissions(orgId);
  const pendingSubmissions = submissions?.filter(
    (submission) => submission.state === 'pending'
  );

  return (
    <TabbedLayoutHeader
      actionButtons={<PeopleActionButton folderId={null} orgId={orgId} />}
      baseHref={`/organize/${orgId}/people`}
      defaultTab="/"
      noPad
      subtitle={
        <ZUIFuture future={itemSummaryFuture}>
          {(data) => (
            <ViewFolderSubtitle
              numFolders={data.folders}
              numViews={data.views}
            />
          )}
        </ZUIFuture>
      }
      tabs={[
        { href: `/`, label: messages.browserLayout.tabs.views() },
        {
          href: `/duplicates`,
          label: messages.browserLayout.tabs.duplicates(),
        },
        {
          href: `/joinforms`,
          label: messages.browserLayout.tabs.joinForms(),
        },
        {
          badge: pendingSubmissions?.length || 0,
          href: '/incoming',
          label: messages.browserLayout.tabs.incoming(),
        },
      ]}
      title={messages.browserLayout.title()}
    >
      {children}
    </TabbedLayoutHeader>
  );
};

const PeopleLayout: React.FunctionComponent<PeopleLayoutProps> = ({
  children,
  hideHeader,
}) => {
  const messages = useMessages(messageIds);

  const onServer = useServerSide();
  if (onServer) {
    return null;
  }

  return (
    <DefaultLayout title={messages.browserLayout.title()}>
      {hideHeader ? children : <PeopleHeader>{children}</PeopleHeader>}
    </DefaultLayout>
  );
};

export default PeopleLayout;
