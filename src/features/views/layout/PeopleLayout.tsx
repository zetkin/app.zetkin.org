import { useRouter } from 'next/router';

import SimpleLayout from 'utils/layout/SimpleLayout';
import { useMessages } from 'core/i18n';
import useServerSide from 'core/useServerSide';
import ViewFolderActionButtons from '../components/ViewFolderActionButtons';
import ViewFolderSubtitle from '../components/ViewFolderSubtitle';
import ZUIFuture from 'zui/ZUIFuture';

import messageIds from '../l10n/messageIds';
import useItemSummary from '../hooks/useItemSummary';

interface PeopleLayoutProps {
  children: React.ReactNode;
}

const PeopleLayout: React.FunctionComponent<PeopleLayoutProps> = ({
  children,
}) => {
  const { orgId } = useRouter().query;
  const messages = useMessages(messageIds);
  const { itemSummaryFuture } = useItemSummary(parseInt(orgId as string));

  const onServer = useServerSide();
  if (onServer) {
    return null;
  }

  return (
    <SimpleLayout
      actionButtons={<ViewFolderActionButtons folderId={null} />}
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
