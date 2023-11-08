import makeStyles from '@mui/styles/makeStyles';
import NextLink from 'next/link';
import { OverridableComponent } from '@mui/material/OverridableComponent';
import { Box, SvgIconTypeMap, Theme, Tooltip, Typography } from '@mui/material';

import { CampaignActivity } from 'features/campaigns/types';
import getStatusDotLabel from 'features/events/utils/getStatusDotLabel';
import { isSameDate } from 'utils/dateUtils';
import messageIds from 'features/campaigns/l10n/messageIds';
import { Msg } from 'core/i18n';
import theme from 'theme';
import ZUIRelativeTime from 'zui/ZUIRelativeTime';
import ZUISuffixedNumber from 'zui/ZUISuffixedNumber';
import ZUIIconLabel, { ZUIIconLabelProps } from 'zui/ZUIIconLabel';

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
  endDate: CampaignActivity['visibleUntil'];
  startDate: CampaignActivity['visibleFrom'];
  focusDate: Date | null;
  href: string;
  meta?: JSX.Element;
  onClick?: (x: number, y: number) => void;
  title: string;
  endNumber: number | string;
  endNumberColor?: ZUIIconLabelProps['color'];
  statusBar?: JSX.Element | null;
  subtitle?: JSX.Element;
}

const OverviewListItem = ({
  PrimaryIcon,
  SecondaryIcon,
  endDate,
  startDate,
  focusDate,
  href,
  meta,
  onClick,
  title,
  endNumber,
  endNumberColor = 'secondary',
  statusBar,
  subtitle,
}: OverviewListItemProps) => {
  const color = getStatusColor(startDate, endDate);
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
      <a style={{ padding: '8px 0', textDecoration: 'none' }}>
        <Box
          my={2}
          onClick={(evt) => {
            if (onClick) {
              evt.preventDefault();
              onClick(evt.clientX, evt.clientY);
            }
          }}
        >
          <Box
            alignItems="center"
            display="flex"
            gap={1}
            justifyContent="space-between"
          >
            <Box flex="0 0" width={30}>
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
                  margin: 0,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {title}
              </Typography>
            </Box>
            {meta && <Box flex="0 0">{meta}</Box>}
            <Box flex="1 0 80px">
              <ZUIIconLabel
                color={endNumberColor}
                icon={<SecondaryIcon color={endNumberColor} />}
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
              <Tooltip title={getStatusDotLabel({ color })}>
                <Box className={classes.dot} />
              </Tooltip>
            </Box>
            <Box width="calc(100% - 30px - 80px - 20px)">
              <Typography color={theme.palette.grey[500]} variant="body2">
                {label}
              </Typography>
            </Box>
            <Box width={80}>{statusBar}</Box>
          </Box>
        </Box>
      </a>
    </NextLink>
  );
};

export default OverviewListItem;

function getStatusColor(
  startDate: Date | null,
  endDate: Date | null
): STATUS_COLORS {
  const now = new Date();

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
