import { GetServerSideProps } from 'next';
import { Box, CircularProgress, Typography } from '@mui/material';

import DuplicateCard from 'features/duplicates/components/DuplicateCard';
import messageIds from 'features/duplicates/l10n/messageIds';
import { PageWithLayout } from 'utils/types';
import PeopleLayout from 'features/views/layout/PeopleLayout';
import { scaffold } from 'utils/next';
import oldTheme from 'theme';
import useDuplicates from 'features/duplicates/hooks/useDuplicates';
import { useMessages } from 'core/i18n';
import { useNumericRouteParams } from 'core/hooks';
import useServerSide from 'core/useServerSide';

export const getServerSideProps: GetServerSideProps = scaffold(async () => {
  return {
    props: {},
  };
});

const DuplicatesPage: PageWithLayout = () => {
  const onServer = useServerSide();
  const { orgId } = useNumericRouteParams();
  const list = useDuplicates(orgId);
  const messages = useMessages(messageIds);

  if (onServer) {
    return null;
  }

  return (
    <>
      {list.isLoading && (
        <Box display="flex" justifyContent="center" m={2}>
          <CircularProgress />
        </Box>
      )}
      {!list.isLoading && list.data?.length === 0 && (
        <Box m={2}>
          <Typography variant="overline">
            {messages.page.noDuplicates()}
          </Typography>
          <Typography variant="body1">
            {messages.page.noDuplicatesDescription()}
          </Typography>
        </Box>
      )}
      {list.data && list.data.length > 0 && (
        <Box p={1.5}>
          <Typography
            color={oldTheme.palette.grey[500]}
            sx={{ mb: 2, textTransform: 'uppercase' }}
            variant="subtitle2"
          >
            {messages.page.possibleDuplicates()}
          </Typography>
          {list.data
            .filter((cluster) => cluster.status === 'pending')
            .map((cluster) => (
              <DuplicateCard key={cluster.id} cluster={cluster} />
            ))}
        </Box>
      )}
    </>
  );
};

DuplicatesPage.getLayout = function getLayout(page) {
  return <PeopleLayout>{page}</PeopleLayout>;
};

export default DuplicatesPage;
