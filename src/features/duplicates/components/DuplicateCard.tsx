import messageIds from '../l10n/messageIds';
import theme from 'theme';
import useDuplicatesMutations from '../hooks/useDuplicatesMutations';
import { useMessages } from 'core/i18n';
import { useNumericRouteParams } from 'core/hooks';
import { ZetkinDuplicate } from '../store';
import { ZUIConfirmDialogContext } from 'zui/ZUIConfirmDialogProvider';
import ZUIPerson from 'zui/ZUIPerson';
import ZUIPersonHoverCard from 'zui/ZUIPersonHoverCard';
import { Box, Button, Paper, Typography } from '@mui/material';
import { FC, useContext } from 'react';

type DuplicateCardProps = { cluster: ZetkinDuplicate };

const DuplicateCard: FC<DuplicateCardProps> = ({ cluster }) => {
  const messages = useMessages(messageIds);
  const { orgId } = useNumericRouteParams();
  const { showConfirmDialog } = useContext(ZUIConfirmDialogContext);
  const { dismissDuplicate } = useDuplicatesMutations(orgId);

  return (
    <Paper elevation={2} sx={{ p: 1.5 }}>
      <Box display={'flex'} flexDirection={'column'} gap={1.5}>
        <Typography
          color={theme.palette.grey[500]}
          sx={{ textTransform: 'uppercase' }}
          variant="subtitle2"
        >
          {messages.page.possibleDuplicatesDescription({
            numPeople: cluster.duplicates.length,
          })}
        </Typography>
        <Box display={'flex'} flexWrap={'wrap'}>
          {cluster.duplicates.map((duplicate, index) => (
            <ZUIPersonHoverCard key={index} personId={duplicate.id}>
              <Box component="div" sx={{ display: 'inline', pb: 1.5, pr: 4 }}>
                <ZUIPerson
                  key={index}
                  id={duplicate.id}
                  name={`${duplicate.first_name} ${duplicate.last_name}`}
                />
              </Box>
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
          <Button variant="outlined">{messages.page.resolve()}</Button>
        </Box>
      </Box>
    </Paper>
  );
};

export default DuplicateCard;
