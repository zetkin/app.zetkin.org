import makeStyles from '@mui/styles/makeStyles';
import { OverridableComponent } from '@mui/material/OverridableComponent';
import { Box, SvgIconTypeMap, Theme, Typography } from '@mui/material';

import ZUIIconLabel from 'zui/ZUIIconLabel';
import ZUIMultiNumberChip from 'zui/ZUIMultiNumberChip';

export const enum ACTIVITY_STATE {
  OPEN = 'open',
  SCHEDULED = 'scheduled',
  DRAFT = 'draft',
  CLOSED = 'closed',
}

interface StyleProps {
  color: STATUS_COLORS;
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
    backgroundColor: ({ color }) => theme.palette.statusColors[color],
    borderRadius: '100%',
    height: '10px',
    marginRight: '1em',
    width: '10px',
  },
  left: {
    alignItems: 'center',
    display: 'flex',
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

export enum STATUS_COLORS {
  BLUE = 'blue',
  GREEN = 'green',
  GRAY = 'gray',
  ORANGE = 'orange',
  RED = 'red',
}

interface AcitivityListItemProps {
  PrimaryIcon: OverridableComponent<
    SvgIconTypeMap<Record<string, unknown>, 'svg'>
  >;
  SecondaryIcon?: OverridableComponent<
    SvgIconTypeMap<Record<string, unknown>, 'svg'>
  >;
  message?: string;
  color: STATUS_COLORS;
  title: string;
}

const ActivityListItem = ({
  PrimaryIcon,
  SecondaryIcon,
  message,
  color,
  title,
}: AcitivityListItemProps) => {
  const classes = useStyles({ color });
  return (
    <Box key={title} className={classes.box}>
      <Box className={classes.left}>
        <Box className={classes.dot}></Box>
        <PrimaryIcon className={classes.primaryIcon} />
        <Typography sx={{ paddingX: 2 }}>{title}</Typography>
        {message && <Typography color="secondary">{message}</Typography>}
      </Box>
      <Box className={classes.right}>
        <ZUIMultiNumberChip
          blueValue={234}
          greenValue={2342}
          orangeValue={343}
        />
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
