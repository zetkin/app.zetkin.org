import { GetServerSideProps } from 'next';
import messageIds from 'features/duplicates/l10n/messageIds';
import { PageWithLayout } from 'utils/types';
import PeopleLayout from 'features/views/layout/PeopleLayout';
import { scaffold } from 'utils/next';
import { useContext } from 'react';
import useDuplicates from 'features/duplicates/hooks/useDuplicates';
import useDuplicatesMutations from 'features/duplicates/hooks/useDuplicatesMutations';
import { useMessages } from 'core/i18n';
import useServerSide from 'core/useServerSide';
import { ZUIConfirmDialogContext } from 'zui/ZUIConfirmDialogProvider';
import ZUIPerson from 'zui/ZUIPerson';
import ZUIPersonHoverCard from 'zui/ZUIPersonHoverCard';
import { Box, Button, Paper, Typography } from '@mui/material';

import theme from 'theme';
import { useNumericRouteParams } from 'core/hooks';

export const getServerSideProps: GetServerSideProps = scaffold(async () => {
  return {
    props: {},
  };
});

const DuplicatesPage: PageWithLayout = () => {
  const { orgId } = useNumericRouteParams();
  const onServer = useServerSide();
  const list = useDuplicates().data ?? [];
  const messages = useMessages(messageIds);
  const { showConfirmDialog } = useContext(ZUIConfirmDialogContext);
  const { dismissDuplicate } = useDuplicatesMutations(orgId);

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
        <Box p={1.5}>
          <Typography
            color={theme.palette.grey[500]}
            sx={{ mb: 2, textTransform: 'uppercase' }}
            variant="subtitle2"
          >
            {messages.page.possibleDuplicates()}
          </Typography>
          {list.map((cluster) => (
            <Paper key={cluster.id} elevation={2} sx={{ p: 1.5 }}>
              <Box display={'flex'} flexDirection={'column'} gap={1.5}>
                <Typography
                  color={theme.palette.grey[500]}
                  sx={{ textTransform: 'uppercase' }}
                  variant="subtitle2"
                >
                  {messages.page.possibleDuplicatesDescription({
                    numPeople: cluster.duplicatePersons.length,
                  })}
                </Typography>
                <Box display={'flex'} flexWrap={'wrap'} gap={4}>
                  {cluster.duplicatePersons.map((duplicate, index) => (
                    <ZUIPersonHoverCard key={index} personId={duplicate.id}>
                      <ZUIPerson
                        key={index}
                        id={duplicate.id}
                        name={`${duplicate.first_name} ${duplicate.last_name}`}
                      />
                    </ZUIPersonHoverCard>
                  ))}
                </Box>
                <Box sx={{ display: 'flex', gap: 1, justifyContent: 'right' }}>
                  <Button
                    onClick={() => {
                      showConfirmDialog({
                        onSubmit: () => dismissDuplicate(cluster.id),
                      });
                    }}
                    variant="text"
                  >
                    {messages.page.dismiss()}
                  </Button>
                </Box>
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
