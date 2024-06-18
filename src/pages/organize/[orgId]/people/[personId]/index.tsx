import { GetServerSideProps } from 'next';
import { Grid } from '@mui/material';
import Head from 'next/head';
import { useContext } from 'react';

import BackendApiClient from 'core/api/client/BackendApiClient';
import messageIds from 'features/profile/l10n/messageIds';
import { PageWithLayout } from 'utils/types';
import PersonDetailsCard from 'features/profile/components/PersonDetailsCard';
import PersonJourneysCard from 'features/profile/components/PersonJourneysCard';
import PersonOrganizationsCard from 'features/profile/components/PersonOrganizationsCard';
import SinglePersonLayout from 'features/profile/layout/SinglePersonLayout';
import { TagManagerSection } from 'features/tags/components/TagManager';
import useCustomFields from 'features/profile/hooks/useCustomFields';
import useJourneys from 'features/journeys/hooks/useJourneys';
import { useMessages } from 'core/i18n';
import { useNumericRouteParams } from 'core/hooks';
import usePerson from 'features/profile/hooks/usePerson';
import usePersonTags from 'features/tags/hooks/usePersonTags';
import useTagging from 'features/tags/hooks/useTagging';
import ZUIFuture from 'zui/ZUIFuture';
import ZUISnackbarContext from 'zui/ZUISnackbarContext';
import { scaffold, ScaffoldedGetServerSideProps } from 'utils/next';

export const scaffoldOptions = {
  authLevelRequired: 2,
  localeScope: ['layout.organize', 'pages.people'],
};

export const getPersonScaffoldProps: ScaffoldedGetServerSideProps = async (
  ctx
) => {
  const { orgId, personId } = ctx.params!;

  try {
    const apiClient = new BackendApiClient(ctx.req.headers);
    await apiClient.get(`/api/orgs/${orgId}/people/${personId}`);
    return {
      props: {
        orgId,
        personId,
      },
    };
  } catch (err) {
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
  const messages = useMessages(messageIds);
  const { showSnackbar } = useContext(ZUISnackbarContext);
  const { assignToPerson, removeFromPerson } = useTagging(orgId);
  const fieldsFuture = useCustomFields(orgId);
  const personFuture = usePerson(orgId, personId);
  const person = personFuture.data;
  const personTagsFuture = usePersonTags(orgId, personId);
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
          <ZUIFuture future={fieldsFuture}>
            {(fields) => (
              <PersonDetailsCard customFields={fields} person={person} />
            )}
          </ZUIFuture>
        </Grid>
        <Grid item lg={4} xs={12}>
          <ZUIFuture future={personTagsFuture}>
            {(personTags) => (
              <TagManagerSection
                assignedTags={personTags}
                onAssignTag={async (tag) => {
                  try {
                    await assignToPerson(personId, tag.id, tag.value);
                  } catch (err) {
                    showSnackbar('error');
                  }
                }}
                onUnassignTag={async (tag) => {
                  try {
                    await removeFromPerson(personId, tag.id);
                  } catch (err) {
                    showSnackbar('error');
                  }
                }}
                submitCreateTagLabel={messages.tags.createAndApplyLabel()}
              />
            )}
          </ZUIFuture>
        </Grid>
        {journeysFuture.data?.length && (
          <Grid item lg={4} xs={12}>
            <PersonJourneysCard orgId={orgId} personId={personId} />
          </Grid>
        )}
        <Grid item lg={4} xs={12}>
          <PersonOrganizationsCard orgId={orgId} personId={personId} />
        </Grid>
      </Grid>
    </>
  );
};

PersonProfilePage.getLayout = function getLayout(page) {
  return <SinglePersonLayout>{page}</SinglePersonLayout>;
};

export default PersonProfilePage;
