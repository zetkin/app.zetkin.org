import { useRouter } from 'next/router';

import SimpleLayout from 'utils/layout/SimpleLayout';
import { useMessages } from 'core/i18n';
import useModel from 'core/useModel';
import useServerSide from 'core/useServerSide';
import ViewBrowserModel from '../models/ViewBrowserModel';
import PeopleActionButton from '../components/PeopleActionButton';
import ViewFolderSubtitle from '../components/ViewFolderSubtitle';
import ZUIFuture from 'zui/ZUIFuture';

import messageIds from '../l10n/messageIds';

interface PeopleLayoutProps {
  children: React.ReactNode;
}

const PeopleLayout: React.FunctionComponent<PeopleLayoutProps> = ({
  children,
}) => {
  const { orgId } = useRouter().query;
  const messages = useMessages(messageIds);

  const model = useModel(
    (env) => new ViewBrowserModel(env, parseInt(orgId as string))
  );

  const onServer = useServerSide();
  if (onServer) {
    return null;
  }

  return (
    <SimpleLayout
      actionButtons={<PeopleActionButton folderId={null} model={model} />}
      noPad
      subtitle={
        <ZUIFuture future={model.getItemSummary()}>
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
