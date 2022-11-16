import { makeStyles } from '@material-ui/styles';
import { Box, Divider, Theme, Typography } from '@material-ui/core';

interface StatusCardHeaderProps {
  chipColor: string;
  subtitle: string;
  targetingDone: boolean;
  title: string;
  value: number;
}

const useStyles = makeStyles<Theme, { chipColor: string }>(() => ({
  chip: {
    backgroundColor: ({ chipColor }) => chipColor,
    borderRadius: '1em',
    color: 'white',
    display: 'flex',
    fontSize: '1.8em',
    lineHeight: 'normal',
    marginRight: '0.1em',
    overflow: 'hidden',
    padding: '0.2em 0.7em',
  },
}));

const StatusCardHeader = ({
  chipColor,
  subtitle,
  targetingDone,
  title,
  value,
}: StatusCardHeaderProps) => {
  const classes = useStyles({ chipColor });
  return (
    <Box>
      <Box
        alignItems="center"
        display="flex"
        justifyContent="space-between"
        p={2}
      >
        <Box>
          <Typography variant="h4">{title}</Typography>
          <Typography color="secondary">{subtitle}</Typography>
        </Box>
        {targetingDone && <Box className={classes.chip}>{value}</Box>}
      </Box>
      <Divider />
    </Box>
  );
};

export default StatusCardHeader;
