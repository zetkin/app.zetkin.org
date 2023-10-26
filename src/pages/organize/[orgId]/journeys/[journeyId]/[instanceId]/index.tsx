import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { Box, Divider, Grid } from '@mui/material';

import JourneyInstanceLayout from 'features/journeys/layout/JourneyInstanceLayout';
import JourneyInstanceOutcome from 'features/journeys/components/JourneyInstanceOutcome';

import BackendApiClient from 'core/api/client/BackendApiClient';
import JourneyInstanceSidebar from 'features/journeys/components/JourneyInstanceSidebar';
import JourneyInstanceSummary from 'features/journeys/components/JourneyInstanceSummary';
import messageIds from 'features/journeys/l10n/messageIds';
import { PageWithLayout } from 'utils/types';
import useJourneyInstance from 'features/journeys/hooks/useJourneyInstance';
import useJourneyInstanceMutations from 'features/journeys/hooks/useJourneyInstanceMutations';
import { useMessages } from 'core/i18n';
import { useNumericRouteParams } from 'core/hooks';
import useTimelineNote from 'features/journeys/hooks/useTimelineNotes';
import useTimelineUpdates from 'features/journeys/hooks/useTimelineUpdates';
import ZUIFuture from 'zui/ZUIFuture';
import ZUISection from 'zui/ZUISection';
import ZUITimeline from 'zui/ZUITimeline';
import { scaffold, ScaffoldedGetServerSideProps } from 'utils/next';
import { ZetkinJourneyInstance, ZetkinOrganization } from 'utils/types/zetkin';

export const scaffoldOptions = {
  authLevelRequired: 2,
  localeScope: ['layout.organize', 'misc', 'pages.organizeJourneyInstance'],
};

export const getJourneyInstanceScaffoldProps: ScaffoldedGetServerSideProps =
  async (ctx) => {
    const { orgId, instanceId, journeyId } = ctx.params!;

    const apiClient = new BackendApiClient(ctx.req.headers);
    const journeyInstance = await apiClient.get<ZetkinJourneyInstance>(
      `/api/orgs/${orgId}/journey_instances/${instanceId}`
    );
    const organization = await apiClient.get<ZetkinOrganization>(
      `/api/orgs/${orgId}`
    );

    if (
      journeyInstance &&
      journeyInstance.journey.id.toString() !== (journeyId as string)
    ) {
      return {
        redirect: {
          destination: `/organize/${orgId}/journeys/${journeyInstance.journey.id}/${instanceId}`,
          permanent: false,
        },
      };
    }

    if (organization && journeyInstance) {
      return {
        props: {
          instanceId,
          orgId,
        },
      };
    } else {
      return {
        notFound: true,
      };
    }
  };

export const getServerSideProps: GetServerSideProps = scaffold(
  getJourneyInstanceScaffoldProps,
  scaffoldOptions
);

const JourneyDetailsPage: PageWithLayout = () => {
  const { orgId, instanceId } = useNumericRouteParams();
  const messages = useMessages(messageIds);

  const journeyInstanceFuture = useJourneyInstance(orgId, instanceId);
  const timelineUpdatesFuture = useTimelineUpdates(orgId, instanceId);
  const { addNote, editNote } = useTimelineNote(orgId, instanceId);
  const {
    addAssignee,
    addSubject,
    assignTag,
    removeAssignee,
    removeSubject,
    unassignTag,
  } = useJourneyInstanceMutations(orgId, instanceId);

  const journeyInstance = journeyInstanceFuture.data;
  if (!journeyInstance) {
    return null;
  }

  return (
    <>
      <Head>
        <title>
          {`${journeyInstance.title || journeyInstance.journey.title} #${
            journeyInstance.id
          }`}
        </title>
      </Head>
      <Grid container justifyContent="space-between" spacing={3}>
        <Grid item lg={6} md={7} xl={5} xs={12}>
          <JourneyInstanceSummary journeyInstance={journeyInstance} />
          {journeyInstance.closed && (
            <JourneyInstanceOutcome journeyInstance={journeyInstance} />
          )}
          <Box mb={3} mt={4}>
            <Divider />
          </Box>
          <ZUISection title={messages.instance.sections.timeline()}>
            <ZUIFuture future={timelineUpdatesFuture}>
              {(updates) => (
                <ZUITimeline
                  onAddNote={addNote}
                  onEditNote={editNote}
                  updates={updates}
                />
              )}
            </ZUIFuture>
          </ZUISection>
        </Grid>
        <Grid item lg={4} md={4} xs={12}>
          <JourneyInstanceSidebar
            journeyInstance={journeyInstance}
            onAddAssignee={addAssignee}
            onAddSubject={addSubject}
            onAssignTag={(tag) => {
              assignTag({
                id: tag.id,
                value: tag.value,
              });
            }}
            onRemoveAssignee={removeAssignee}
            onRemoveSubject={removeSubject}
            onTagEdited={() => {
              //TODO: Mark tag as stale
            }}
            onUnassignTag={(tag) => {
              unassignTag(tag.id);
            }}
          />
        </Grid>
      </Grid>
    </>
  );
};

JourneyDetailsPage.getLayout = function getLayout(page) {
  return <JourneyInstanceLayout>{page}</JourneyInstanceLayout>;
};

export default JourneyDetailsPage;
