import { GetServerSideProps } from 'next';
import { Grid } from '@material-ui/core';
import Head from 'next/head';

import { PageWithLayout } from 'types';
import PersonDetailsCard from 'components/organize/people/PersonDetailsCard';
import PersonOrganizationsCard from 'components/organize/people/PersonOrganizationsCard';
import { personResource } from 'api/people';
import { scaffold } from 'utils/next';
import SinglePersonLayout from 'layout/organize/SinglePersonLayout';

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

export type PersonProfilePageProps = {
  orgId: string;
  personId: string;
};

const PersonProfilePage: PageWithLayout<PersonProfilePageProps> = ({
  personId,
  orgId,
}) => {
  const { data: person } = personResource(orgId, personId).useQuery();

  if (!person) return null;

  return (
    <>
      <Head>
        <title>
          {person?.first_name} {person?.last_name}
        </title>
      </Head>
      <Grid container direction="row" spacing={6}>
        <Grid item lg={4}>
          <PersonDetailsCard {...{ person }} />
        </Grid>
        <Grid item lg={4}>
          <PersonOrganizationsCard {...{ orgId, personId }} />
        </Grid>
      </Grid>
    </>
  );
};

PersonProfilePage.getLayout = function getLayout(page) {
  return <SinglePersonLayout>{page}</SinglePersonLayout>;
};

export default PersonProfilePage;
