import { Box } from '@mui/material';
import Head from 'next/head';
import { GetServerSideProps } from 'next';

import { PageWithLayout } from 'utils/types';
import EmailLayout from 'features/emails/layout/EmailLayout';
import ZUIEditor from 'zui/ZUIEditor';
import { scaffold } from 'utils/next';

export const getServerSideProps: GetServerSideProps = scaffold(
  async () => {
    return {
      props: {},
    };
  },
  {
    authLevelRequired: 2,
  }
);

const EmailPage: PageWithLayout = () => {
  return (
    <>
      <Head>
        <title>hejj</title>
      </Head>
      <Box>
        <ZUIEditor />
      </Box>
    </>
  );
};

EmailPage.getLayout = function getLayout(page) {
  return <EmailLayout>{page}</EmailLayout>;
};

export default EmailPage;
