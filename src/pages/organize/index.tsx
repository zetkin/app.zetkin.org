import DefaultLayout from 'utils/layout/DefaultLayout';
import Head from 'next/head';
import messageIds from 'features/organizations/l10n/messageIds';
import OrganizationsDataModel from 'features/organizations/models/OrganizationsDataModel';
import { PageWithLayout } from 'utils/types';
import { useMessages } from 'core/i18n';
import useModel from 'core/useModel';
import UserOrganizations from 'features/organizations/components/OrganizationsList';

const OrganizePage: PageWithLayout = () => {
  const messages = useMessages(messageIds);
  const model: OrganizationsDataModel = useModel(
    (env) => new OrganizationsDataModel(env)
  );

  return (
    <>
      <Head>
        <title>{messages.page.title()}</title>
      </Head>
      <UserOrganizations model={model} />
    </>
  );
};

OrganizePage.getLayout = function getLayout(page) {
  return <DefaultLayout>{page}</DefaultLayout>;
};

export default OrganizePage;
