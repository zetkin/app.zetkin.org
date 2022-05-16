import { Grid, Typography } from '@material-ui/core';

import ZetkinRelativeTime from 'components/ZetkinRelativeTime';
import { ZetkinUpdate } from 'types/updates';

interface UpdateHeaderProps {
  timestamp: ZetkinUpdate['timestamp'];
}

const UpdateHeader: React.FC<UpdateHeaderProps> = ({ children, timestamp }) => {
  return (
    <Grid container direction="row" spacing={1} style={{ marginBottom: 8 }}>
      <Typography component={Grid} item variant="body2">
        {children}
      </Typography>
      <Typography color="textSecondary" component={Grid} item variant="body2">
        <ZetkinRelativeTime datetime={timestamp} />
      </Typography>
    </Grid>
  );
};

export default UpdateHeader;
