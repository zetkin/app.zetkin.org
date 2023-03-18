import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { useQuery } from 'react-query';
import {
  Box,
  Button,
  CardContent,
  Divider,
  Grid,
  Link,
  Typography,
} from '@mui/material';

import { campaignTasksResource } from 'features/tasks/api/tasks';
import getCampaign from 'features/campaigns/fetching/getCampaign';
import getCampaignEvents from 'features/campaigns/fetching/getCampaignEvents';
import getOrg from 'utils/fetching/getOrg';
import { PageWithLayout } from 'utils/types';
import { scaffold } from 'utils/next';
import SingleCampaignLayout from 'features/campaigns/layout/SingleCampaignLayout';
import TaskList from 'features/tasks/components/TaskList';
import { useMessages } from 'core/i18n';
import makeStyles from '@mui/styles/makeStyles';

import messageIds from 'features/campaigns/l10n/messageIds';
import ZUICard from 'zui/ZUICard';
import useModel from 'core/useModel';
import CampaignActivitiesModel, {
  ACTIVITIES,
  CampaignAcitivity,
} from 'features/campaigns/models/CampaignAcitivitiesModel';

import SurveyListItem from 'features/campaigns/components/ActivityList/SurveyListItem';
import SurveyOverviewListItem from 'features/campaigns/components/OverviewList/SurveyOverviewListItem';
import CallAssignmentOverviewListItem from 'features/campaigns/components/OverviewList/CallAssignmentOverviewListItem';
import TasksOverviewListItem from 'features/campaigns/components/OverviewList/TasksOverviewListItem';
import SurveyDataModel from 'features/surveys/models/SurveyDataModel';
import NoActivitiesOverview from 'features/campaigns/components/OverviewList/NoActivities';
//import NoActivities from 'features/campaigns/components/NoActivities';

export const getServerSideProps: GetServerSideProps = scaffold(
  async (ctx) => {
    const { orgId, campId } = ctx.params!;

    return {
      props: {
        orgId,
        campId,
      },
    };
  },
  {
    authLevelRequired: 2,
    localeScope: ['layout.organize.surveys', 'pages.organizeSurvey'],
  }
);

type CampaignCalendarPageProps = {
  campId: string;
  orgId: string;
};

const CampaignSummaryPage: PageWithLayout<CampaignCalendarPageProps> = ({
  orgId,
  campId,
}) => {
  const messages = useMessages(messageIds);

  const campaignQuery = useQuery(
    ['campaign', orgId, campId],
    getCampaign(orgId, campId)
  );

  const campaign = campaignQuery.data;
  const model = useModel(
    (env) => new CampaignActivitiesModel(env, parseInt(orgId))
  );

  const surveyModel = useModel(
    (env) => new SurveyDataModel(env, parseInt(orgId), 24)
  );
  console.log(surveyModel.getData().data);

  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const oneWeekFromNow = new Date(today);
  oneWeekFromNow.setDate(today.getDate() + 8);

  const todaysActivities: CampaignAcitivity[] = model
    .getActivitiesFilteredByTime(
      parseInt(campId),
      today.toISOString().slice(0, 10)
    )
    .slice(0, 8);

  const tomorrowActivities: CampaignAcitivity[] = model
    .getActivitiesFilteredByTime(
      parseInt(campId),
      tomorrow.toISOString().slice(0, 10)
    )
    .slice(0, 8);

  const alsoThisWeekActivities: CampaignAcitivity[] =
    model.getActivitiesForTheWeek(parseInt(campId));

  console.log('week', alsoThisWeekActivities);

  console.log('today', todaysActivities);
  console.log('tomorrow', tomorrowActivities);

  return (
    <>
      <Head>
        <title>{campaign?.title}</title>
      </Head>

      <Box>
        <Grid container spacing={1}>
          <Grid
            container
            spacing={1}
            style={{
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Typography
              style={{
                margin: '20px',
                padding: '20px',
              }}
              variant="h4"
            >
              {messages.overviewList.title()}
            </Typography>
            <Button
              href={`/organize/${orgId}/campaigns/${campId}/activities`}
              variant="text"
              color="info"
              size="medium"
            >
              {messages.overviewList.button()}
            </Button>
          </Grid>

          {todaysActivities.length === 0 && tomorrowActivities.length === 0 && (
            <Grid spacing={1}>
              <NoActivitiesOverview
                href={`/organize/${orgId}/campaigns/${campId}/activities`}
                message={messages.overviewList.noActivities()}
              />
            </Grid>
          )}
          {todaysActivities.length > 0 && (
            <Grid container spacing={3}>
              <Grid item md={4} xs={4}>
                <ZUICard header={messages.overviewList.todayCard()}>
                  {todaysActivities.length === 0 && (
                    <NoActivitiesOverview
                      message={messages.overviewList.nothingToday()}
                    />
                  )}
                  {todaysActivities?.map((activity, index) => {
                    if (activity.kind === ACTIVITIES.CALL_ASSIGNMENT) {
                      return (
                        <Box key={`ca-${activity.id}`}>
                          {index > 0 && <Divider />}
                          <CallAssignmentOverviewListItem
                            callAssignmentId={activity.id}
                            orgId={parseInt(orgId)}
                          />
                        </Box>
                      );
                    } else if (activity.kind === ACTIVITIES.SURVEY) {
                      return (
                        <Box key={`survey-${activity.id}`}>
                          {index > 0 && <Divider />}
                          <SurveyOverviewListItem
                            orgId={parseInt(orgId)}
                            surveyId={activity.id}
                          />
                        </Box>
                      );
                    } else if (activity.kind === ACTIVITIES.TASK) {
                      return (
                        <Box key={`task-${activity.id}`}>
                          {index > 0 && <Divider />}
                          <TasksOverviewListItem
                            orgId={parseInt(orgId)}
                            taskId={activity.id}
                          />
                        </Box>
                      );
                    }
                  })}
                </ZUICard>
              </Grid>

              <Grid item md={4} xs={4}>
                <ZUICard header={messages.overviewList.tomorrowCard()}>
                  {tomorrowActivities.length === 0 && (
                    <NoActivitiesOverview
                      message={messages.overviewList.nothingTomorrow()}
                    />
                  )}
                  {tomorrowActivities.length > 0 &&
                    tomorrowActivities?.map((activity, index) => {
                      if (activity.kind === ACTIVITIES.CALL_ASSIGNMENT) {
                        return (
                          <Box key={`ca-${activity.id}`}>
                            {index > 0 && <Divider />}
                            <CallAssignmentOverviewListItem
                              callAssignmentId={activity.id}
                              orgId={parseInt(orgId)}
                              subtitle={messages.overviewList.startsTomorrow()}
                            />
                          </Box>
                        );
                      } else if (activity.kind === ACTIVITIES.SURVEY) {
                        return (
                          <Box key={`survey-${activity.id}`}>
                            {index > 0 && <Divider />}
                            <SurveyOverviewListItem
                              orgId={parseInt(orgId)}
                              surveyId={activity.id}
                            />
                          </Box>
                        );
                      } else if (activity.kind === ACTIVITIES.TASK) {
                        return (
                          <Box key={`task-${activity.id}`}>
                            {index > 0 && <Divider />}
                            <TasksOverviewListItem
                              orgId={parseInt(orgId)}
                              taskId={activity.id}
                            />
                          </Box>
                        );
                      }
                    })}
                </ZUICard>
              </Grid>

              <Grid item md={4} xs={4}>
                <ZUICard header={messages.overviewList.thisWeekCard()}>
                  {alsoThisWeekActivities?.map((activity, index) => {
                    if (activity.kind === ACTIVITIES.CALL_ASSIGNMENT) {
                      return (
                        <Box key={`ca-${activity.id}`}>
                          {index > 0 && <Divider />}
                          <CallAssignmentOverviewListItem
                            callAssignmentId={activity.id}
                            orgId={parseInt(orgId)}
                          />
                        </Box>
                      );
                    } else if (activity.kind === ACTIVITIES.SURVEY) {
                      return (
                        <Box key={`survey-${activity.id}`}>
                          {index > 0 && <Divider />}
                          <SurveyOverviewListItem
                            orgId={parseInt(orgId)}
                            surveyId={activity.id}
                          />
                        </Box>
                      );
                    } else if (activity.kind === ACTIVITIES.TASK) {
                      return (
                        <Box key={`task-${activity.id}`}>
                          {index > 0 && <Divider />}
                          <TasksOverviewListItem
                            orgId={parseInt(orgId)}
                            taskId={activity.id}
                          />
                        </Box>
                      );
                    }
                  })}
                </ZUICard>
              </Grid>
            </Grid>
          )}
        </Grid>
      </Box>
    </>
  );
};

CampaignSummaryPage.getLayout = function getLayout(page) {
  return <SingleCampaignLayout>{page}</SingleCampaignLayout>;
};

export default CampaignSummaryPage;
