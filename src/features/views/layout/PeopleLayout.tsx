import PeopleActionButton from '../components/PeopleActionButton';
import { useMessages } from 'core/i18n';
import useServerSide from 'core/useServerSide';
import ViewFolderSubtitle from '../components/ViewFolderSubtitle';
import ZUIFuture from 'zui/ZUIFuture';
import messageIds from '../l10n/messageIds';
import TabbedLayout from 'utils/layout/TabbedLayout';
import useItemSummary from '../hooks/useItemSummary';
import useJoinSubmissions from 'features/joinForms/hooks/useJoinSubmissions';
import { useNumericRouteParams } from 'core/hooks';

interface PeopleLayoutProps {
  children: React.ReactNode;
}

const PeopleLayout: React.FunctionComponent<PeopleLayoutProps> = ({
  children,
}) => {
  const { orgId } = useNumericRouteParams();
  const messages = useMessages(messageIds);
  const itemSummaryFuture = useItemSummary(orgId, null);

  const { data: submissions } = useJoinSubmissions(orgId);
  const pendingSubmissions = submissions?.filter(
    (submission) => submission.state === 'pending'
  );

  const onServer = useServerSide();
  if (onServer) {
    return null;
  }

  return (
    <TabbedLayout
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
        {
          href: "/test",
          label: "Test"
        }
      ]}
      title={messages.browserLayout.title()}
    >
      {children}
    </TabbedLayout>
  );
};

export default PeopleLayout;
