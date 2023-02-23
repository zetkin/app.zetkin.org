import { Box, Switch, Typography } from '@mui/material';

import messages from '../../../messages';
import { useMessages } from 'core/i18n';

const GroupToggle: React.FunctionComponent<{
  checked?: boolean;
  onChange: () => void;
}> = ({ checked, onChange }) => {
  const msg = useMessages(messages);

  return (
    <Box alignItems="center" display="flex">
      <Typography variant="body2">{msg.manager.groupTags()}</Typography>
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
