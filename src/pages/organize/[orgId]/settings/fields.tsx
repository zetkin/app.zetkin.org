import { Box } from '@mui/system';
import { GetServerSideProps } from 'next';

import { PageWithLayout } from 'utils/types';
import { scaffold } from 'utils/next';
import SettingsLayout from 'features/settings/layout/SettingsLayout';
import useServerSide from 'core/useServerSide';
import useNumericRouteParams from 'core/hooks/useNumericRouteParams';
import FieldsList from 'features/settings/components/FieldsList';
import NewFieldForm from 'features/settings/components/NewFieldForm';

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

const FieldsPage: PageWithLayout = () => {
  const onServer = useServerSide();
  const { orgId } = useNumericRouteParams();

  if (onServer) {
    return null;
  }

  return (
    <Box
      sx={{
        backgroundColor: '#f7f7f7',
        display: 'flex',
        gap: 10,
      }}
    >
      <FieldsList orgId={orgId} />
      <NewFieldForm orgId={orgId} />
    </Box>
  );
};

FieldsPage.getLayout = function getLayout(page) {
  return <SettingsLayout>{page}</SettingsLayout>;
};

export default FieldsPage;
