import { Box, Button, Card, Typography } from '@mui/material';

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
    <Card sx={{ alignItems: 'flex-start', display: 'flex', p: 2 }}>
      <Box
        sx={{
          alignItems: 'center',
          bgcolor: 'grey.200',
          display: 'flex',
          height: 180,
          justifyContent: 'center',
          mr: 2,
          width: 120,
        }}
      >
        <Typography color="textSecondary" variant="caption">
          Preview coming soon
        </Typography>
      </Box>
      <Box display="flex" justifyContent="space-between">
        <Typography variant="h6">Theme {props.themeId}</Typography>
        <Button size="small" variant="outlined">
          {messages.themes.themeCard.edit()}
        </Button>
        <Button onClick={() => deleteEmailTheme(props.themeId)} size="small">
          {messages.themes.themeCard.delete()}
        </Button>
      </Box>
    </Card>
  );
};

export default ThemeCard;
