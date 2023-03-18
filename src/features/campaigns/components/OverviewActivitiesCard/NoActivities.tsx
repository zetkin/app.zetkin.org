import { FlagOutlined } from '@mui/icons-material';

import { Box, Typography } from '@mui/material';

interface NoActivitiesProps {
  message: string;
}

const NoActivitiesOverview = ({ message }: NoActivitiesProps) => {
  return (
    <Box
      alignItems="center"
      display="flex"
      flexDirection="column"
      paddingBottom={5}
      paddingTop={5}
    >
      <FlagOutlined color="secondary" sx={{ fontSize: '12em' }} />
      <Typography color="secondary">{message}</Typography>
    </Box>
  );
};

export default NoActivitiesOverview;
