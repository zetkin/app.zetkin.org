import { GetServerSideProps } from 'next';
import messageIds from 'features/duplicates/l10n/messageIds';
import { PageWithLayout } from 'utils/types';
import PeopleLayout from 'features/views/layout/PeopleLayout';
import { scaffold } from 'utils/next';
import useDuplicates from 'features/duplicates/hooks/useDuplicates';
import { useMessages } from 'core/i18n';
import useServerSide from 'core/useServerSide';
import ZUIPerson from 'zui/ZUIPerson';
import { Box, Paper, Typography } from '@mui/material';

export const getServerSideProps: GetServerSideProps = scaffold(async () => {
  return {
    props: {},
  };
});

const DuplicatesPage: PageWithLayout = () => {
  const onServer = useServerSide();
  const list = useDuplicates().data ?? [];
  const messages = useMessages(messageIds);

  if (onServer) {
    return null;
  }

  return (
    <>
      {list.length === 0 && (
        <Box m={2}>
          <Typography variant="overline">
            {messages.page.noDuplicates()}
          </Typography>
          <Typography variant="body1">
            {messages.page.noDuplicatesDescription()}
          </Typography>
        </Box>
      )}
      {list.length > 0 && (
        <Box>
          {list.map((cluster) => (
            <Paper key={cluster.id} elevation={2} sx={{ m: 2, p: 1.5 }}>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                {cluster.duplicatePersons.map((duplicate, index) => (
                  <ZUIPerson
                    key={index}
                    id={duplicate.id}
                    name={`${duplicate.first_name} ${duplicate.last_name}`}
                  />
                ))}
              </Box>
            </Paper>
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
