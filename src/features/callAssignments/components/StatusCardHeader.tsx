import { makeStyles } from '@material-ui/styles';
import { Box, Divider, Theme, Typography } from '@material-ui/core';

import ZUIAnimatedNumber from 'zui/ZUIAnimatedNumber';

interface StatusCardHeaderProps {
  chipColor: keyof Theme['palette']['targetingStatusBar'];
  subtitle: string;
  title: string;
  value: number | undefined;
}

const useStyles = makeStyles<
  Theme,
  { chipColor: keyof Theme['palette']['targetingStatusBar'] }
>((theme) => ({
  chip: {
    backgroundColor: ({ chipColor }) =>
      theme.palette.targetingStatusBar[chipColor],
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
        {value != undefined && (
          <ZUIAnimatedNumber value={value || 0}>
            {(animatedValue) => (
              <Box className={classes.chip}>{animatedValue}</Box>
            )}
          </ZUIAnimatedNumber>
        )}
      </Box>
      <Divider />
    </Box>
  );
};

export default StatusCardHeader;
