import makeStyles from '@mui/styles/makeStyles';
import { useRouter } from 'next/router';
import {
  Alert,
  Box,
  Collapse,
  Tab,
  TabProps,
  Tabs,
  Theme,
} from '@mui/material';
import { FunctionComponent, ReactElement, useState } from 'react';

import DefaultLayout from './DefaultLayout';
import Header from '../../zui/ZUIHeader';
import { PaneProvider } from 'utils/panes';
import { ZUIEllipsisMenuProps } from 'zui/ZUIEllipsisMenu';

interface StyleProps {
  noPad?: boolean;
}

const useStyles = makeStyles<Theme, StyleProps>(() => ({
  main: {
    overflowX: 'hidden',
    padding: ({ noPad }) => (noPad ? 0 : undefined),
  },
}));

interface TabbedLayoutProps {
  actionButtons?: React.ReactElement | React.ReactElement[];
  alertMsg?: React.ReactElement;
  avatar?: string;
  baseHref: string;
  belowActionButtons?: ReactElement;
  children?: React.ReactNode;
  ellipsisMenuItems?: ZUIEllipsisMenuProps['items'];
  fixedHeight?: boolean;
  title?: string | ReactElement;
  subtitle?: string | ReactElement;
  defaultTab: string;
  noPad?: boolean;
  tabs: { href: string; label: string; tabProps?: TabProps }[];
}

const TabbedLayout: FunctionComponent<TabbedLayoutProps> = ({
  actionButtons,
  alertMsg,
  avatar,
  baseHref,
  belowActionButtons,
  children,
  defaultTab,
  ellipsisMenuItems,
  fixedHeight,
  noPad,
  subtitle,
  tabs,
  title,
}) => {
  const [collapsed, setCollapsed] = useState(false);
  const classes = useStyles({ noPad });
  const router = useRouter();

  const currentTab =
    router.asPath.split('?')[0] === baseHref
      ? defaultTab
      : `/${router.pathname.split('/').pop()}`;

  const selectTab = (selected: string): void => {
    const href = tabs.find((tab) => tab.href === selected)?.href;
    if (href) {
      if (href !== currentTab) {
        router.push(baseHref + href);
      }
    } else if (process.env.NODE_ENV === 'development') {
      throw new Error(`Tab with label ${selected} wasn't found`);
    }
  };

  const onToggleCollapsed = fixedHeight
    ? (value: boolean) => setCollapsed(value)
    : undefined;

  return (
    <DefaultLayout>
      {alertMsg && <Alert severity="info">{alertMsg}</Alert>}
      <Box
        display={fixedHeight ? 'flex' : 'block'}
        flexDirection="column"
        height={fixedHeight ? 1 : 'auto'}
      >
        <Header
          actionButtons={actionButtons}
          avatar={avatar}
          belowActionButtons={belowActionButtons}
          collapsed={collapsed}
          ellipsisMenuItems={ellipsisMenuItems}
          onToggleCollapsed={onToggleCollapsed}
          subtitle={subtitle}
          title={title}
        />
        <Collapse in={!collapsed} sx={{ flexShrink: 0 }}>
          <Tabs
            aria-label="campaign tabs"
            onChange={(_, selected) => selectTab(selected)}
            value={currentTab}
          >
            {tabs.map((tab) => {
              return (
                <Tab
                  {...tab.tabProps}
                  key={tab.href}
                  label={tab.label}
                  sx={{
                    paddingX: 3,
                  }}
                  value={tab.href}
                />
              );
            })}
          </Tabs>
        </Collapse>
        {/* Page Content */}
        <Box
          className={classes.main}
          component="main"
          flexGrow={1}
          minHeight={0}
          p={fixedHeight ? 0 : 3}
          position="relative"
          role="tabpanel"
        >
          <PaneProvider fixedHeight={!!fixedHeight}>{children}</PaneProvider>
        </Box>
      </Box>
    </DefaultLayout>
  );
};

export default TabbedLayout;
