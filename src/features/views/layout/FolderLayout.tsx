import { PropsWithChildren } from 'react';

import PeopleActionButton from '../components/PeopleActionButton';
import { SimpleLayoutHeader } from 'utils/layout/SimpleLayout';
import useFolder from '../hooks/useFolder';
import useItemSummary from '../hooks/useItemSummary';
import { useNumericRouteParams } from 'core/hooks';
import useViewBrowserMutations from '../hooks/useViewBrowserMutations';
import ViewFolderSubtitle from '../components/ViewFolderSubtitle';
import ZUIEditTextinPlace from 'zui/ZUIEditTextInPlace';
import ZUIFuture from 'zui/ZUIFuture';
import DefaultLayout from 'utils/layout/DefaultLayout';

interface FolderLayoutProps {
  children?: React.ReactNode;
  folderId: number;
}

export const FolderHeader: React.FunctionComponent<FolderLayoutProps> = ({
  children,
  folderId,
}) => {
  const { orgId } = useNumericRouteParams();

  const { folderFuture } = useFolder(orgId, folderId);
  const itemSummaryFuture = useItemSummary(orgId, folderId);
  const { renameItem } = useViewBrowserMutations(orgId);

  return (
    <SimpleLayoutHeader
      actionButtons={<PeopleActionButton folderId={folderId} orgId={orgId} />}
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
        <ZUIFuture future={folderFuture}>
          {(data) => (
            <ZUIEditTextinPlace
              key={data.id}
              onChange={(newTitle) => {
                renameItem('folder', data.id, newTitle);
              }}
              value={data.title}
            />
          )}
        </ZUIFuture>
      }
    >
      {children}
    </SimpleLayoutHeader>
  );
};

const FolderLayout: React.FunctionComponent<PropsWithChildren> = ({
  children,
}) => {
  return <DefaultLayout>{children}</DefaultLayout>;
};

export default FolderLayout;
