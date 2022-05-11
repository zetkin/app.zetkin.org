import { ArrowUpward } from '@material-ui/icons';
import BreadcrumbTrail from 'components/BreadcrumbTrail';
import { FormattedMessage } from 'react-intl';
import { ReactElement } from 'react';
import {
  Avatar,
  Box,
  Button,
  Collapse,
  makeStyles,
  Theme,
  Typography,
} from '@material-ui/core';

import SearchDialog from 'components/organize/SearchDialog';
import ZetkinEllipsisMenu, {
  ZetkinEllipsisMenuProps,
} from 'components/ZetkinEllipsisMenu';

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
    transition: 'all 0.3s ease',
  },
  titleGrid: {
    alignItems: 'center',
    display: 'grid',
    gap: '1rem',
    gridTemplateColumns: '1fr auto',
    gridTemplateRows: 'auto',
    transition: 'font-size 0.2s ease',
    width: '100%',
    [theme.breakpoints.down('sm')]: {
      gridTemplateColumns: '1fr',
    },
  },
}));

interface HeaderProps {
  actionButtons?: React.ReactElement | React.ReactElement[];
  avatar?: string;
  collapsed?: boolean;
  ellipsisMenuItems?: ZetkinEllipsisMenuProps['items'];
  onToggleCollapsed?: (collapsed: boolean) => void;
  subtitle?: string | ReactElement;
  title?: string | ReactElement;
}

const Header: React.FC<HeaderProps> = ({
  actionButtons,
  avatar,
  collapsed = false,
  ellipsisMenuItems,
  onToggleCollapsed,
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
                <Button onClick={toggleCollapsed} startIcon={<ArrowUpward />}>
                  <FormattedMessage
                    id={`layout.organize.header.collapseButton.${
                      collapsed ? 'expand' : 'collapse'
                    }`}
                  />
                </Button>
              </Box>
            )}
            <SearchDialog />
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
            <Box display="flex" flexDirection="row">
              <Box>{actionButtons}</Box>
              {!!ellipsisMenuItems?.length && (
                <ZetkinEllipsisMenu items={ellipsisMenuItems} />
              )}
            </Box>
          </Box>
        </Collapse>
      </Box>
    </Box>
  );
};

export default Header;
