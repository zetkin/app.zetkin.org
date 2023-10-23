import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { useContext } from 'react';
import { useQueryClient } from 'react-query';
import { Box, Divider, Grid } from '@mui/material';

import JourneyInstanceLayout from 'features/journeys/layout/JourneyInstanceLayout';
import JourneyInstanceOutcome from 'features/journeys/components/JourneyInstanceOutcome';

import BackendApiClient from 'core/api/client/BackendApiClient';
import JourneyInstanceSidebar from 'features/journeys/components/JourneyInstanceSidebar';
import JourneyInstanceSummary from 'features/journeys/components/JourneyInstanceSummary';
import messageIds from 'features/journeys/l10n/messageIds';
import { organizationResource } from 'features/journeys/api/organizations';
import { PageWithLayout } from 'utils/types';
import useJourneyInstance from 'features/journeys/hooks/useJourneyInstance';
import { useMessages } from 'core/i18n';
import { useNumericRouteParams } from 'core/hooks';
import ZUIQuery from 'zui/ZUIQuery';
import ZUISection from 'zui/ZUISection';
import ZUISnackbarContext from 'zui/ZUISnackbarContext';
import ZUITimeline from 'zui/ZUITimeline';
import {
  journeyInstanceResource,
  journeyInstanceTimelineResource,
} from 'features/journeys/api/journeys';
import { scaffold, ScaffoldedGetServerSideProps } from 'utils/next';
import { ZetkinJourneyInstance, ZetkinPerson } from 'utils/types/zetkin';

export const scaffoldOptions = {
  authLevelRequired: 2,
  localeScope: ['layout.organize', 'misc', 'pages.organizeJourneyInstance'],
};

export const getJourneyInstanceScaffoldProps: ScaffoldedGetServerSideProps =
  async (ctx) => {
    const { orgId, instanceId, journeyId } = ctx.params!;

    const { state: orgQueryState } = await organizationResource(
      orgId as string
    ).prefetch(ctx);

    const apiClient = new BackendApiClient(ctx.req.headers);
    const journeyInstance = await apiClient.get<ZetkinJourneyInstance>(
      `/api/orgs/${orgId}/journey_instances/${instanceId}`
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

    if (orgQueryState?.status === 'success' && journeyInstance) {
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
  const {
    key,
    useAddAssignee,
    useAddSubject,
    useAssignTag,
    useRemoveAssignee,
    useRemoveSubject,
    useUnassignTag,
  } = journeyInstanceResource(orgId.toString(), instanceId.toString());
  const messages = useMessages(messageIds);
  const addAssigneeMutation = useAddAssignee();
  const removeAssigneeMutation = useRemoveAssignee();
  const addMemberMutation = useAddSubject();
  const removeMemberMutation = useRemoveSubject();
  const assignTagMutation = useAssignTag();
  const unassignTagMutation = useUnassignTag();
  const { useQueryUpdates, useAddNote, useEditNote } =
    journeyInstanceTimelineResource(orgId.toString(), instanceId.toString());

  const journeyInstanceFuture = useJourneyInstance(orgId, instanceId);

  const { showSnackbar } = useContext(ZUISnackbarContext);
  const queryClient = useQueryClient();
  const updatesQuery = useQueryUpdates();
  const addNoteMutation = useAddNote();
  const editNoteMutation = useEditNote();

  const onAddAssignee = (person: ZetkinPerson) => {
    addAssigneeMutation.mutate(person.id, {
      onError: () => showSnackbar('error'),
    });
  };

  const onRemoveAssignee = (person: ZetkinPerson) => {
    removeAssigneeMutation.mutate(person.id, {
      onError: () => showSnackbar('error'),
    });
  };

  const onAddSubject = (person: ZetkinPerson) => {
    addMemberMutation.mutate(person.id, {
      onError: () => showSnackbar('error'),
    });
  };

  const onRemoveSubject = (person: ZetkinPerson) => {
    removeMemberMutation.mutate(person.id, {
      onError: () => showSnackbar('error'),
    });
  };

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
            <ZUIQuery queries={{ updatesQuery }}>
              {({ queries: { updatesQuery } }) => (
                <ZUITimeline
                  disabled={addNoteMutation.isLoading}
                  onAddNote={(note) => {
                    addNoteMutation.mutate(note, {
                      onError: () => showSnackbar('error'),
                    });
                  }}
                  onEditNote={(note) => {
                    editNoteMutation.mutate(note, {
                      onError: () => showSnackbar('error'),
                    });
                  }}
                  updates={updatesQuery.data}
                />
              )}
            </ZUIQuery>
          </ZUISection>
        </Grid>
        <Grid item lg={4} md={4} xs={12}>
          <JourneyInstanceSidebar
            journeyInstance={journeyInstance}
            onAddAssignee={onAddAssignee}
            onAddSubject={onAddSubject}
            onAssignTag={(tag) => {
              assignTagMutation.mutate({
                id: tag.id,
                value: tag.value,
              });
            }}
            onRemoveAssignee={onRemoveAssignee}
            onRemoveSubject={onRemoveSubject}
            onTagEdited={() => {
              queryClient.invalidateQueries(key);
            }}
            onUnassignTag={(tag) => {
              unassignTagMutation.mutate(tag.id);
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
