import { GetServerSideProps } from 'next';
import { Box, Grid, Typography } from '@mui/material';

import { PageWithLayout } from 'utils/types';
import { scaffold } from 'utils/next';
import SettingsLayout from 'features/settings/layout/SettingsLayout';
import useServerSide from 'core/useServerSide';
import useNumericRouteParams from 'core/hooks/useNumericRouteParams';
import FieldsList from 'features/settings/components/FieldsList';
import Msg from 'core/i18n/Msg';
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
    <Box>
      <Grid container spacing={2}>
        <Grid size={{ md: 8 }}>
          <Box
            alignItems="center"
            display="flex"
            justifyContent="space-between"
            sx={{
              marginBottom: '15px',
              marginTop: '15px',
            }}
          >
            <Typography variant="h4">
              <Msg id={messageIds.fields.title} />
            </Typography>
          </Box>
        </Grid>
      </Grid>
      <FieldsList orgId={orgId} />
    </Box>
  );
};

FieldsPage.getLayout = function getLayout(page) {
  return <SettingsLayout>{page}</SettingsLayout>;
};

export default FieldsPage;
