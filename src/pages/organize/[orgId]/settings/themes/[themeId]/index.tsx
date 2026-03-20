import { GetServerSideProps } from 'next';
import { Stack } from '@mui/material';

import { scaffold } from 'utils/next';
import { PageWithLayout } from 'utils/types';
import SettingsLayout from 'features/settings/layout/SettingsLayout';
import useServerSide from 'core/useServerSide';

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

  if (onServer) {
    return null;
  }

  return <Stack direction="column" display="flex" gap={2} />;
};

ThemePage.getLayout = function getLayout(page) {
  return <SettingsLayout>{page}</SettingsLayout>;
};

export default ThemePage;
