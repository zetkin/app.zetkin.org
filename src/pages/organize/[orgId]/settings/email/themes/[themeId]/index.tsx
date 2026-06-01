import { GetServerSideProps } from 'next';
import { Box, CircularProgress } from '@mui/material';
import React, { useMemo } from 'react';

import { scaffold } from 'utils/next';
import { PageWithLayout } from 'utils/types';
import useServerSide from 'core/useServerSide';
import { useAppDispatch, useNumericRouteParams } from 'core/hooks';
import useEmailTheme from 'features/emails/hooks/useEmailTheme';
import ThemeEditor from 'features/settings/components/themes/ThemeEditor';
import ThemePreview from 'features/settings/components/themes/ThemeEditor/ThemePreview';
import { EmailTheme } from 'features/emails/types';
import EmailThemeLayout from 'features/settings/layout/EmailThemeLayout';
import useEmailThemeEditing from 'features/settings/hooks/useEmailThemeEditing';
import { themeEditorValueChanged } from 'features/emails/store';

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

const ThemePageContent = ({ theme }: { theme: EmailTheme }) => {
  const { localValues } = useEmailThemeEditing(theme);
  const dispatch = useAppDispatch();

  const liveTheme = useMemo(() => {
    try {
      return {
        ...theme,
        block_attributes: JSON.parse(localValues.block_attributes),
        css: localValues.css,
        frame_mjml: JSON.parse(localValues.frame_mjml),
      };
    } catch {
      return theme;
    }
  }, [theme, localValues]);

  return (
    <Box
      sx={(theme) => ({
        borderTop: `1px solid ${theme.palette.grey[300]}`,
        display: 'flex',
        flexGrow: 1,
      })}
    >
      <ThemePreview theme={liveTheme} />
      <ThemeEditor
        localValues={localValues}
        onChange={(section, newValue) => {
          dispatch(themeEditorValueChanged([section, newValue]));
        }}
      />
    </Box>
  );
};

const ThemePage: PageWithLayout<ThemePageProps> = () => {
  const onServer = useServerSide();
  const { orgId, themeId } = useNumericRouteParams();
  const { isLoading, data: theme } = useEmailTheme(orgId, themeId);

  if (onServer) {
    return null;
  }

  if (isLoading || !theme) {
    return <CircularProgress />;
  }

  return (
    <Box display="flex" flexDirection="column" height="100%">
      <ThemePageContent theme={theme} />
    </Box>
  );
};

ThemePage.getLayout = function getLayout(page) {
  return <EmailThemeLayout>{page}</EmailThemeLayout>;
};

export default ThemePage;
