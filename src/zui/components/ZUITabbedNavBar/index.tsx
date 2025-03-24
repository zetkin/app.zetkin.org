import { Tab, Tabs } from '@mui/material';
import { FC } from 'react';

type LinkTabItem = { href: string; label: string };

type ZUITabbedNavBar = {
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
   * The function that runs when the user clicks a tab.
   */
  onSelectTab: (newTab: string) => void;

  /**
   * The value of the tabs list.
   */
  selectedTab: string;
};

const ZUITabbedNavBar: FC<ZUITabbedNavBar> = ({
  fullWidth = false,
  items,
  onSelectTab,
  selectedTab,
}) => {
  return (
    <Tabs
      onChange={(ev, newTab) => onSelectTab(newTab)}
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
          component="a"
          href={tab.href}
          label={tab.label}
          sx={{
            fontSize: '0.875rem',
            fontWeight: 500,
            minHeight: '2.438rem',
            minWidth: '1.5rem',
            paddingY: '0.563rem',
          }}
          value={tab.href}
        />
      ))}
    </Tabs>
  );
};

export default ZUITabbedNavBar;
