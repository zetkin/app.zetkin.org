import { ArrowUpward } from '@mui/icons-material';
import makeStyles from '@mui/styles/makeStyles';
import { ReactElement } from 'react';
import {
  Avatar,
  Box,
  Button,
  Collapse,
  Theme,
  Typography,
} from '@mui/material';

import BreadcrumbTrail from 'features/breadcrumbs/components/BreadcrumbTrail';
import { Msg } from 'core/i18n';
import ZUIEllipsisMenu, { ZUIEllipsisMenuProps } from 'zui/ZUIEllipsisMenu';

import messageIds from './l10n/messageIds';

interface StyleProps {
  collapsed: boolean;
}

const useStyles = makeStyles<Theme, StyleProps>((theme) => ({
  avatar: {
    height: 65,
    marginRight: 20,
    width: 'auto',
  },
  collapseButton: {
    '& svg': {
      transform: ({ collapsed }) => (collapsed ? 'rotate(180deg)' : 'none'),
      transition: 'transform 0.2s ease',
    },
    gridColumnEnd: 'none',
  },
  title: {
    marginBottom: '8px',
    transition: 'margin 0.3s ease',
  },
  titleGrid: {
    alignItems: 'center',
    display: 'grid',
    gap: '1rem',
    gridTemplateColumns: '1fr auto',
    gridTemplateRows: 'auto',
    transition: 'font-size 0.2s ease',
    width: '100%',
    [theme.breakpoints.down('md')]: {
      gridTemplateColumns: '1fr',
    },
  },
}));

interface HeaderProps {
  actionButtons?: ReactElement | ReactElement[];
  avatar?: string;
  collapsed?: boolean;
  ellipsisMenuItems?: ZUIEllipsisMenuProps['items'];
  onToggleCollapsed?: (collapsed: boolean) => void;
  belowActionButtons?: ReactElement;
  subtitle?: string | ReactElement;
  title?: string | ReactElement;
}

const Header: React.FC<HeaderProps> = ({
  actionButtons,
  avatar,
  collapsed = false,
  ellipsisMenuItems,
  onToggleCollapsed,
  belowActionButtons,
  subtitle,
  title,
}) => {
  const classes = useStyles({ collapsed });

  const toggleCollapsed = () => {
    if (onToggleCollapsed) {
      onToggleCollapsed(!collapsed);
    }
  };

  return (
    <Box component="header" flexGrow={0} flexShrink={0}>
      <Box mb={collapsed ? 1 : 2} pt={3} px={3}>
        <Box display="flex" flexDirection="row" justifyContent="space-between">
          <BreadcrumbTrail highlight={collapsed} />
          {/* Search and collapse buttons */}
          <Box display="flex" flexDirection="row">
            {!!onToggleCollapsed && (
              <Box className={classes.collapseButton}>
                <Button
                  color="inherit"
                  onClick={toggleCollapsed}
                  startIcon={<ArrowUpward />}
                >
                  <Msg
                    id={
                      messageIds.header.collapseButton[
                        collapsed ? 'expand' : 'collapse'
                      ]
                    }
                  />
                </Button>
              </Box>
            )}
          </Box>
        </Box>
        {/* Title, subtitle, and action buttons */}
        <Collapse in={!collapsed}>
          <Box className={classes.titleGrid} mt={2}>
            <Box
              alignItems="center"
              display="flex"
              flexDirection="row"
              overflow="hidden"
            >
              {avatar && <Avatar className={classes.avatar} src={avatar} />}
              <Box>
                <Typography
                  className={classes.title}
                  component="div"
                  data-testid="page-title"
                  noWrap
                  style={{ display: 'flex' }}
                  variant="h3"
                >
                  {title}
                </Typography>
                <Typography color="secondary" component="h2" variant="h5">
                  {subtitle}
                </Typography>
              </Box>
            </Box>
            <Box
              display="flex"
              flexDirection="column"
              height="100%"
              justifyContent="space-between"
            >
              <Box alignSelf="flex-end" display="flex" paddingTop={3}>
                <Box>{actionButtons}</Box>
                {!!ellipsisMenuItems?.length && (
                  <ZUIEllipsisMenu items={ellipsisMenuItems} />
                )}
              </Box>
              {belowActionButtons && (
                <Box paddingBottom={0.55}>{belowActionButtons}</Box>
              )}
            </Box>
          </Box>
        </Collapse>
      </Box>
    </Box>
  );
};

export default Header;
