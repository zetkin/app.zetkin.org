import { Box, Tab, Tabs } from '@mui/material';
import NextLink from 'next/link';
import { FC } from 'react';

import { ZUIBadgeProps } from '../ZUIBadge';
import { getContrastColor } from 'utils/colorUtils';
import { MUIIcon } from '../types';

type LinkTabItem = {
  /**
   * Send in properties that will render a badge on the tab.
   */
  badge?: Omit<ZUIBadgeProps, 'children'>;

  /**
   * The href the tab routes to.
   */
  href: string;

  /**
   * An icon in front of the tab label. Only shown if badge is not enabled
   */
  icon?: MUIIcon;

  /**
   * The label of the tab.
   */
  label: string;

  /**
   * The value of the tab
   */
  value: string;
};

export type ZUITabbedNavBarProps = {
  /**
   * If true, the tabs will take up all available horizontal space.
   *
   * Defaults to "false".
   */
  fullWidth?: boolean;

  /**
   * List of the items that will render as tabs.
   */
  items: LinkTabItem[];

  /**
   * The value of the tabs list.
   */
  selectedTab: string;
};

export const TabBadge: FC<Omit<ZUIBadgeProps, 'children'>> = ({
  color,
  number,
  truncateLargeNumber = false,
}) => {
  const colorName = color == 'danger' ? 'error' : color;
  const hasNumber = typeof number == 'number';

  const truncateLowNumber = hasNumber && truncateLargeNumber && number > 99;
  const truncateExtremeNumber =
    hasNumber && !truncateLargeNumber && number > 999999;

  let label = number?.toString();
  if (truncateLowNumber) {
    label = '99+';
  } else if (truncateExtremeNumber) {
    label = '999999+';
  }

  return (
    <Box
      sx={(theme) => ({
        alignItems: 'center',
        backgroundColor: theme.palette[colorName].main,
        borderRadius: '2rem',
        color: getContrastColor(theme.palette[colorName].main),
        display: 'flex',
        fontSize: '0.813rem',
        fontWeight: 500,
        height: hasNumber ? '1.125rem' : '0.625rem',
        justifyContent: 'center',
        marginLeft: '0.5rem',
        padding: hasNumber ? '0.188rem 0.438rem 0.188rem 0.438rem' : undefined,
        width: hasNumber ? undefined : '0.625rem',
      })}
    >
      {label}
    </Box>
  );
};

const ZUITabbedNavBar: FC<ZUITabbedNavBarProps> = ({
  fullWidth = false,
  items,
  selectedTab,
}) => {
  return (
    <Tabs
      role="navigation"
      sx={(theme) => ({
        borderBottom: `0.063rem solid ${theme.palette.dividers.main}`,
        minHeight: '2.438rem',
      })}
      value={selectedTab}
      variant={fullWidth ? 'fullWidth' : 'standard'}
    >
      {items.map((tab) => (
        <Tab
          key={`navTab-${tab.href}`}
          component={NextLink}
          href={tab.href}
          icon={
            tab.badge ? (
              <TabBadge
                color={tab.badge.color}
                number={tab.badge.number}
                truncateLargeNumber={tab.badge.truncateLargeNumber}
              />
            ) : tab.icon ? (
              <tab.icon sx={{ fontSize: '1rem' }} />
            ) : (
              ''
            )
          }
          iconPosition={tab.badge ? 'end' : 'start'}
          label={tab.label}
          sx={{
            fontSize: '0.875rem',
            fontWeight: 500,
            minHeight: '2.438rem',
            minWidth: '1.5rem',
            paddingY: '0.563rem',
          }}
          value={tab.value}
        />
      ))}
    </Tabs>
  );
};

export default ZUITabbedNavBar;
