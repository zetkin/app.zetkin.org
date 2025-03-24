import { TabContext, TabList, TabPanel } from '@mui/lab';
import { Tab } from '@mui/material';
import { FC } from 'react';

type TabItem = {
  /**
   * The label of the tab
   */
  label: string;

  /**
   * A function that returns the content to render in the tab
   */
  render: () => JSX.Element;

  /**
   * The value of the tab
   */
  value: string;
};

type ZUITabViewProps = {
  /**
   * If true, the tabs take up all the available horizontal space.
   *
   * Defaults to "false".
   */
  fullWidth?: boolean;

  /**
   * A list of items that contains data about each tab.
   */
  items: TabItem[];

  /**
   * Function that runs when user clicks a new tab.
   */
  onSelectTab: (newTab: string) => void;

  /**
   * The value of the tab view.
   */
  selectedTab: string;
};

const ZUITabView: FC<ZUITabViewProps> = ({
  fullWidth = false,
  items,
  onSelectTab,
  selectedTab,
}) => {
  return (
    <TabContext value={selectedTab}>
      <TabList
        onChange={(ev, newTab) => onSelectTab(newTab)}
        sx={(theme) => ({
          borderBottom: `0.063rem solid ${theme.palette.dividers.main}`,
          minHeight: '2.438rem',
        })}
        variant={fullWidth ? 'fullWidth' : 'standard'}
      >
        {items.map((tab) => (
          <Tab
            key={`tab-${tab.value}`}
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
      </TabList>
      {items.map((tab) => (
        <TabPanel key={`tabPanel-${tab.value}`} value={tab.value}>
          {tab.render()}
        </TabPanel>
      ))}
    </TabContext>
  );
};

export default ZUITabView;
