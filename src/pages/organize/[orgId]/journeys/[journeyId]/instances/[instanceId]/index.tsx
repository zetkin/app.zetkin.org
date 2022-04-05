import dayjs from 'dayjs';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { FormattedMessage as Msg } from 'react-intl';
import { useState } from 'react';
import {
  Box,
  Button,
  Divider,
  lighten,
  makeStyles,
  TextareaAutosize,
  Typography,
} from '@material-ui/core';
import { Edit, Save, Schedule } from '@material-ui/icons';

import JourneyDetailsLayout from 'layout/organize/JourneyDetailsLayout';
import { journeyInstanceResource } from 'api/journeys';
import JourneyInstanceSummary from 'components/organize/journeys/JourneyInstanceSummary';
import JourneyMilestoneProgressBar from 'components/organize/journeys/JourneyMilestoneProgressBar';
import { organizationResource } from 'api/organizations';
import { PageWithLayout } from 'types';
import { scaffold } from 'utils/next';
import { ZetkinJourneyInstance } from 'types/zetkin';

const scaffoldOptions = {
  authLevelRequired: 2,
  localeScope: ['layout.organize', 'misc', 'pages.organizeJourneyInstance'],
};

const useStyles = makeStyles((theme) => ({
  textarea: {
    border: '2px dotted transparent',
    borderColor: lighten(theme.palette.primary.main, 0.65),
    borderRadius: 10,
    fontFamily: theme.typography.fontFamily,
    lineHeight: '1.5',
    padding: 10,
    resize: 'none',
    width: '100%',
  },
}));

export const getServerSideProps: GetServerSideProps = scaffold(async (ctx) => {
  const { orgId, journeyId, instanceId } = ctx.params!;

  const { state: orgQueryState } = await organizationResource(
    orgId as string
  ).prefetch(ctx);

  const { state: journeyInstanceQueryState } = await journeyInstanceResource(
    orgId as string,
    journeyId as string,
    instanceId as string
  ).prefetch(ctx);

  if (
    orgQueryState?.status === 'success' &&
    journeyInstanceQueryState?.status === 'success'
  ) {
    return {
      props: {
        instanceId,
        journeyId,
        orgId,
      },
    };
  } else {
    return {
      notFound: true,
    };
  }
}, scaffoldOptions);

interface JourneyDetailsPageProps {
  instanceId: string;
  journeyId: string;
  orgId: string;
}

const JourneyDetailsPage: PageWithLayout<JourneyDetailsPageProps> = ({
  instanceId,
  journeyId,
  orgId,
}) => {
  const journeyInstanceQuery = journeyInstanceResource(
    orgId,
    journeyId,
    instanceId
  ).useQuery();
  const journeyInstance = journeyInstanceQuery.data as ZetkinJourneyInstance;
  const classes = useStyles();

  const [editSummaryMode, setEditSummaryMode] = useState<boolean>(false);
  const [text, setText] = useState<string>(journeyInstance.summary);

  const saveEditedSummary = (text: string) => {
    text;
    //do thing to save the edited summary
  };

  return (
    <>
      <Head>
        <title>
          {journeyInstance.title
            ? journeyInstance.title
            : `${journeyInstance.journey.title} ${journeyInstance.id}`}
        </title>
      </Head>
      <Box display="flex" flexDirection="row" justifyContent="space-between">
        <Box width="50%">
          <Box
            style={{
              alignItems: 'center',
              display: 'flex',
              justifyContent: 'space-between',
            }}
          >
            <Typography variant="h6">
              <Msg id="pages.organizeJourneyInstance.summary" />
            </Typography>
            <Button
              color="primary"
              onClick={
                editSummaryMode
                  ? () => {
                      setEditSummaryMode(false);
                      saveEditedSummary(text);
                    }
                  : () => setEditSummaryMode(true)
              }
              startIcon={editSummaryMode ? <Save /> : <Edit />}
              style={{ textTransform: 'uppercase' }}
            >
              <Msg
                id={
                  editSummaryMode
                    ? 'pages.organizeJourneyInstance.save'
                    : 'pages.organizeJourneyInstance.edit'
                }
              />
            </Button>
          </Box>
          {editSummaryMode ? (
            <TextareaAutosize
              className={classes.textarea}
              onChange={(e) => setText(e.target.value)}
              value={text}
            />
          ) : (
            <JourneyInstanceSummary journeyInstance={journeyInstance} />
          )}
        </Box>
        <Box pr={3} width="30%">
          <Typography>
            <Msg id="pages.organizeJourneyInstance.assignedTo" />
          </Typography>
          <Divider />
          <Typography>
            <Msg id="pages.organizeJourneyInstance.members" />
          </Typography>
          <Divider />
          <Typography>
            <Msg id="pages.organizeJourneyInstance.tags" />
          </Typography>
          <Divider />
          {journeyInstance.milestones && (
            <>
              <Typography>
                <Msg id="pages.organizeJourneyInstance.milestones" />
              </Typography>
              <JourneyMilestoneProgressBar
                milestones={journeyInstance.milestones}
              />
              <Box display="flex" flexDirection="row">
                <Schedule
                  color="secondary"
                  style={{ marginRight: '0.25rem' }}
                />
                <Typography color="secondary">
                  {`${journeyInstance.next_milestone?.title}: ${dayjs(
                    journeyInstance.next_milestone?.deadline
                  ).format('DD MMMM YYYY')}`}
                </Typography>
              </Box>
              <Divider />
            </>
          )}
        </Box>
      </Box>
    </>
  );
};

JourneyDetailsPage.getLayout = function getLayout(page) {
  return <JourneyDetailsLayout>{page}</JourneyDetailsLayout>;
};

export default JourneyDetailsPage;
