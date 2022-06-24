import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { useContext } from 'react';
import { useIntl } from 'react-intl';
import { useQueryClient } from 'react-query';
import { Box, Divider, Grid } from '@material-ui/core';

import JourneyInstanceLayout from 'layout/organize/JourneyInstanceLayout';

import JourneyInstanceSidebar from 'components/organize/journeys/JourneyInstanceSidebar';
import JourneyInstanceSummary from 'components/organize/journeys/JourneyInstanceSummary';
import { organizationResource } from 'api/organizations';
import { PageWithLayout } from 'types';
import SnackbarContext from 'hooks/SnackbarContext';
import Timeline from 'components/Timeline';
import ZetkinQuery from 'components/ZetkinQuery';
import ZetkinSection from 'components/ZetkinSection';
import {
  journeyInstanceResource,
  journeyInstanceTimelineResource,
} from 'api/journeys';
import { scaffold, ScaffoldedGetServerSideProps } from 'utils/next';
import { ZetkinJourneyInstance, ZetkinPerson } from 'types/zetkin';

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

    const { state: journeyInstanceQueryState } = await journeyInstanceResource(
      orgId as string,
      instanceId as string
    ).prefetch(ctx);

    if (
      journeyInstanceQueryState?.data &&
      journeyInstanceQueryState.data.journey.id.toString() !==
        (journeyId as string)
    ) {
      return {
        redirect: {
          destination: `/organize/${orgId}/journeys/${journeyInstanceQueryState.data.journey.id}/${instanceId}`,
          permanent: false,
        },
      };
    }

    if (
      orgQueryState?.status === 'success' &&
      journeyInstanceQueryState?.status === 'success'
    ) {
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

export interface JourneyDetailsPageProps {
  instanceId: string;
  orgId: string;
}

const JourneyDetailsPage: PageWithLayout<JourneyDetailsPageProps> = ({
  instanceId,
  orgId,
}) => {
  const {
    key,
    useAddAssignee,
    useAddSubject,
    useAssignTag,
    useQuery,
    useRemoveAssignee,
    useRemoveSubject,
    useUnassignTag,
  } = journeyInstanceResource(orgId, instanceId);
  const { useQueryUpdates, useAddNote } = journeyInstanceTimelineResource(
    orgId,
    instanceId
  );
  const intl = useIntl();
  const journeyInstanceQuery = useQuery();
  const addAssigneeMutation = useAddAssignee();
  const removeAssigneeMutation = useRemoveAssignee();
  const addMemberMutation = useAddSubject();
  const removeMemberMutation = useRemoveSubject();
  const assignTagMutation = useAssignTag();
  const unassignTagMutation = useUnassignTag();
  const updatesQuery = useQueryUpdates();
  const addNoteMutation = useAddNote();

  const journeyInstance = journeyInstanceQuery.data as ZetkinJourneyInstance;

  const { showSnackbar } = useContext(SnackbarContext);
  const queryClient = useQueryClient();

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
          <Box mb={3} mt={4}>
            <Divider />
          </Box>
          <ZetkinSection
            title={intl.formatMessage({
              id: 'pages.organizeJourneyInstance.sections.timeline',
            })}
          >
            <ZetkinQuery queries={{ updatesQuery }}>
              {({ queries: { updatesQuery } }) => (
                <Timeline
                  disabled={addNoteMutation.isLoading}
                  onAddNote={(note) => {
                    addNoteMutation.mutate(note, {
                      onError: () => showSnackbar('error'),
                    });
                  }}
                  updates={updatesQuery.data}
                />
              )}
            </ZetkinQuery>
          </ZetkinSection>
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
