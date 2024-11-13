import { AutoAwesome } from '@mui/icons-material';
import { Alert, AlertTitle, Box, Link, Typography } from '@mui/material';
import NextLink from 'next/link';
import { GetServerSideProps } from 'next';
import Head from 'next/head';

import messageIds from 'features/organizations/l10n/messageIds';
import { PageWithLayout } from 'utils/types';
import { scaffold } from 'utils/next';
import { Msg, useMessages } from 'core/i18n';
import UserOrganizations from 'features/organizations/components/OrganizationsList';
import ZUILogo from 'zui/ZUILogo';
import { useEnv } from 'core/hooks';

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
  const env = useEnv();

  return (
    <>
      <Head>
        <title>{messages.page.title()}</title>
      </Head>
      <Box maxWidth={800} mx="auto" my={2}>
        <Box textAlign="center">
          <ZUILogo htmlColor="black" size={100} />
        </Box>
        <Box my={1}>
          <Alert icon={<AutoAwesome fontSize="inherit" />} severity="info">
            <AlertTitle>
              <Msg id={messageIds.gen3.title} />
            </AlertTitle>
            <Typography>
              <Msg id={messageIds.gen3.description} />
            </Typography>
            <Typography my={1}>
              <NextLink
                href={env.vars.ZETKIN_GEN2_ORGANIZE_URL || ''}
                legacyBehavior
                passHref
              >
                <Link>
                  <Msg id={messageIds.gen3.gen2Button} />
                </Link>
              </NextLink>
            </Typography>
          </Alert>
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
