import makeStyles from '@mui/styles/makeStyles';
import NextLink from 'next/link';
import { OverridableComponent } from '@mui/material/OverridableComponent';
import {
  Box,
  Grid,
  Link,
  SvgIconTypeMap,
  Theme,
  Typography,
} from '@mui/material';

import theme from 'theme';
import ZUIIconLabel from 'zui/ZUIIconLabel';

interface StyleProps {
  color: STATUS_COLORS;
}

const useStyles = makeStyles<Theme, StyleProps>((theme) => ({
  container: {
    alignItems: 'center',
    display: 'flex',
    padding: '1em',
  },
  dot: {
    backgroundColor: ({ color }) => theme.palette.statusColors[color],
    borderRadius: '100%',
    height: '10px',
    marginRight: '1em',
    width: '10px',
  },
  endNumber: {
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'flex-start',
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
    alignItems: 'center',
    display: 'flex',
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

interface OverviewListItemProps {
  PrimaryIcon: OverridableComponent<
    SvgIconTypeMap<Record<string, unknown>, 'svg'>
  >;
  SecondaryIcon: OverridableComponent<
    SvgIconTypeMap<Record<string, unknown>, 'svg'>
  >;

  href: string;
  color: STATUS_COLORS;
  title: string;
  endNumber: string;
}

const OverviewListItem = ({
  PrimaryIcon,
  SecondaryIcon,
  href,
  color,
  title,
  endNumber,
}: OverviewListItemProps) => {
  const classes = useStyles({ color });

  return (
    <Grid className={classes.container} container>
      <Grid item lg={8} md={7} xs={6}>
        <Box className={classes.left}>
          <PrimaryIcon className={classes.primaryIcon} />
          <NextLink href={href} passHref>
            <Link underline="none">
              <Typography
                color={theme.palette.text.primary}
                sx={{ paddingX: 2 }}
              >
                {title}
              </Typography>
            </Link>
          </NextLink>
        </Box>
      </Grid>
      <Grid item lg={2} md={3} xs={4}></Grid>
      <Grid item xs={2}>
        <Box className={classes.endNumber}>
          <ZUIIconLabel
            icon={<SecondaryIcon color="secondary" />}
            label={endNumber}
            labelColor="secondary"
          />
        </Box>
      </Grid>
    </Grid>
  );
};

export default OverviewListItem;
