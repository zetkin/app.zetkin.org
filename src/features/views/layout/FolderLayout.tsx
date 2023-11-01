import PeopleActionButton from '../components/PeopleActionButton';
import SimpleLayout from 'utils/layout/SimpleLayout';
import useFolder from '../hooks/useFolder';
import useItemSummary from '../hooks/useItemSummary';
import { useNumericRouteParams } from 'core/hooks';
import useViewBrowserMutations from '../hooks/useViewBrowserMutations';
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
  const { orgId } = useNumericRouteParams();

  const { folderFuture } = useFolder(orgId, folderId);
  const itemSummaryFuture = useItemSummary(orgId, folderId);
  const { renameItem } = useViewBrowserMutations(orgId);

  return (
    <ZUIFuture future={folderFuture}>
      {(data) => (
        <SimpleLayout
          actionButtons={<PeopleActionButton folderId={folderId} />}
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
