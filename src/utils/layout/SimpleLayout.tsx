import makeStyles from '@mui/styles/makeStyles';
import { Box, Theme } from '@mui/material';
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

interface SimpleLayoutProps {
  actionButtons?: React.ReactElement | React.ReactElement[];
  avatar?: string;
  belowActionButtons?: ReactElement;
  children?: React.ReactNode;
  ellipsisMenuItems?: ZUIEllipsisMenuProps['items'];
  fixedHeight?: boolean;
  title?: string | ReactElement;
  subtitle?: string | ReactElement;
  noPad?: boolean;
}

const SimpleLayout: FunctionComponent<SimpleLayoutProps> = ({
  actionButtons,
  avatar,
  belowActionButtons,
  children,
  ellipsisMenuItems,
  fixedHeight,
  noPad,
  subtitle,
  title,
}) => {
  const [collapsed, setCollapsed] = useState(false);
  const classes = useStyles({ noPad });

  const onToggleCollapsed = fixedHeight
    ? (value: boolean) => setCollapsed(value)
    : undefined;

  return (
    <DefaultLayout>
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
        {/* Page Content */}
        <Box
          className={classes.main}
          component="main"
          flexGrow={1}
          minHeight={0}
          p={fixedHeight ? 0 : 3}
          position="relative"
        >
          <PaneProvider fixedHeight={!!fixedHeight}>{children}</PaneProvider>
        </Box>
      </Box>
    </DefaultLayout>
  );
};

export default SimpleLayout;
