import NextLink from 'next/link';
import { OverridableComponent } from '@mui/material/OverridableComponent';
import { Box, SvgIconTypeMap, Tooltip, Typography } from '@mui/material';

import getStatusDotLabel from 'features/events/utils/getStatusDotLabel';
import oldTheme from 'theme';
import ZUIIconLabel, { ZUIIconLabelProps } from 'zui/ZUIIconLabel';

export enum STATUS_COLORS {
  BLUE = 'blue',
  GREEN = 'green',
  GREY = 'grey',
  ORANGE = 'orange',
  RED = 'red',
}

export type AcitivityListItemProps = {
  PrimaryIcon: OverridableComponent<
    SvgIconTypeMap<Record<string, unknown>, 'svg'>
  >;
  SecondaryIcon: OverridableComponent<
    SvgIconTypeMap<Record<string, unknown>, 'svg'>
  >;
  color: STATUS_COLORS;
  endNumber: string | number;
  endNumberColor?: ZUIIconLabelProps['color'];
  href: string;
  meta?: JSX.Element;
  onEventItemClick?: (x: number, y: number) => void;
  subtitle?: JSX.Element;
  title: string;
};

const ActivityListItem = ({
  PrimaryIcon,
  SecondaryIcon,
  href,
  color,
  meta,
  onEventItemClick,
  subtitle,
  title,
  endNumber,
  endNumberColor = 'secondary',
}: AcitivityListItemProps) => {
  return (
    <NextLink href={href} passHref style={{ textDecoration: 'none' }}>
      <Box
        onClick={(evt) => {
          if (onEventItemClick) {
            evt.preventDefault();
            onEventItemClick(evt.clientX, evt.clientY);
          }
        }}
        sx={{
          alignItems: 'center',
          cursor: 'pointer',
          display: 'flex',
          justifyContent: 'space-between',
          padding: '1.0em 0.5em',
        }}
      >
        <Box
          sx={{
            alignItems: 'center',
            display: 'flex',
            flex: '1 0',
            gap: '1em',
          }}
        >
          <Tooltip title={getStatusDotLabel({ color })}>
            <Box
              sx={{
                backgroundColor: oldTheme.palette.statusColors[color],
                borderRadius: '100%',
                flexShrink: 0,
                height: '10px',
                marginLeft: '0.5em',
                marginRight: '0.5em',
                width: '10px',
              }}
            />
          </Tooltip>
          <PrimaryIcon
            sx={{
              color: oldTheme.palette.grey[500],
              fontSize: '28px',
            }}
          />
          <Box>
            <Typography color={oldTheme.palette.text.primary}>
              {title}
            </Typography>
            {subtitle && (
              <Box>
                <Typography variant="body2">{subtitle}</Typography>
              </Box>
            )}
          </Box>
        </Box>
        <Box
          sx={{
            width: '8em',
          }}
        >
          {meta}
        </Box>
        <Box>
          <Box
            sx={{
              alignItems: 'center',
              display: 'flex',
              justifyContent: 'flex-start',
              width: '7em',
            }}
          >
            <ZUIIconLabel
              color={endNumberColor}
              icon={<SecondaryIcon color={endNumberColor} />}
              label={endNumber.toString()}
            />
          </Box>
        </Box>
      </Box>
    </NextLink>
  );
};

export default ActivityListItem;
