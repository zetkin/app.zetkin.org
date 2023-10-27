import { GetServerSideProps } from 'next';
import { Grid } from '@mui/material';
import Head from 'next/head';

import { PageWithLayout } from 'utils/types';
import PersonDeleteCard from 'features/profile/components/PersonDeleteCard';
import { personResource } from 'features/profile/api/people';
import { scaffold } from 'utils/next';
import SinglePersonLayout from 'features/profile/layout/SinglePersonLayout';
import { getPersonScaffoldProps, scaffoldOptions } from '../index';

export const getServerSideProps: GetServerSideProps = scaffold(
  getPersonScaffoldProps,
  scaffoldOptions
);

interface PersonManagePageProps {
  orgId: string;
  personId: string;
}

const PersonManagePage: PageWithLayout<PersonManagePageProps> = ({
  orgId,
  personId,
}) => {
  const { data: person } = personResource(orgId, personId).useQuery();

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
        <Grid item lg={4}>
          <PersonDeleteCard orgId={orgId} person={person} />
        </Grid>
      </Grid>
    </>
  );
};

PersonManagePage.getLayout = function getLayout(page) {
  return <SinglePersonLayout>{page}</SinglePersonLayout>;
};

export default PersonManagePage;
