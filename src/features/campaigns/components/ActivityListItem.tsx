import makeStyles from '@mui/styles/makeStyles';
import { OverridableComponent } from '@mui/material/OverridableComponent';
import { Box, SvgIconTypeMap, Theme, Typography } from '@mui/material';

import ZUIIconLabel from 'zui/ZUIIconLabel';
import ZUIMultiNumberChip from 'zui/ZUIMultiNumberChip';

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
  blueChipValue?: string | number;
  orangeChipValue: string | number | undefined;
  greenChipValue: string | number | undefined;
  message?: string;
  color: STATUS_COLORS;
  title: string;
  endNumber: string;
}

const ActivityListItem = ({
  PrimaryIcon,
  SecondaryIcon,
  message,
  blueChipValue,
  greenChipValue,
  orangeChipValue,
  color,
  title,
  endNumber,
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
          blueValue={blueChipValue}
          greenValue={greenChipValue}
          orangeValue={orangeChipValue}
        />
        <ZUIIconLabel
          icon={
            SecondaryIcon ? (
              <SecondaryIcon className={classes.secondaryIcon} />
            ) : (
              <PrimaryIcon className={classes.secondaryIcon} />
            )
          }
          label={endNumber}
          labelColor="secondary"
        />
      </Box>
    </Box>
  );
};

export default ActivityListItem;
