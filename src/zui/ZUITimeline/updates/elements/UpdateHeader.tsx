import { Grid, Typography } from '@mui/material';

import { ZetkinUpdate } from 'zui/ZUITimeline/types';
import ZUIRelativeTime from 'zui/ZUIRelativeTime';

interface UpdateHeaderProps {
  children: React.ReactNode;
  timestamp: ZetkinUpdate['timestamp'];
}

const UpdateHeader: React.FC<UpdateHeaderProps> = ({ children, timestamp }) => {
  return (
    <Grid container direction="row" spacing={1}>
      <Typography component={Grid} item variant="body2">
        {children}
      </Typography>
      <Typography color="textSecondary" component={Grid} item variant="body2">
        <ZUIRelativeTime convertToLocal datetime={timestamp} forcePast />
      </Typography>
    </Grid>
  );
};

export default UpdateHeader;
