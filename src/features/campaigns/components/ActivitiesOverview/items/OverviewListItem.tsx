import makeStyles from '@mui/styles/makeStyles';
import NextLink from 'next/link';
import { OverridableComponent } from '@mui/material/OverridableComponent';
import { Box, Link, SvgIconTypeMap, Theme, Typography } from '@mui/material';

import { CampaignActivity } from 'features/campaigns/models/CampaignActivitiesModel';
import { isSameDate } from 'utils/dateUtils';
import messageIds from 'features/campaigns/l10n/messageIds';
import { Msg } from 'core/i18n';
import theme from 'theme';
import ZUIIconLabel from 'zui/ZUIIconLabel';
import ZUIRelativeTime from 'zui/ZUIRelativeTime';
import ZUISuffixedNumber from 'zui/ZUISuffixedNumber';

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
    marginLeft: 'auto',
    marginRight: 'auto',
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

  activity: CampaignActivity;
  focusDate: Date | null;
  href: string;
  title: string;
  endNumber: number | string;
  statusBar?: JSX.Element | null;
  subtitle?: JSX.Element;
}

const OverviewListItem = ({
  activity,
  PrimaryIcon,
  SecondaryIcon,
  focusDate,
  href,
  title,
  endNumber,
  statusBar,
  subtitle,
}: OverviewListItemProps) => {
  const { endDate, startDate } = activity;
  const color = getStatusColor(activity);
  const classes = useStyles({ color });

  const now = new Date();
  let label: JSX.Element | null = null;

  if (subtitle) {
    label = subtitle;
  } else if (!focusDate) {
    if (startDate) {
      label = getStartsLabel(startDate);
    } else if (endDate) {
      label = getEndsLabel(endDate);
    }
  } else if (startDate && isSameDate(focusDate, startDate)) {
    label = getStartsLabel(startDate);
  } else if (endDate && isSameDate(focusDate, endDate)) {
    label = getEndsLabel(endDate);
  }

  function getEndsLabel(endDate: Date) {
    if (endDate && isSameDate(endDate, now)) {
      return <Msg id={messageIds.activitiesOverview.subtitles.endsToday} />;
    } else if (endDate && endDate > now) {
      return (
        <Msg
          id={messageIds.activitiesOverview.subtitles.endsLater}
          values={{
            relative: <ZUIRelativeTime datetime={endDate.toISOString()} />,
          }}
        />
      );
    }

    return null;
  }

  function getStartsLabel(startDate: Date) {
    if (startDate && isSameDate(startDate, now)) {
      return <Msg id={messageIds.activitiesOverview.subtitles.startsToday} />;
    } else if (startDate && startDate > now) {
      return (
        <Msg
          id={messageIds.activitiesOverview.subtitles.startsLater}
          values={{
            relative: <ZUIRelativeTime datetime={startDate.toISOString()} />,
          }}
        />
      );
    }

    return null;
  }

  return (
    <NextLink href={href} passHref>
      <Link my={2} underline="none">
        <Box my={2}>
          <Box alignItems="start" display="flex" justifyContent="space-between">
            <Box width={30}>
              <PrimaryIcon className={classes.primaryIcon} />
            </Box>
            <Box
              sx={{
                overflow: 'hidden',
              }}
              width="calc(100% - 30px - 80px - 20px)"
            >
              <Typography
                color={theme.palette.text.primary}
                sx={{
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {title}
              </Typography>
            </Box>
            <Box width={80}>
              <ZUIIconLabel
                color="secondary"
                icon={<SecondaryIcon color="secondary" />}
                label={
                  typeof endNumber === 'number' ? (
                    <ZUISuffixedNumber number={endNumber} />
                  ) : (
                    endNumber
                  )
                }
              />
            </Box>
          </Box>
          <Box
            alignItems="center"
            display="flex"
            justifyContent="space-between"
          >
            <Box width={30}>
              <Box className={classes.dot} />
            </Box>
            <Box width="calc(100% - 30px - 80px - 20px)">
              <Typography color={theme.palette.grey[500]} variant="body2">
                {label}
              </Typography>
            </Box>
            <Box width={80}>{statusBar}</Box>
          </Box>
        </Box>
      </Link>
    </NextLink>
  );
};

export default OverviewListItem;

function getStatusColor(activity: CampaignActivity): STATUS_COLORS {
  const now = new Date();
  const { endDate, startDate } = activity;

  if (startDate) {
    if (startDate > now) {
      return STATUS_COLORS.BLUE;
    } else if (startDate < now) {
      if (!endDate || endDate > now) {
        return STATUS_COLORS.GREEN;
      } else if (endDate && endDate < now) {
        // Should never happen, because it should not be
        // in the overview after it's closed.
        return STATUS_COLORS.RED;
      }
    }
  }

  // Should never happen, because it should not be in the
  // overview if it's not yet scheduled/published.
  return STATUS_COLORS.GRAY;
}
