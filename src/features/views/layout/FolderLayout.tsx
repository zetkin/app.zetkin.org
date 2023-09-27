import { useRouter } from 'next/router';

import SimpleLayout from 'utils/layout/SimpleLayout';
import useModel from 'core/useModel';
import useViewBrowser from '../hooks/useViewBrowser';
import ViewBrowserModel from '../models/ViewBrowserModel';
import ViewFolderActionButtons from '../components/ViewFolderActionButtons';
import ViewFolderSubtitle from '../components/ViewFolderSubtitle';
import ZUIEditTextinPlace from 'zui/ZUIEditTextInPlace';
import ZUIFuture from 'zui/ZUIFuture';

interface FolderLayoutProps {
  children: React.ReactNode;
  folderId: number;
}

const FolderLayout: React.FunctionComponent<FolderLayoutProps> = ({
  children,
  folderId,
}) => {
  const { orgId } = useRouter().query;
  const { folderData } = useViewBrowser(parseInt(orgId as string), folderId);
  const model = useModel(
    (env) => new ViewBrowserModel(env, parseInt(orgId as string))
  );

  return (
    <ZUIFuture future={folderData}>
      {(data) => (
        <SimpleLayout
          actionButtons={<ViewFolderActionButtons folderId={folderId} />}
          noPad
          subtitle={
            <ZUIFuture future={model.getItemSummary(folderId)}>
              {(data) => (
                <ViewFolderSubtitle
                  numFolders={data.folders}
                  numViews={data.views}
                />
              )}
            </ZUIFuture>
          }
          title={
            <ZUIEditTextinPlace
              key={data.id}
              onChange={(newTitle) => {
                model.renameItem('folder', data.id, newTitle);
              }}
              value={data.title}
            />
          }
        >
          {children}
        </SimpleLayout>
      )}
    </ZUIFuture>
  );
};

export default FolderLayout;
