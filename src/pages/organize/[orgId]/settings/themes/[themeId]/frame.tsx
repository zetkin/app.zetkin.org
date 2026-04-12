import { GetServerSideProps } from 'next';
import { Box, CircularProgress, Stack } from '@mui/material';
import React, { useEffect, useState } from 'react';

import { scaffold } from 'utils/next';
import { PageWithLayout } from 'utils/types';
import useServerSide from 'core/useServerSide';
import { useNumericRouteParams } from 'core/hooks';
import EmailThemeLayout from 'features/emails/layout/EmailThemeLayout';
import useEmailTheme from 'features/emails/hooks/useEmailTheme';
import ThemeEditor from 'features/emails/components/ThemeEditor/ThemeEditor';
import previewEmailThemeHtml from 'features/emails/utils/rendering/previewEmailThemeHtml';

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
  const [previewHtml, setPreviewHtml] = useState('');

  useEffect(() => {
    if (!data) {
      return;
    }
    previewEmailThemeHtml(data).then((html) => {
      setPreviewHtml(html);
    });
  }, [data]);

  if (onServer) {
    return null;
  }
  if (isLoading) {
    return <CircularProgress />;
  }

  return (
    <Stack direction="row" display="flex" gap={2}>
      <Box sx={{ flex: 1, minWidth: '0' }}>
        <ThemeEditor
          editingSection="frame_mjml"
          orgId={orgId}
          themeId={themeId}
        />
      </Box>
      <Box sx={{ flex: 1, minWidth: '0' }}>
        {previewHtml ? (
          <iframe
            srcDoc={previewHtml}
            style={{
              background: 'white',
              border: 'none',
              height: 'calc(100% - 32px)',
              width: '100%',
            }}
            title="Email Theme Preview"
          />
        ) : (
          <CircularProgress size={24} />
        )}
      </Box>
    </Stack>
  );
};

ThemePage.getLayout = function getLayout(page) {
  return <EmailThemeLayout>{page}</EmailThemeLayout>;
};

export default ThemePage;
