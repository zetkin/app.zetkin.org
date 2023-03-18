import { FlagOutlined } from '@mui/icons-material';

import { Box, Typography } from '@mui/material';

interface NoActivitiesProps {
  href?: string;
  linkMessage?: string;
  message: string;
}

const NoActivitiesOverview = ({
  href,
  linkMessage,
  message,
}: NoActivitiesProps) => {
  return (
    <Box
      alignItems="center"
      display="flex"
      flexDirection="column"
      paddingTop={5}
      paddingBottom={5}
    >
      <FlagOutlined color="secondary" sx={{ fontSize: '12em' }} />
      <Typography color="secondary">{message}</Typography>
    </Box>
  );
};

export default NoActivitiesOverview;
