import { GetServerSideProps } from 'next';
import { Grid } from '@material-ui/core';
import Head from 'next/head';

import { PageWithLayout } from 'types';
import PersonDetailsCard from 'components/organize/people/PersonDetailsCard';
import PersonOrganisationsCard from 'components/organize/people/PersonOrganisationsCard';
import { scaffold } from 'utils/next';
import SinglePersonLayout from 'layout/organize/SinglePersonLayout';
import { personConnectionsResource, personResource } from 'api/people';

const scaffoldOptions = {
  authLevelRequired: 2,
  localeScope: ['layout.organize', 'pages.people', 'misc'],
};

export const getServerSideProps: GetServerSideProps = scaffold(async (ctx) => {
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
}, scaffoldOptions);

type PersonProfilePageProps = {
  orgId: string;
  personId: string;
};

const PersonProfilePage: PageWithLayout<PersonProfilePageProps> = ({
  personId,
  orgId,
}) => {
  const { data: person } = personResource(orgId, personId).useQuery();
  const { data: connections } = personConnectionsResource(
    orgId,
    personId
  ).useQuery();

  if (!person) return null;

  return (
    <>
      <Head>
        <title>
          {person?.first_name} {person?.last_name}
        </title>
      </Head>
      <Grid container direction="row" spacing={6}>
        <Grid item md={4}>
          <PersonDetailsCard {...{ person }} />
        </Grid>
        <Grid item md={4}>
          <PersonOrganisationsCard {...{ connections }} />
        </Grid>
      </Grid>
    </>
  );
};

PersonProfilePage.getLayout = function getLayout(page) {
  return <SinglePersonLayout>{page}</SinglePersonLayout>;
};

export default PersonProfilePage;
