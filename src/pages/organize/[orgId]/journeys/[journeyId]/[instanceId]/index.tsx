import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { useContext } from 'react';
import { useIntl } from 'react-intl';
import { useQueryClient } from 'react-query';
import { Box, Divider, Grid } from '@mui/material';

import JourneyInstanceLayout from 'features/journeys/layout/JourneyInstanceLayout';
import JourneyInstanceOutcome from 'features/journeys/components/JourneyInstanceOutcome';
import { journeyInstanceResource } from 'features/journeys/api/journeys';
import JourneyInstanceSidebar from 'features/journeys/components/JourneyInstanceSidebar';
import JourneyInstanceSummary from 'features/journeys/components/JourneyInstanceSummary';
import { organizationResource } from 'features/journeys/api/organizations';
import { PageWithLayout } from 'utils/types';
import ZUISection from 'zui/ZUISection';
import ZUISnackbarContext from 'zui/ZUISnackbarContext';
import ZUITimelineWrapper from 'zui/ZUITimelineWrapper';
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
  const intl = useIntl();
  const journeyInstanceQuery = useQuery();
  const addAssigneeMutation = useAddAssignee();
  const removeAssigneeMutation = useRemoveAssignee();
  const addMemberMutation = useAddSubject();
  const removeMemberMutation = useRemoveSubject();
  const assignTagMutation = useAssignTag();
  const unassignTagMutation = useUnassignTag();

  const journeyInstance = journeyInstanceQuery.data as ZetkinJourneyInstance;

  const { showSnackbar } = useContext(ZUISnackbarContext);
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
          {journeyInstance.closed && (
            <JourneyInstanceOutcome journeyInstance={journeyInstance} />
          )}
          <Box mb={3} mt={4}>
            <Divider />
          </Box>
          <ZUISection
            title={intl.formatMessage({
              id: 'pages.organizeJourneyInstance.sections.timeline',
            })}
          >
            <ZUITimelineWrapper
              itemApiPath={`/orgs/${orgId}/journey_instances/${instanceId}`}
              queryKey={['journeyInstance', orgId, instanceId, 'timeline']}
            />
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
