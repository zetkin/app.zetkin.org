import { GetServerSideProps } from 'next';
import { Box, Grid, Typography } from '@mui/material';

import messageIds from 'features/settings/l10n/messageIds';
import { PageWithLayout } from 'utils/types';
import { scaffold } from 'utils/next';
import SettingsLayout from 'features/settings/layout/SettingsLayout';
import useServerSide from 'core/useServerSide';
import { Msg } from 'core/i18n';

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

const Fields: PageWithLayout = () => {
  const onServer = useServerSide();

  if (onServer) {
    return null;
  }

  return (
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
            <Msg id={messageIds.fields.fieldsLayout.title} />
          </Typography>
        </Box>
      </Grid>
    </Grid>
  );
};

Fields.getLayout = function getLayout(page) {
  return <SettingsLayout>{page}</SettingsLayout>;
};

export default Fields;
