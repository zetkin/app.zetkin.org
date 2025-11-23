import { GetServerSideProps } from 'next';
import Head from 'next/head';

import AllJourneyInstancesLayout from 'features/journeys/layout/AllJourneyInstancesLayout';
import BackendApiClient from 'core/api/client/BackendApiClient';
import JourneyInstanceCreateFab from 'features/journeys/components/JourneyInstanceCreateFab';
import JourneyInstancesDataTable from 'features/journeys/components/JourneyInstancesDataTable';
import { PageWithLayout } from 'utils/types';
import { scaffold } from 'utils/next';
import useJourney from 'features/journeys/hooks/useJourney';
import useJourneyInstances from 'features/journeys/hooks/useJourneyInstances';
import { useNumericRouteParams } from 'core/hooks';
import { ZetkinJourney } from 'utils/types/zetkin';
import ZUIFuture from 'zui/ZUIFuture';
import { Box, Card, Grid, Stack, TextField } from '@mui/material';
import BlockWrapper from 'features/surveys/components/SurveyEditor/blocks/BlockWrapper';

const scaffoldOptions = {
  authLevelRequired: 2,
  localeScope: ['layout.organize', 'pages.organizeJourney'],
};

export const getServerSideProps: GetServerSideProps = scaffold(async (ctx) => {
  const { orgId, journeyId } = ctx.params!;

  try {
    const apiClient = new BackendApiClient(ctx.req.headers);
    await apiClient.get<ZetkinJourney>(
      `/api/orgs/${orgId}/journeys/${journeyId}`
    );
    return {
      props: {},
    };
  } catch {
    return {
      notFound: true,
    };
  }
}, scaffoldOptions);

const ClosedJourneyInstancesPage: PageWithLayout = () => {
  const { orgId, journeyId } = useNumericRouteParams();
  const journeyFuture = useJourney(orgId, journeyId);

  const milestones = [
    {id: 1, title: "Assigned Contact", description:"Assign an organizer to act as contact person forthe new member"},
    {id: 2, title: "First Contact", description: "Get in contacts"},
  ]

  return (
    <>
      <Head>
        <title>{journeyFuture.data?.title}</title>
      </Head>
      <Grid container spacing={2} sx={{ padding: 2 }}>
        <Grid size={{ md: 6, xs: 12 }}>
          <Card sx={{ padding: 2 }}>
            <Stack spacing={2}>

              <TextField key={journeyFuture.data?.title} label="Title" defaultValue={journeyFuture.data?.title}></TextField>
              <TextField key={journeyFuture.data?.singular_label} label="Label (singular)" defaultValue={journeyFuture.data?.singular_label}></TextField>
              <TextField key={journeyFuture.data?.plural_label} label="Label (plural)" defaultValue={journeyFuture.data?.plural_label}></TextField>
              <TextField label="Description" multiline></TextField>
              <TextField key={journeyFuture.data?.opening_note_template} label="Opening note" multiline defaultValue={journeyFuture.data?.opening_note_template}></TextField>
            </Stack>

          </Card>
        </Grid>
        <Grid size={{ md: 6, xs: 12 }}>

          <Card sx={{ padding: 2 }}>
            <ZUIReorderable
              items={milestones.map((milestone) => ({
                id: milestone.id,
                renderContent: ({ dragging }) => {


                      return (
                        <BlockWrapper
                          key={milestone.id}
                          dragging={dragging}
                          hidden={false}
                        >
                          <Stack spacing={1} sx={{ padding: 2 }} key={milestone.title} component="li">
                            <TextField label="Milestone" defaultValue={milestone.title}></TextField>
                            <TextField label="Description" defaultValue={milestone.description}></TextField>
                          </Stack>
                        </BlockWrapper>
                      );
                    
                  
                },
              }))}
              onReorder={(ids) => {
                updateElementOrder(ids);
              }}
            />
            {/* <Stack spacing={2} component="ul">
              
                {milestones.map(milestone =>(
                  <Stack spacing={1} sx={{ padding: 2 }} key={milestone.title} component="li">
                    <TextField label="Milestone" defaultValue={milestone.title}></TextField>
                    <TextField label="Description" defaultValue={milestone.description}></TextField>
                  </Stack>
                ))}
                
            </Stack> */}
          </Card>
        </Grid>
      </Grid>
    </>
  );
};

ClosedJourneyInstancesPage.getLayout = function getLayout(page) {
  return (
    <AllJourneyInstancesLayout fixedHeight>{page}</AllJourneyInstancesLayout>
  );
};

export default ClosedJourneyInstancesPage;
