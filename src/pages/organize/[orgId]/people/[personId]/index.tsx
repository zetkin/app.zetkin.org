import { GetServerSideProps } from 'next';
import { Grid } from '@mui/material';
import Head from 'next/head';
import { useContext } from 'react';
import { useQueryClient } from 'react-query';

import { PageWithLayout } from 'utils/types';
import PersonDetailsCard from 'features/profile/components/PersonDetailsCard';
import PersonJourneysCard from 'features/profile/components/PersonJourneysCard';
import PersonOrganizationsCard from 'features/profile/components/PersonOrganizationsCard';
import SinglePersonLayout from 'features/profile/layout/SinglePersonLayout';
import { TagManagerSection } from 'features/tags/components/TagManager';
import useJourneys from 'features/journeys/hooks/useJourneys';
import { useNumericRouteParams } from 'core/hooks';
import ZUIQuery from 'zui/ZUIQuery';
import ZUISnackbarContext from 'zui/ZUISnackbarContext';
import {
  personFieldsResource,
  personResource,
  personTagsResource,
} from 'features/profile/api/people';
import { scaffold, ScaffoldedGetServerSideProps } from 'utils/next';

export const scaffoldOptions = {
  authLevelRequired: 2,
  localeScope: ['layout.organize', 'pages.people'],
};

export const getPersonScaffoldProps: ScaffoldedGetServerSideProps = async (
  ctx
) => {
  const { orgId, personId } = ctx.params!;

  const { prefetch } = personResource(orgId as string, personId as string);
  const { state: personQueryState } = await prefetch(ctx);

  if (personQueryState?.status === 'success') {
    return {
      props: {
        orgId,
        personId,
      },
    };
  } else {
    return {
      notFound: true,
    };
  }
};

export const getServerSideProps: GetServerSideProps = scaffold(
  getPersonScaffoldProps,
  scaffoldOptions
);

const PersonProfilePage: PageWithLayout = () => {
  const { orgId, personId } = useNumericRouteParams();
  const { showSnackbar } = useContext(ZUISnackbarContext);
  const queryClient = useQueryClient();

  const {
    key: personTagsKey,
    useAssign,
    useQuery: usePersonTagsQuery,
    useUnassign,
  } = personTagsResource(orgId.toString(), personId.toString());
  const customFieldsQuery = personFieldsResource(orgId.toString()).useQuery();
  const assignTagMutation = useAssign();
  const unassignTagMutation = useUnassign();
  const personTagsQuery = usePersonTagsQuery();

  const { data: person } = personResource(
    orgId.toString(),
    personId.toString()
  ).useQuery();

  const journeysFuture = useJourneys(orgId);

  if (!person) {
    return null;
  }

  return (
    <>
      <Head>
        <title>
          {person?.first_name} {person?.last_name}
        </title>
      </Head>
      <Grid container direction="row" spacing={6}>
        <Grid item lg={4} xs={12}>
          <ZUIQuery queries={{ customFieldsQuery }}>
            {({ queries: { customFieldsQuery } }) => (
              <PersonDetailsCard
                customFields={customFieldsQuery.data}
                person={person}
              />
            )}
          </ZUIQuery>
        </Grid>
        <Grid item lg={4} xs={12}>
          <ZUIQuery queries={{ personTagsQuery }}>
            {({ queries: { personTagsQuery } }) => (
              <TagManagerSection
                assignedTags={personTagsQuery.data}
                onAssignTag={(tag) => {
                  const tagBody = { id: tag.id, value: tag.value };
                  assignTagMutation.mutate(tagBody, {
                    onError: () => showSnackbar('error'),
                  });
                }}
                onTagEdited={() => {
                  queryClient.invalidateQueries(personTagsKey);
                }}
                onUnassignTag={(tag) =>
                  unassignTagMutation.mutate(tag.id, {
                    onError: () => showSnackbar('error'),
                  })
                }
              />
            )}
          </ZUIQuery>
        </Grid>
        {journeysFuture.data?.length && (
          <Grid item lg={4} xs={12}>
            <PersonJourneysCard
              orgId={orgId.toString()}
              personId={personId.toString()}
            />
          </Grid>
        )}
        <Grid item lg={4} xs={12}>
          <PersonOrganizationsCard
            orgId={orgId.toString()}
            personId={personId.toString()}
          />
        </Grid>
      </Grid>
    </>
  );
};

PersonProfilePage.getLayout = function getLayout(page) {
  return <SinglePersonLayout>{page}</SinglePersonLayout>;
};

export default PersonProfilePage;
