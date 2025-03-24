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
   * A list of items that contains data about each tab.
   */
  items: TabItem[];

  /**
   * Function that runs when user clicks a new tab.
   */
  onChange: (newValue: string) => void;

  /**
   * The value of the tab view.
   */
  value: string;
};

const ZUITabView: FC<ZUITabViewProps> = ({ items, onChange, value }) => {
  return (
    <TabContext value={value}>
      <TabList
        onChange={(ev, newValue) => onChange(newValue)}
        sx={(theme) => ({
          borderBottom: `0.063rem solid ${theme.palette.dividers.main}`,
          minHeight: '2.438rem',
        })}
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
