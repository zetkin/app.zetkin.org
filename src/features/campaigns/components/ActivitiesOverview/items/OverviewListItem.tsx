import NextLink from 'next/link';
import { OverridableComponent } from '@mui/material/OverridableComponent';
import { Box, SvgIconTypeMap, Tooltip, Typography } from '@mui/material';

import { CampaignActivity } from 'features/campaigns/types';
import getStatusDotLabel from 'features/events/utils/getStatusDotLabel';
import { isSameDate } from 'utils/dateUtils';
import messageIds from 'features/campaigns/l10n/messageIds';
import { Msg } from 'core/i18n';
import ZUIRelativeTime from 'zui/ZUIRelativeTime';
import ZUISuffixedNumber from 'zui/ZUISuffixedNumber';
import ZUIIconLabel, { ZUIIconLabelProps } from 'zui/ZUIIconLabel';
import oldTheme from 'theme';

export enum STATUS_COLORS {
  BLUE = 'blue',
  GREEN = 'green',
  GREY = 'grey',
  ORANGE = 'orange',
  RED = 'red',
}

interface OverviewListItemProps {
  PrimaryIcon: OverridableComponent<
    SvgIconTypeMap<Record<string, unknown>, 'svg'>
  >;
  SecondaryIcon: OverridableComponent<
    SvgIconTypeMap<Record<string, unknown>, 'svg'>
  > | null;
  color: STATUS_COLORS;
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
  color,
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
  //const color = getStatusColor(startDate, endDate);
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
    <NextLink
      href={href}
      passHref
      style={{ padding: '8px 0', textDecoration: 'none' }}
    >
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
            <PrimaryIcon
              sx={{
                color: oldTheme.palette.grey[500],
                fontSize: '28px',
              }}
            />
          </Box>
          <Box
            sx={{
              overflow: 'hidden',
            }}
            width="calc(100% - 30px - 80px - 20px)"
          >
            <Typography
              color={oldTheme.palette.text.primary}
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
            {SecondaryIcon && (
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
            )}
          </Box>
        </Box>
        <Box alignItems="center" display="flex" justifyContent="space-between">
          <Box width={30}>
            <Tooltip title={getStatusDotLabel({ color })}>
              <Box
                sx={{
                  backgroundColor: oldTheme.palette.statusColors[color],
                  borderRadius: '100%',
                  height: '10px',
                  marginLeft: 'auto',
                  marginRight: 'auto',
                  width: '10px',
                }}
              />
            </Tooltip>
          </Box>
          <Box width="calc(100% - 30px - 80px - 20px)">
            <Typography color={oldTheme.palette.grey[500]} variant="body2">
              {label}
            </Typography>
          </Box>
          <Box width={80}>{statusBar}</Box>
        </Box>
      </Box>
    </NextLink>
  );
};

export default OverviewListItem;
