import { Box, Button, Card, Stack, Typography } from '@mui/material';

import { useMessages } from 'core/i18n';
import messageIds from 'features/emails/l10n/messageIds';
import useEmailThemeMutations from 'features/emails/hooks/useEmailThemeMutations';

interface ThemeCardProps {
  orgId: number;
  themeId: number;
}

const ThemeCard: React.FC<ThemeCardProps> = (props) => {
  const messages = useMessages(messageIds);
  const { deleteEmailTheme } = useEmailThemeMutations(props.orgId);

  return (
    <Card sx={{ p: 2 }}>
      <Stack direction="row" spacing={2}>
        <Stack direction="column" spacing={2}>
          <Box
            sx={{
              alignItems: 'center',
              bgcolor: 'grey.200',
              display: 'flex',
              height: 180,
              justifyContent: 'center',
              width: 120,
            }}
          >
            <Typography color="textSecondary" variant="caption">
              Preview coming soon
            </Typography>
          </Box>
        </Stack>
        <Stack direction="column" spacing={1}>
          <Stack direction="row" spacing={1}>
            <Button size="small" variant="outlined">
              {messages.themes.themeCard.edit()}
            </Button>
            <Button
              onClick={() => deleteEmailTheme(props.themeId)}
              size="small"
            >
              {messages.themes.themeCard.delete()}
            </Button>
          </Stack>
          <Typography variant="h6">
            {messages.themes.themeCard.title({ themeId: props.themeId })}
          </Typography>
        </Stack>
      </Stack>
    </Card>
  );
};

export default ThemeCard;
