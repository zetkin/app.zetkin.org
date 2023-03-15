import { GetServerSideProps } from 'next';
import Head from 'next/head';
import messageIds from 'features/organizations/l10n/messageIds';
import NoMenuLayout from 'utils/layout/NoMenuLayout';
import OrganizationsDataModel from 'features/organizations/models/OrganizationsDataModel';
import { PageWithLayout } from 'utils/types';
import { scaffold } from 'utils/next';
import { useMessages } from 'core/i18n';
import useModel from 'core/useModel';
import UserOrganizations from 'features/organizations/components/OrganizationsList';

const scaffoldOptions = {
  authLevelRequired: 2,
  localeScope: ['feat.organizations'],
};

export const getServerSideProps: GetServerSideProps = scaffold(async () => {
  return {
    props: {},
  };
}, scaffoldOptions);

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
  return <NoMenuLayout>{page}</NoMenuLayout>;
};

export default OrganizePage;
