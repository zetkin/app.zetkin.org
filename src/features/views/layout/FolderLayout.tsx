import { useRouter } from 'next/router';

import TabbedLayout from 'utils/layout/TabbedLayout';
import useModel from 'core/useModel';
import ViewBrowserModel from '../models/ViewBrowserModel';
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
        <TabbedLayout
          baseHref={`/organize/${orgId}/people`}
          defaultTab="/views"
          tabs={[
            {
              href: `/views`,
              messageId: 'layout.organize.people.tabs.views',
            },
          ]}
          title={data.title}
        >
          {children}
        </TabbedLayout>
      )}
    </ZUIFuture>
  );
};

export default FolderLayout;
