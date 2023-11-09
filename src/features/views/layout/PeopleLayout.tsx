import PeopleActionButton from '../components/PeopleActionButton';
import SimpleLayout from 'utils/layout/SimpleLayout';
import { useMessages } from 'core/i18n';
import useServerSide from 'core/useServerSide';
import ViewFolderSubtitle from '../components/ViewFolderSubtitle';
import ZUIFuture from 'zui/ZUIFuture';

import messageIds from '../l10n/messageIds';
import useItemSummary from '../hooks/useItemSummary';
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

  const onServer = useServerSide();
  if (onServer) {
    return null;
  }

  return (
    <SimpleLayout
<<<<<<< HEAD
      actionButtons={<PeopleActionButton folderId={null} />}
=======
      actionButtons={<PeopleActionButton folderId={null} orgId={orgId} />}
>>>>>>> epic-1595/import
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
      title={messages.browserLayout.title()}
    >
      {children}
    </SimpleLayout>
  );
};

export default PeopleLayout;
