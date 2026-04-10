import { GetServerSideProps } from 'next';
import { Box, Grid, Typography } from '@mui/material';

import messageIds from 'features/settings/l10n/messageIds';
import { PageWithLayout } from 'utils/types';
import { scaffold } from 'utils/next';
import SettingsLayout from 'features/settings/layout/SettingsLayout';
import useServerSide from 'core/useServerSide';
import { Msg } from 'core/i18n';
import useCustomFields from 'features/profile/hooks/useCustomFields';
import { NATIVE_PERSON_FIELDS } from 'features/views/components/types';
import useNumericRouteParams from 'core/hooks/useNumericRouteParams';

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
  const { orgId } = useNumericRouteParams();
  const customFields = useCustomFields(orgId).data ?? [];

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
      <Box display="flex" flexDirection="column" gap={1}>
        {Object.entries(NATIVE_PERSON_FIELDS).map(([key, value]) => (
          <Box key={key} display="flex" gap={1}>
            <Box>{key}</Box>
            <Box>{value}</Box>
          </Box>
        ))}
      </Box>
      <Box display="flex" flexDirection="column" gap={1} mt={2}>
        {customFields.map((field) => (
          <Box key={field.slug} display="flex" gap={1}>
            <Typography>{field.title}</Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

Fields.getLayout = function getLayout(page) {
  return <SettingsLayout>{page}</SettingsLayout>;
};

export default Fields;
