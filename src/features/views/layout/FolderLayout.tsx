import { useRouter } from 'next/router';

import SimpleLayout from 'utils/layout/SimpleLayout';
import useModel from 'core/useModel';
import ViewBrowserModel from '../models/ViewBrowserModel';
import PeopleActionButton from '../components/PeopleActionButton';
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

  const model = useModel(
    (env) => new ViewBrowserModel(env, parseInt(orgId as string))
  );

  return (
    <ZUIFuture future={model.getFolder(folderId)}>
      {(data) => (
        <SimpleLayout
          actionButtons={
            <PeopleActionButton folderId={folderId} model={model} />
          }
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
