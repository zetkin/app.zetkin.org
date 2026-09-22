import { Box } from '@mui/system';
import { GetServerSideProps } from 'next';
import { Typography } from '@mui/material';

import { PageWithLayout } from 'utils/types';
import { scaffold } from 'utils/next';
import SettingsLayout from 'features/settings/layout/SettingsLayout';
import useServerSide from 'core/useServerSide';
import useNumericRouteParams from 'core/hooks/useNumericRouteParams';
import FieldsList from 'features/settings/components/fields/FieldsList';
import NewFieldForm from 'features/settings/components/fields/NewFieldForm';
import { Msg } from 'core/i18n';
import messageIds from 'features/settings/l10n/messageIds';

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
        display: 'flex',
        flexDirection: { lg: 'row', sm: 'column' },
        gap: 2,
      }}
    >
      <Box sx={{ display: 'flex', flex: 2, flexDirection: 'column', gap: 2 }}>
        <Typography variant="h4">
          <Msg id={messageIds.fields.list.title} />
        </Typography>
        <FieldsList orgId={orgId} />
      </Box>
      <Box sx={{ display: 'flex', flex: 1, flexDirection: 'column', gap: 2 }}>
        <Typography variant="h4">
          <Msg id={messageIds.fields.create.title} />
        </Typography>
        <NewFieldForm orgId={orgId} />
      </Box>
    </Box>
  );
};

FieldsPage.getLayout = function getLayout(page) {
  return <SettingsLayout>{page}</SettingsLayout>;
};

export default FieldsPage;
