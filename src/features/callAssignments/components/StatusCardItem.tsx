import { Box, ListItem, Typography } from '@material-ui/core';

import ZUIAnimatedNumber from 'zui/ZUIAnimatedNumber';

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
          <ZUIAnimatedNumber value={value || 0}>
            {(animatedValue) => {
              const output = value != undefined ? animatedValue : '-';
              return <Typography variant="h3">{output}</Typography>;
            }}
          </ZUIAnimatedNumber>
        </Box>
      </Box>
    </ListItem>
  );
};

export default StatusCardItem;
