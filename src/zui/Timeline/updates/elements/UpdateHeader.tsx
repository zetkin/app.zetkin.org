import { Grid, Typography } from '@material-ui/core';

import ZetkinRelativeTime from 'components/ZetkinRelativeTime';
import { ZetkinUpdate } from 'zui/Timeline/updates/types';

interface UpdateHeaderProps {
  timestamp: ZetkinUpdate['timestamp'];
}

const UpdateHeader: React.FC<UpdateHeaderProps> = ({ children, timestamp }) => {
  return (
    <Grid container direction="row" spacing={1}>
      <Typography component={Grid} item variant="body2">
        {children}
      </Typography>
      <Typography color="textSecondary" component={Grid} item variant="body2">
        <ZetkinRelativeTime convertToLocal datetime={timestamp} forcePast />
      </Typography>
    </Grid>
  );
};

export default UpdateHeader;
