import { useIntl } from 'react-intl';
import { Box, Switch, Typography } from '@material-ui/core';

const GroupToggle: React.FunctionComponent<{
  checked?: boolean;
  onChange: () => void;
}> = ({ checked, onChange }) => {
  const intl = useIntl();
  return (
    <Box alignItems="center" display="flex">
      <Typography variant="body2">
        {intl.formatMessage({ id: 'misc.tags.tagManager.groupTags' })}
      </Typography>
      <Switch
        checked={checked}
        color="primary"
        data-testid="TagManager-groupToggle"
        name="Tags"
        onChange={onChange}
      />
    </Box>
  );
};

export default GroupToggle;
