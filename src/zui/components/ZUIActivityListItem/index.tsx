import { FC, MouseEvent as ReactMouseEvent } from 'react';
import NextLink from 'next/link';
import { Box, Checkbox, ListItem, Typography } from '@mui/material';

import { ActivityStatus } from 'zui/types';
import { MUIIcon } from '../types';
import ZUIActivityStatusBadge from '../ZUIActivityStatusBadge';
import ZUIIcon from '../ZUIIcon';
import ZUIProgressChip, { ZUIProgressChipProps } from '../ZUIProgressChip';
import ZUIBarDiagram, { ZUIBarDiagramProps } from '../ZUIBarDiagram';
import EventWarningIcons, { EventWarningIconsProps } from './EventWarningIcons';
import ZUIAvatarGroup, { AvatarData } from '../ZUIAvatarGroup';
import ZUISuffixedNumber from '../ZUISuffixedNumber';
import { ZUICheckboxProps } from '../ZUICheckbox';

type ActivityListItemBase = {
  /**
   * If the list item should render avatars, send them in here.
   */
  avatars?: AvatarData[];

  /**
   * If you want the list item to have a checkbox,
   * send in its props here.
   */
  checkboxProps?: Pick<ZUICheckboxProps, 'checked' | 'onChange'>;

  /**
   * The icon and number that is displayed at the end of the list item.
   */
  endData: {
    icon: MUIIcon;
    number: number;
  };

  /**
   * The href of the activity.
   */
  href: string;

  /**
   * The main icon of the list item.
   */
  mainIcon: MUIIcon;

  /**
   * The onClick function for the list item.
   */
  onClick?: (event: ReactMouseEvent<HTMLDivElement, MouseEvent>) => void;

  /**
   * The status of the activity.
   */
  status: ActivityStatus;

  /**
   * The subtitle of the list item.
   */
  subtitle: string;

  /**
   * The title of the list item.
   */
  title: string;

  /**
   * The variant of the list item: "default", "narrow" or "wide".
   *
   * Defaults, unsurprisingly, to "default".
   */
  variant?: 'default' | 'narrow' | 'wide';
};

type ValuesMeta = Pick<ZUIProgressChipProps, 'values'>;
type EventWarningIconsMeta = {
  eventWarningIcons: EventWarningIconsProps;
};
type Meta = ValuesMeta | EventWarningIconsMeta;

export type ZUIActivityListItemProps = ActivityListItemBase & {
  meta: Meta;
};

const isValuesMeta = (meta: Meta): meta is ValuesMeta => {
  return 'values' in meta;
};

const isEventWarningIconsMeta = (meta: Meta): meta is EventWarningIconsMeta => {
  return 'eventWarningIcons' in meta;
};

const ZUIActivityListItem: FC<ZUIActivityListItemProps> = ({
  avatars,
  checkboxProps,
  endData,
  href,
  mainIcon,
  meta,
  onClick,
  status,
  subtitle,
  title,
  variant = 'default',
}) => {
  const showProgressChip = variant != 'narrow' && isValuesMeta(meta);
  const showBarDiagram = variant == 'narrow' && isValuesMeta(meta);
  const hasEventWarningIcons = isEventWarningIconsMeta(meta);
  const showAvatars = avatars && variant != 'narrow';

  const makeBarDiagramValues = (values: ValuesMeta['values']) => {
    const sum = values.reduce((prev, curr) => (prev += curr));
    const percent = values.map((value) => Math.round((value / sum) * 100));
    return percent.slice(0, -1) as unknown as ZUIBarDiagramProps['values'];
  };

  return (
    <ListItem
      divider
      sx={(theme) => ({
        '& a:focus-visible': {
          color: theme.palette.text.primary,
        },
        alignItems: 'center',
        cursor: 'pointer',
        display: 'flex',
        paddingLeft: checkboxProps ? '0.625rem' : '1.25rem',
        paddingRight: '1.25rem',
        paddingY: variant == 'wide' ? '0.875rem' : '1rem',
        width: '100%',
      })}
    >
      {checkboxProps && (
        <Checkbox
          checked={checkboxProps.checked}
          onChange={(ev, newCheckedState) =>
            checkboxProps.onChange(newCheckedState)
          }
          sx={{
            '& .MuiSvgIcon-root': { fontSize: '1.25rem' },
            marginRight: '0.5rem',
          }}
        />
      )}
      <NextLink
        href={href}
        passHref
        style={{
          flexGrow: 1,
          minWidth: 0,
          textDecoration: 'none',
        }}
      >
        <Box
          onClick={(ev) => {
            if (onClick) {
              onClick(ev);
            }
          }}
          sx={{
            alignItems: 'center',
            display: 'flex',
            flexGrow: 1,
            justifyContent: 'space-between',
            minWidth: 0,
          }}
        >
          <Box
            sx={{
              alignItems: 'center',
              display: 'flex',
              flexGrow: variant == 'narrow' ? 1 : '',
              width: variant == 'narrow' ? '' : '50%',
            }}
          >
            <Box
              sx={{
                alignItems: 'center',
                display: 'flex',
                flexDirection: variant == 'wide' ? 'row-reverse' : 'column',
                gap: variant == 'wide' ? '0.625rem' : '0.438rem',
                paddingRight: '1.25rem',
              }}
            >
              <ZUIIcon icon={mainIcon} />
              <ZUIActivityStatusBadge status={status} />
            </Box>
            <Box
              sx={{
                alignItems: 'baseline',
                display: 'flex',
                flexDirection: variant == 'wide' ? 'row' : 'column',
                flexGrow: 1,
                minWidth: 0,
                paddingRight: '0.5rem',
              }}
            >
              <Typography
                color="primary"
                sx={{
                  flexGrow: 1,
                  maxWidth: variant == 'wide' ? 'fit-content' : '100%',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
                variant="bodyMdRegular"
              >
                {title}
              </Typography>
              <Typography
                color="secondary"
                sx={{
                  flexGrow: 1,
                  maxWidth: '100%',
                  overflow: 'hidden',
                  paddingLeft: variant == 'wide' ? '0.5rem' : '',
                  paddingTop: variant != 'wide' ? '0.2rem' : '',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
                variant="bodySmRegular"
              >
                {subtitle}
              </Typography>
            </Box>
          </Box>
          <Box
            sx={{
              alignItems: 'center',
              display: 'flex',
              flexGrow: variant == 'narrow' ? 0 : 1,
              justifyContent:
                variant == 'narrow' || !showProgressChip
                  ? 'flex-end'
                  : 'space-between',
            }}
          >
            <Box
              sx={{
                alignItems: variant == 'narrow' ? 'flex-end' : '',
                display: 'flex',
                flexDirection: variant == 'narrow' ? 'column-reverse' : 'row',
                flexGrow: 1,
                justifyContent: 'space-between',
              }}
            >
              {showBarDiagram && (
                <Box sx={{ paddingTop: '0.25rem', width: '5.25rem' }}>
                  <ZUIBarDiagram
                    size="small"
                    values={makeBarDiagramValues(meta.values)}
                  />
                </Box>
              )}
              <Box sx={{ alignItems: 'center', display: 'flex' }}>
                {showProgressChip && <ZUIProgressChip values={meta.values} />}
                {hasEventWarningIcons && (
                  <Box sx={{ paddingTop: '0.25rem' }}>
                    <EventWarningIcons
                      hasContact={meta.eventWarningIcons.hasContact}
                      isUrgent={meta.eventWarningIcons.isUrgent}
                      numBooked={meta.eventWarningIcons.numBooked}
                      numRemindersSent={meta.eventWarningIcons.numRemindersSent}
                      numSignups={meta.eventWarningIcons.numSignups}
                    />
                  </Box>
                )}
              </Box>
              <Box
                sx={{
                  alignItems: 'center',
                  display: 'flex',
                  gap: '1rem',
                }}
              >
                {showAvatars && (
                  <ZUIAvatarGroup avatars={avatars} max={5} size="small" />
                )}
                <Box
                  sx={{
                    alignItems: 'center',
                    display: 'flex',
                    gap: '0.5rem',
                    justifyContent: 'flex-end',
                    width: variant == 'narrow' ? 'fit-content' : '5rem',
                  }}
                >
                  <Typography color="secondary" variant="bodyMdRegular">
                    <ZUISuffixedNumber number={endData.number} />
                  </Typography>
                  <ZUIIcon color="secondary" icon={endData.icon} size="small" />
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      </NextLink>
    </ListItem>
  );
};

export default ZUIActivityListItem;
