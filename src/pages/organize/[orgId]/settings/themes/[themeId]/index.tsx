import { GetServerSideProps } from 'next';
import { CircularProgress, Stack } from '@mui/material';
import React, { useMemo, useState } from 'react';

import { scaffold } from 'utils/next';
import { PageWithLayout } from 'utils/types';
import useServerSide from 'core/useServerSide';
import { useNumericRouteParams } from 'core/hooks';
import EmailThemeLayout from 'features/emails/layout/EmailThemeLayout';
import useEmailTheme from 'features/emails/hooks/useEmailTheme';
import ThemeEditor from 'features/emails/components/ThemeEditor/ThemeEditor';
import ThemePreview from 'features/emails/components/ThemeEditor/ThemePreview';
import { EmailTheme } from 'features/emails/types';

const scaffoldOptions = {
  authLevelRequired: 2,
  localeScope: ['feat.emails', 'feat.breadcrumbs'],
};

export const getServerSideProps: GetServerSideProps = scaffold(async () => {
  return {
    props: {},
  };
}, scaffoldOptions);

interface ThemePageProps {
  orgId: string;
}

const ThemePageContent = ({
  theme,
  orgId,
  themeId,
}: {
  orgId: number;
  theme: EmailTheme;
  themeId: number;
}) => {
  const [localValues, setLocalValues] = useState<Record<string, string>>({
    block_attributes: JSON.stringify(theme.block_attributes, null, 2),
    css: theme.css || '',
    frame_mjml: JSON.stringify(theme.frame_mjml, null, 2),
  });

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
    <Stack direction="row" display="flex" gap={2} sx={{ height: '100%' }}>
      <ThemePreview theme={liveTheme} />
      <ThemeEditor
        localValues={localValues}
        onChange={(section, newValue) => {
          setLocalValues((prev) => ({ ...prev, [section]: newValue }));
        }}
        orgId={orgId}
        themeId={themeId}
      />
    </Stack>
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

  return <ThemePageContent orgId={orgId} theme={theme} themeId={themeId} />;
};

ThemePage.getLayout = function getLayout(page) {
  return <EmailThemeLayout>{page}</EmailThemeLayout>;
};

export default ThemePage;
