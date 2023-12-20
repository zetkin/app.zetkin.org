import { Box } from '@mui/material';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import { OutputData } from '@editorjs/editorjs';

import EmailLayout from 'features/emails/layout/EmailLayout';
import { GetServerSideProps } from 'next';
import { PageWithLayout } from 'utils/types';
import { scaffold } from 'utils/next';
import useServerSide from 'core/useServerSide';

const Editor = dynamic(import('features/emails/components/Editor'), {
  ssr: false,
});

export const getServerSideProps: GetServerSideProps = scaffold(
  async (ctx) => {
    const { orgId, campId, emailId } = ctx.params!;

    return {
      props: {
        campId,
        emailId,
        orgId,
      },
    };
  },
  {
    authLevelRequired: 2,
    localeScope: ['layout.organize.email', 'pages.organizeEmail'],
  }
);

const EditorTestPage: PageWithLayout = () => {
  const onServer = useServerSide();
  if (onServer) {
    return null;
  }

  return (
    <>
      <Head>
        <title>Editor test</title>
      </Head>
      <Box>
        <Editor
          onSave={(data: OutputData) => {
            console.log(data);
          }}
        />
      </Box>
    </>
  );
};

EditorTestPage.getLayout = function getLayout(page) {
  return <EmailLayout>{page}</EmailLayout>;
};

export default EditorTestPage;
