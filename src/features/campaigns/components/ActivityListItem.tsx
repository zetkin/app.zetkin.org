import makeStyles from '@mui/styles/makeStyles';
import { OverridableComponent } from '@mui/material/OverridableComponent';
import { Box, SvgIconTypeMap, Theme, Typography } from '@mui/material';

import ZUIIconLabel from 'zui/ZUIIconLabel';

export const enum ACTIVITY_STATE {
  OPEN = 'open',
  SCHEDULED = 'scheduled',
  DRAFT = 'draft',
  CLOSED = 'closed',
}

interface StyleProps {
  state: ACTIVITY_STATE;
}

const useStyles = makeStyles<Theme, StyleProps>((theme) => ({
  box: {
    alignItems: 'center',
    borderBottom: `2px solid ${theme.palette.grey[300]}`,
    display: 'flex',
    justifyContent: 'space-between',
    padding: '1em',
  },
  dot: {
    backgroundColor: ({ state }) => theme.palette.status[state],
    borderRadius: '100%',
    height: '10px',
    marginRight: '1em',
    width: '10px',
  },
  left: {
    alignItems: 'center',
    display: 'flex',
  },
  pillBlue: {
    borderColor: theme.palette.targetingStatusBar.blue,
    borderStyle: 'solid none solid solid',
    borderWidth: '2px',
    color: theme.palette.targetingStatusBar.blue,
    fontSize: '14px',
    padding: '3px 5px',
  },
  pillGreen: {
    borderColor: theme.palette.targetingStatusBar.green,
    borderRadius: '0 50em 50em 0',
    borderStyle: 'solid',
    borderWidth: '2px',
    color: theme.palette.targetingStatusBar.green,
    fontSize: '14px',
    padding: '3px 7px 3px 5px',
  },
  pillOrange: {
    borderColor: theme.palette.targetingStatusBar.orange,
    borderRadius: '50em 0 0 50em',
    borderStyle: 'solid none solid solid',
    borderWidth: '2px',
    color: theme.palette.targetingStatusBar.orange,
    fontSize: '14px',
    padding: '3px 5px 3px 7px',
  },
  primaryIcon: {
    color: theme.palette.grey[500],
    fontSize: '28px',
  },
  right: {
    display: 'flex',
    justifyContent: 'space-between',
    width: '20%',
  },
  secondaryIcon: {
    color: theme.palette.grey[700],
    margin: '0 0.5em',
  },
}));

interface AcitivityListItemProps {
  PrimaryIcon: OverridableComponent<
    SvgIconTypeMap<Record<string, unknown>, 'svg'>
  >;
  SecondaryIcon?: OverridableComponent<
    SvgIconTypeMap<Record<string, unknown>, 'svg'>
  >;
  message?: string;
  state: ACTIVITY_STATE;
  title: string;
}

const ActivityListItem = ({
  PrimaryIcon,
  SecondaryIcon,
  message,
  state,
  title,
}: AcitivityListItemProps) => {
  const classes = useStyles({ state });
  return (
    <Box key={title} className={classes.box}>
      <Box className={classes.left}>
        <Box className={classes.dot}></Box>
        <PrimaryIcon className={classes.primaryIcon} />
        <Typography sx={{ paddingX: 2 }}>{title}</Typography>
        {message && <Typography color="secondary">{message}</Typography>}
      </Box>
      <Box className={classes.right}>
        <Box display="flex">
          <Box className={classes.pillOrange}>23784</Box>
          <Box className={classes.pillBlue}>561</Box>
          <Box className={classes.pillGreen}>972</Box>
        </Box>
        <ZUIIconLabel
          icon={
            SecondaryIcon ? (
              <SecondaryIcon className={classes.secondaryIcon} />
            ) : (
              <PrimaryIcon className={classes.secondaryIcon} />
            )
          }
          label={'1546'}
          labelColor="secondary"
        />
      </Box>
    </Box>
  );
};

export default ActivityListItem;
