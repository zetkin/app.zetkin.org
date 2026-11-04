import { GetServerSideProps } from 'next';
import { Grid } from '@mui/material';
import Head from 'next/head';

import { PageWithLayout } from 'utils/types';
import PersonDeleteCard from 'features/profile/components/PersonDeleteCard';
import PersonEmailPreferencesCard from 'features/profile/components/PersonEmailPreferencesCard';
import { scaffold } from 'utils/next';
import SinglePersonLayout from 'features/profile/layout/SinglePersonLayout';
import usePerson from 'features/profile/hooks/usePerson';
import { getPersonScaffoldProps, scaffoldOptions } from '../index';
import { EMAIL_SETTINGS } from 'utils/featureFlags';
import useFeature from 'utils/featureFlags/useFeature';

export const getServerSideProps: GetServerSideProps = scaffold(
  getPersonScaffoldProps,
  scaffoldOptions
);

interface PersonManagePageProps {
  orgId: number;
  personId: number;
}

const PersonManagePage: PageWithLayout<PersonManagePageProps> = ({
  orgId,
  personId,
}) => {
  const { data: person } = usePerson(orgId, personId);
  const hasEmailSettingsFeature = useFeature(EMAIL_SETTINGS, orgId);

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
      <Grid container direction="row" spacing={3}>
        {hasEmailSettingsFeature && (
          <Grid
            size={{ lg: 6, xs: 12 }}
            sx={{ '&:empty': { display: 'none' } }}
          >
            <PersonEmailPreferencesCard orgId={orgId} person={person} />
          </Grid>
        )}
        <Grid size={{ lg: 4, xs: 12 }}>
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
