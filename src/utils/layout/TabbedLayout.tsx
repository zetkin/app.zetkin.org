import makeStyles from '@mui/styles/makeStyles';
import { useRouter } from 'next/router';
import {
  Alert,
  Badge,
  Box,
  Button,
  Collapse,
  styled,
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
  alertBtnMsg?: string;
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
  tabs: {
    badge?: number;
    href: string;
    label: string;
    tabProps?: TabProps;
  }[];
  onClickAlertBtn?: () => void;
}

const TabbedLayout: FunctionComponent<TabbedLayoutProps> = ({
  actionButtons,
  alertBtnMsg,
  alertMsg,
  avatar,
  baseHref,
  belowActionButtons,
  children,
  defaultTab,
  ellipsisMenuItems,
  fixedHeight,
  noPad,
  onClickAlertBtn,
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

  const HorizontallyCenteredBadge = styled(Badge)(() => ({
    '& .MuiBadge-badge': {
      top: '50%',
      right: -15,
      transform: 'translateY(-50%)',
    },
  }));

  return (
    <DefaultLayout>
      {alertMsg && (
        <Alert
          action={
            alertBtnMsg && (
              <Button color="inherit" onClick={onClickAlertBtn} size="small">
                {alertBtnMsg}
              </Button>
            )
          }
          severity="info"
        >
          {alertMsg}
        </Alert>
      )}
      <Box
        display="flex"
        flexDirection="column"
        height={fixedHeight ? 1 : 'auto'}
        minHeight="100vh"
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
                  label={
                    !tab.badge ? (
                      tab.label
                    ) : (
                      <HorizontallyCenteredBadge
                        badgeContent={tab.badge}
                        color="primary"
                      >
                        <Box component="span" sx={{ mr: 1.5 }}>
                          {tab.label}
                        </Box>
                      </HorizontallyCenteredBadge>
                    )
                  }
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
