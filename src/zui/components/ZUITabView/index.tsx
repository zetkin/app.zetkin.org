//import { TabContext, TabList, TabPanel } from '@mui/lab';
import { Tab } from '@mui/material';
import { FC } from 'react';

type TabItem = {
  /**
   * The content to render in the tab
   */
  content: JSX.Element;

  /**
   * The label of the tab
   */
  label: string;

  /**
   * The value of the tab
   */
  value: string;
};

type ZUITabViewProps = {
  /**
   * Function that runs when user clicks a new tab.
   */
  onChange: (newValue: string) => void;

  items: TabItem[];

  /**
   * The value of the tab view.
   */
  value: string;
};

const ZUITabView: FC<ZUITabViewProps> = ({ items, onChange, value }) => {
  return <h1>HEJ</h1>;

  return (
    <TabContext value={value}>
      <TabList onChange={(ev, newValue) => onChange(newValue)}>
        <Tab label="hallå" value="goddag" />
        <Tab label="katt" value="mjao" />
      </TabList>
      <TabPanel value="goddag">hallå</TabPanel>
      <TabPanel value="mjao">katt</TabPanel>
    </TabContext>
  );
};

export default ZUITabView;
