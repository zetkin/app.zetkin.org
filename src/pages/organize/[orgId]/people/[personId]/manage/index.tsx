import { GetServerSideProps } from 'next';
import { Box, Grid } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import Head from 'next/head';

import newTheme from 'zui/theme';
import { PageWithLayout } from 'utils/types';
import PersonDeleteCard from 'features/profile/components/PersonDeleteCard';
import PersonEmailPreferencesCard from 'features/profile/components/PersonEmailPreferencesCard';
import { scaffold } from 'utils/next';
import SinglePersonLayout from 'features/profile/layout/SinglePersonLayout';
import usePerson from 'features/profile/hooks/usePerson';
import { getPersonScaffoldProps, scaffoldOptions } from '../index';

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
      <ThemeProvider theme={newTheme}>
        <Grid container direction="row" spacing={6}>
          <Grid size={{ lg: 6, xs: 12 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <PersonEmailPreferencesCard orgId={orgId} person={person} />
              <PersonDeleteCard orgId={orgId} person={person} />
            </Box>
          </Grid>
        </Grid>
      </ThemeProvider>
    </>
  );
};

PersonManagePage.getLayout = function getLayout(page) {
  return <SinglePersonLayout>{page}</SinglePersonLayout>;
};

export default PersonManagePage;
