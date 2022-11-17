import { Box, ListItem, Typography } from '@material-ui/core';

interface StatusCardItemProps {
  action?: JSX.Element;
  title: string;
  value: number | undefined;
}

const StatusCardItem = ({ action, title, value }: StatusCardItemProps) => {
  return (
    <ListItem>
      <Box display="flex" justifyContent="space-between" width="100%">
        <Box display="flex" flexDirection="column">
          <Typography color="secondary" variant="h5">
            {title}
          </Typography>
          <Typography variant="h3">
            {value != undefined ? value : '-'}
          </Typography>
        </Box>
        {action && action}
      </Box>
    </ListItem>
  );
};

export default StatusCardItem;
