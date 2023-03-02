import { Box, Switch, Typography } from '@mui/material';

import messageIds from '../../../l10n/messageIds';
import { useMessages } from 'core/i18n';

const GroupToggle: React.FunctionComponent<{
  checked?: boolean;
  onChange: () => void;
}> = ({ checked, onChange }) => {
  const messages = useMessages(messageIds);

  return (
    <Box alignItems="center" display="flex">
      <Typography variant="body2">{messages.manager.groupTags()}</Typography>
      <Switch
        checked={checked}
        data-testid="TagManager-groupToggle"
        name="Tags"
        onChange={onChange}
      />
    </Box>
  );
};

export default GroupToggle;
