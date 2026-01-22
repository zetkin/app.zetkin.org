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
} from '@mui/material';
import { FunctionComponent, ReactElement, useState } from 'react';

import DefaultLayout from './DefaultLayout';
import Header from '../../zui/ZUIHeader';
import { PaneProvider } from 'utils/panes';
import { ZUIEllipsisMenuProps } from 'zui/ZUIEllipsisMenu';

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
      right: -15,
      top: '50%',
      transform: 'translateY(-50%)',
    },
  }));

  return (
    <DefaultLayout title={title}>
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
        flexGrow="1"
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
            slotProps={{
              list: {
                sx: {
                  overflowX: 'auto',
                },
              },
            }}
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
          component="main"
          flexGrow={1}
          minHeight={0}
          p={fixedHeight ? 0 : 3}
          position="relative"
          role="tabpanel"
          sx={{
            overflow: 'hidden',
            padding: noPad ? 0 : undefined,
          }}
        >
          <PaneProvider fixedHeight={!!fixedHeight}>{children}</PaneProvider>
        </Box>
      </Box>
    </DefaultLayout>
  );
};

export default TabbedLayout;
