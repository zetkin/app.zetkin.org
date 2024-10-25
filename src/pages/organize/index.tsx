import { Box } from '@mui/material';
import { GetServerSideProps } from 'next';
import Head from 'next/head';

import messageIds from 'features/organizations/l10n/messageIds';
import { PageWithLayout } from 'utils/types';
import { scaffold } from 'utils/next';
import { useMessages } from 'core/i18n';
import UserOrganizations from 'features/organizations/components/OrganizationsList';
import ZUILogo from 'zui/ZUILogo';

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
  return (
    <>
      <Head>
        <title>{messages.page.title()}</title>
      </Head>
      <Box maxWidth={800} mx="auto" my={2}>
        <Box textAlign="center">
          <ZUILogo htmlColor="black" size={100} />
        </Box>
        <UserOrganizations />
      </Box>
    </>
  );
};

OrganizePage.getLayout = function getLayout(page) {
  return page;
};

export default OrganizePage;
