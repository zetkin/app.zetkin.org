import { useRouter } from 'next/router';

import SimpleLayout from 'utils/layout/SimpleLayout';
import useFolder from '../hooks/useFolder';
import useItemSummary from '../hooks/useItemSummary';
import useViewBrowserMutation from '../hooks/useViewBrowserMutation';
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
  const parsedOrgId = parseInt(orgId as string);

  const { folderFuture } = useFolder(parsedOrgId, folderId);
  const { itemSummaryFuture } = useItemSummary(parsedOrgId, folderId);
  const { renameItem } = useViewBrowserMutation(parsedOrgId);

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
                renameItem('folder', data.id, newTitle);
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
