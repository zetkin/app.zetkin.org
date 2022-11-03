import { Box, makeStyles } from '@material-ui/core';

import { CallAssignmentStats } from '../apiTypes';

const useStyles = makeStyles(() => ({
  animated: {
    transition: 'all 0.2s ease',
  },
}));

const CallAssignmentStatusBar: React.FunctionComponent<{
  stats: CallAssignmentStats;
}> = ({ stats }) => {
  const classes = useStyles();
  const total = stats ? stats.blocked + stats.done + stats.ready : 1;
  return (
    <Box
      borderRadius={50}
      display="flex"
      flexDirection="row"
      height={20}
      overflow="hidden"
    >
      {stats ? (
        <>
          <Box
            bgcolor={'rgba(245, 124, 0, 1)'}
            className={classes.animated}
            minWidth={10}
            mr={0.3}
            width={stats.blocked / total}
          />
          <Box
            bgcolor={'rgba(102, 187, 106, 1)'}
            className={classes.animated}
            minWidth={10}
            mr={0.3}
            width={stats.ready / total}
          />
          <Box
            bgcolor={'rgba(25, 118, 210, 1)'}
            className={classes.animated}
            minWidth={10}
            width={stats.done / total}
          />
        </>
      ) : (
        <>
          <Box bgcolor={'rgba(0, 0, 0, 0.12)'} mr={0.3} width={1 / 3} />
          <Box bgcolor={'rgba(0, 0, 0, 0.12)'} mr={0.3} width={1 / 3} />
          <Box bgcolor={'rgba(0, 0, 0, 0.12)'} width={1 / 3} />
        </>
      )}
    </Box>
  );
};

export default CallAssignmentStatusBar;
