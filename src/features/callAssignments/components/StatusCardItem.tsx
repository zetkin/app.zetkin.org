import { Box, ListItem, Typography } from '@material-ui/core';

interface StatusCardItemProps {
  title: string;
  value: number | undefined;
}

const StatusCardItem = ({ title, value }: StatusCardItemProps) => {
  return (
    <ListItem>
      <Box display="flex">
        <Box display="flex" flexDirection="column">
          <Typography color="secondary" variant="h5">
            {title}
          </Typography>
          <Typography variant="h3">
            {value != undefined ? value : '-'}
          </Typography>
        </Box>
      </Box>
    </ListItem>
  );
};

export default StatusCardItem;
