import { Box, Grid } from '@material-ui/core';

import TimelineActor from 'components/Timeline/TimelineActor';
import UpdateHeader from './UpdateHeader';
import { ZetkinUpdate } from 'types/updates';

interface UpdateContainerProps {
  headerContent: React.ReactNode;
  update: ZetkinUpdate;
}

const UpdateContainer: React.FC<UpdateContainerProps> = ({
  children,
  headerContent,
  update,
}) => {
  return (
    <Box>
      <Grid container direction="row" spacing={2} wrap="nowrap">
        <Grid item>
          <TimelineActor actor={update.actor} size={32} />
        </Grid>
        <Grid item style={{ paddingTop: 22 }}>
          <Grid alignItems="stretch" container direction="column" spacing={2}>
            <UpdateHeader timestamp={update.timestamp}>
              {headerContent}
            </UpdateHeader>
            {children}
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

export default UpdateContainer;
