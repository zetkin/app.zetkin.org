import { GetServerSideProps } from 'next';
import { CircularProgress, Link, Stack } from '@mui/material';
import React from 'react';

import { scaffold } from 'utils/next';
import { PageWithLayout } from 'utils/types';
import useServerSide from 'core/useServerSide';
import { useNumericRouteParams } from 'core/hooks';
import EmailThemeLayout from 'features/emails/layout/EmailThemeLayout';
import useEmailTheme from 'features/emails/hooks/useEmailTheme';
import ThemeEditor from 'features/emails/components/ThemeEditor/ThemeEditor';
import ThemePreview from 'features/emails/components/ThemeEditor/ThemePreview';
import { useMessages } from 'core/i18n';
import messageIds from 'features/emails/l10n/messageIds';

const scaffoldOptions = {
  authLevelRequired: 2,
};

export const getServerSideProps: GetServerSideProps = scaffold(async () => {
  return {
    props: {},
  };
}, scaffoldOptions);

interface ThemePageProps {
  orgId: string;
}

const ThemePage: PageWithLayout<ThemePageProps> = () => {
  const onServer = useServerSide();
  const { orgId, themeId } = useNumericRouteParams();
  const { isLoading, data } = useEmailTheme(orgId, themeId);
  const messages = useMessages(messageIds);

  if (onServer) {
    return null;
  }
  if (isLoading) {
    return <CircularProgress />;
  }

  return (
    <Stack direction="row" display="flex" gap={2} sx={{ height: '100vh' }}>
      <ThemeEditor
        editingSection="css"
        helpBlock={
          <>
            {messages.themes.themeEditor.helpDialog.content.css.part1()}
            <br />
            <br />
            {messages.themes.themeEditor.helpDialog.content.css.part2()}
            <Link
              href="https://developer.mozilla.org/en-US/docs/Web/CSS"
              rel="noreferrer"
              target="_blank"
            >
              {messages.themes.themeEditor.helpDialog.content.css.part3()}
            </Link>
            {messages.themes.themeEditor.helpDialog.content.css.part4()}
            <br />
            <br />
            {messages.themes.themeEditor.helpDialog.content.css.part5()}
          </>
        }
        orgId={orgId}
        themeId={themeId}
      />
      <ThemePreview theme={data} />
    </Stack>
  );
};

ThemePage.getLayout = function getLayout(page) {
  return <EmailThemeLayout>{page}</EmailThemeLayout>;
};

export default ThemePage;
