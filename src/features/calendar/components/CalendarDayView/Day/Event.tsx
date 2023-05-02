import { Box } from '@mui/material';
import { ZetkinEvent } from 'utils/types/zetkin';

const Event = ({ event }: { event: ZetkinEvent }) => {
  return (
    <Box
      display="flex"
      flexDirection="row"
      padding={1}
      sx={{ backgroundColor: 'white', borderRadius: '3px' }}
      width="100%"
    >
      Event
    </Box>
  );
};

export default Event;
