import { GetServerSideProps } from 'next';
import { Grid } from '@material-ui/core';
import Head from 'next/head';

import { PageWithLayout } from 'utils/types';
import PersonDeleteCard from 'components/organize/people/PersonDeleteCard';
import { personResource } from 'features/profile/api/people';
import { scaffold } from 'utils/next';
import SinglePersonLayout from 'features/profile/layouts/SinglePersonLayout';
import {
  getPersonScaffoldProps,
  PersonPageProps,
  scaffoldOptions,
} from '../index';

export const getServerSideProps: GetServerSideProps = scaffold(
  getPersonScaffoldProps,
  scaffoldOptions
);

const PersonManagePage: PageWithLayout<PersonPageProps> = (props) => {
  const { data: person } = personResource(
    props.orgId,
    props.personId
  ).useQuery();

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
          <PersonDeleteCard orgId={props.orgId} person={person} />
        </Grid>
      </Grid>
    </>
  );
};

PersonManagePage.getLayout = function getLayout(page) {
  return <SinglePersonLayout>{page}</SinglePersonLayout>;
};

export default PersonManagePage;
