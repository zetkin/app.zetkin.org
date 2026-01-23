import { ArrowUpward } from '@mui/icons-material';
import { ReactElement } from 'react';
import { Avatar, Box, Button, Collapse, Typography } from '@mui/material';

import BreadcrumbTrail from 'features/breadcrumbs/components/BreadcrumbTrail';
import { Msg } from 'core/i18n';
import ZUIEllipsisMenu, { ZUIEllipsisMenuProps } from 'zui/ZUIEllipsisMenu';
import messageIds from './l10n/messageIds';
import oldTheme from 'theme';

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
              <Box
                sx={{
                  '& svg': {
                    transform: collapsed ? 'rotate(180deg)' : 'none',
                    transition: 'transform 0.2s ease',
                  },
                  gridColumnEnd: 'none',
                }}
              >
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
          <Box
            mt={2}
            sx={{
              alignItems: 'center',
              display: 'grid',
              gap: '1rem',
              gridTemplateColumns: '1fr auto',
              gridTemplateRows: 'auto',
              transition: 'font-size 0.2s ease',
              width: '100%',
              [oldTheme.breakpoints.down('md')]: {
                gridTemplateColumns: '1fr',
              },
            }}
          >
            <Box
              alignItems="center"
              display="flex"
              flexDirection="row"
              overflow="hidden"
            >
              {avatar && (
                <Avatar
                  src={avatar}
                  sx={{
                    aspectRatio: 1,
                    height: '65px',
                    marginRight: '20px',
                    width: 'auto',
                  }}
                />
              )}
              <Box
                sx={{
                  maxWidth: '100%',
                }}
              >
                <Typography
                  component="h1"
                  data-testid="page-title"
                  noWrap
                  sx={{
                    marginBottom: '8px',
                    transition: 'margin 0.3s ease',
                  }}
                  variant="h3"
                >
                  {title}
                </Typography>
                <Typography color="secondary" component="div" variant="h5">
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
