import { GetServerSideProps } from 'next';
import { Box, Button, Grid, Typography } from '@mui/material';
import { useState } from 'react';

import JourneySettingsCard from 'features/settings/components/journeys/JourneySettingsCard';
import { scaffold } from 'utils/next';
import { PageWithLayout } from 'utils/types';
import SettingsLayout from 'features/settings/layout/SettingsLayout';
import useServerSide from 'core/useServerSide';
import { Msg, useMessages } from 'core/i18n';
import messageIds from 'features/settings/l10n/messageIds';
import { useNumericRouteParams } from 'core/hooks';
import useJourneys from 'features/journeys/hooks/useJourneys';
import ZUICreateJourney from 'zui/ZUICreateJourney';

const scaffoldOptions = {
  authLevelRequired: 2,
};

export const getServerSideProps: GetServerSideProps = scaffold(async () => {
  return {
    props: {},
  };
}, scaffoldOptions);

type Props = {
  orgId: string;
};

const JourneysSettingsPage: PageWithLayout<Props> = () => {
  const onServer = useServerSide();
  const { orgId } = useNumericRouteParams();
  const journeys = useJourneys(orgId).data || [];
  const [createJourneyOpen, setCreateJourneyOpen] = useState(false);
  const messages = useMessages(messageIds);

  if (onServer) {
    return null;
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Box
        sx={{
          alignItems: 'center',
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <Typography variant="h4">
          <Msg id={messageIds.journeys.overview.title} />
        </Typography>
        <Button onClick={() => setCreateJourneyOpen(true)} variant="contained">
          <Msg id={messageIds.journeys.overview.addJourney} />
        </Button>
      </Box>
      <Typography>
        <Msg id={messageIds.journeys.overview.description} />
      </Typography>
      <Grid container spacing={2}>
        {journeys.map((journey) => (
          <Grid key={journey.id} size={{ md: 6, sm: 6, xs: 12 }}>
            <Box sx={{ height: '100%' }}>
              <JourneySettingsCard journey={journey} />
            </Box>
          </Grid>
        ))}
      </Grid>
      <ZUICreateJourney
        onClose={() => setCreateJourneyOpen(false)}
        open={createJourneyOpen}
        submitLabel={messages.journeys.create.submitLabel()}
        title={messages.journeys.create.title()}
      />
    </Box>
  );
};

JourneysSettingsPage.getLayout = function getLayout(page) {
  return <SettingsLayout>{page}</SettingsLayout>;
};

export default JourneysSettingsPage;
