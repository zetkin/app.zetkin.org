import { GroupWorkOutlined } from '@mui/icons-material';
import { Box, Typography, useTheme } from '@mui/material';
import { GetServerSideProps } from 'next';
import Head from 'next/head';

import BackendApiClient from 'core/api/client/BackendApiClient';
import { getUserOrgTreeDef } from 'features/organizations/rpc/getUserOrgTree';
import messageIds from 'features/organizations/l10n/messageIds';
import { PageWithLayout } from 'utils/types';
import { scaffold } from 'utils/next';
import { Msg, useMessages } from 'core/i18n';
import OrganizeHomeSidebar from 'features/organizations/components/OrganizeHomeSidebar';

const scaffoldOptions = {
  authLevelRequired: 2,
  localeScope: ['feat.organizations', 'zui'],
};

export const getServerSideProps: GetServerSideProps = scaffold(async (ctx) => {
  try {
    const apiClient = new BackendApiClient(ctx.req.headers);
    const tree = await getUserOrgTreeDef.handler({}, apiClient);

    if (tree.length == 1 && tree[0].children.length == 0) {
      return {
        redirect: {
          destination: `/organize/${tree[0].id}/projects`,
          permanent: false,
        },
      };
    }
  } catch (err) {
    // Fall back to showing the organization picker
  }

  return {
    props: {},
  };
}, scaffoldOptions);

const OrganizePage: PageWithLayout = () => {
  const messages = useMessages(messageIds);
  const theme = useTheme();

  return (
    <>
      <Head>
        <title>{messages.page.title()}</title>
      </Head>
      <Box display="flex" height="100vh">
        <OrganizeHomeSidebar />
        <Box
          alignItems="center"
          display="flex"
          flexDirection="column"
          flexGrow={1}
          justifyContent="center"
          px={2}
          textAlign="center"
        >
          <GroupWorkOutlined
            sx={{ color: theme.palette.grey[400], fontSize: 128 }}
          />
          <Typography component="h1" mt={2} variant="h5">
            <Msg id={messageIds.page.heading} />
          </Typography>
          <Typography color="secondary" mt={1}>
            <Msg id={messageIds.page.description} />
          </Typography>
        </Box>
      </Box>
    </>
  );
};

OrganizePage.getLayout = function getLayout(page) {
  return page;
};

export default OrganizePage;
