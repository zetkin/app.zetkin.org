import { useIntl } from 'react-intl';
import { useRouter } from 'next/router';

import SimpleLayout from 'utils/layout/SimpleLayout';
import useModel from 'core/useModel';
import useServerSide from 'core/useServerSide';
import ViewBrowserModel from '../models/ViewBrowserModel';
import ViewFolderSubtitle from '../components/ViewFolderSubtitle';
import ZUIFuture from 'zui/ZUIFuture';

interface PeopleLayoutProps {
  children: React.ReactNode;
}

const PeopleLayout: React.FunctionComponent<PeopleLayoutProps> = ({
  children,
}) => {
  const { orgId } = useRouter().query;
  const intl = useIntl();

  const model = useModel(
    (env) => new ViewBrowserModel(env, parseInt(orgId as string))
  );

  const onServer = useServerSide();
  if (onServer) {
    return null;
  }

  return (
    <SimpleLayout
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
      title={intl.formatMessage({ id: 'layout.organize.people.title' })}
    >
      {children}
    </SimpleLayout>
  );
};

export default PeopleLayout;
