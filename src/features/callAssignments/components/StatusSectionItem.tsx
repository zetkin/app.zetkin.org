import { Box, ListItem, Typography } from '@material-ui/core';

interface StatusSectionItemProps {
  title: string;
  value: number;
}

const StatusSectionItem = ({ title, value }: StatusSectionItemProps) => {
  return (
    <ListItem>
      <Box display="flex">
        <Box display="flex" flexDirection="column">
          <Typography color="secondary" variant="h5">
            {title}
          </Typography>
          <Typography variant="h3">{value}</Typography>
        </Box>
      </Box>
    </ListItem>
  );
};

export default StatusSectionItem;
