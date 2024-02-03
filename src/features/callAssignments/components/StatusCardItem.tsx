import { Box, ListItem, Typography } from '@mui/material';

import ZUIAnimatedNumber from 'zui/ZUIAnimatedNumber';

interface StatusCardItemProps {
  action?: JSX.Element;
  title: string;
  value: number | undefined;
}

const StatusCardItem = ({ action, title, value }: StatusCardItemProps) => {
  return (
    <ListItem>
      <Box
        alignItems="flex-start"
        display="flex"
        justifyContent="space-between"
        width="100%"
      >
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
        {action && action}
      </Box>
    </ListItem>
  );
};

export default StatusCardItem;
