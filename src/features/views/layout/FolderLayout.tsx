import { useRouter } from 'next/router';

import SimpleLayout from 'utils/layout/SimpleLayout';
import useModel from 'core/useModel';
import ViewBrowserModel from '../models/ViewBrowserModel';
import ViewFolderActionButtons from '../components/ViewFolderActionButtons';
import ViewFolderSubtitle from '../components/ViewFolderSubtitle';
import ZUIEditTextinPlace from 'zui/ZUIEditTextInPlace';
import ZUIFuture from 'zui/ZUIFuture';
import useFolder from '../hooks/useFolder';
import useItemSummary from '../hooks/useItemSummary';

interface FolderLayoutProps {
  children: React.ReactNode;
  folderId: number;
}

const FolderLayout: React.FunctionComponent<FolderLayoutProps> = ({
  children,
  folderId,
}) => {
  const { orgId } = useRouter().query;
  const parsedOrgId = parseInt(orgId as string);

  const { folderFuture } = useFolder(parsedOrgId, folderId);
  const { itemSummaryFuture } = useItemSummary(parsedOrgId, folderId);

  const model = useModel(
    (env) => new ViewBrowserModel(env, parseInt(orgId as string))
  );

  return (
    <ZUIFuture future={folderFuture}>
      {(data) => (
        <SimpleLayout
          actionButtons={<ViewFolderActionButtons folderId={folderId} />}
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
