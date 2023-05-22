import NextLink from 'next/link';
import { useNumericRouteParams } from 'core/hooks';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useTheme } from '@mui/material/styles';
import {
  Architecture,
  Explore,
  Groups,
  KeyboardDoubleArrowLeft,
  KeyboardDoubleArrowRight,
  Map,
} from '@mui/icons-material/';
import {
  Avatar,
  Box,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
} from '@mui/material';

import makeStyles from '@mui/styles/makeStyles';
import messageIds from './l10n/messageIds';
import OrganizationsDataModel from 'features/organizations/models/OrganizationsDataModel';
import { useMessages } from 'core/i18n';
import useModel from 'core/useModel';
import ZUIFuture from './ZUIFuture';

const drawerWidth = 300;

const useStyles = makeStyles((theme) => ({
  drawer: {
    flexShrink: 0,
    transition: theme.transitions.create('width', {
      duration: theme.transitions.duration.enteringScreen,
      easing: theme.transitions.easing.sharp,
    }),
    whiteSpace: 'nowrap',
    width: drawerWidth,
  },
  drawerPaper: {
    display: 'none',
    [theme.breakpoints.up('sm')]: {
      display: 'block',
    },
    overflowX: 'hidden',
    transition: theme.transitions.create('width', {
      duration: theme.transitions.duration.enteringScreen,
      easing: theme.transitions.easing.sharp,
    }),
    width: drawerWidth,
  },
  toggleDrawerPaper: {
    [theme.breakpoints.up('sm')]: {
      width: `calc(${theme.spacing(8)} + 1px)`,
    },
    transition: theme.transitions.create('width', {
      duration: theme.transitions.duration.leavingScreen,
      easing: theme.transitions.easing.sharp,
    }),
    width: `calc(${theme.spacing(7)} + 1px)`,
  },
}));

const ZUIOrganizeSidebar = (): JSX.Element => {
  const [hover, setHover] = useState(false);
  const messages = useMessages(messageIds);
  const classes = useStyles();
  const theme = useTheme();

  const router = useRouter();
  const { orgId } = useNumericRouteParams();
  const key = orgId ? router.pathname.split('[orgId]')[1] : 'organize';

  const [open, setOpen] = useState(false);
  const toggleDrawer = () => {
    setOpen(!open);
  };

  const model: OrganizationsDataModel = useModel(
    (env) => new OrganizationsDataModel(env)
  );

  const menuItemsMap = [
    { icon: <Groups />, name: 'people' },
    { icon: <Architecture />, name: 'projects' },
    { icon: <Explore />, name: 'journeys' },
    { icon: <Map />, name: 'areas' },
  ] as const;

  return (
    <Box data-testid="organize-sidebar" sx={{ display: 'flex' }}>
      <Drawer
        classes={{
          paper:
            classes.drawerPaper +
            (!open ? ` ${classes.toggleDrawerPaper}` : ''),
        }}
        className={
          classes.drawer + (!open ? ` ${classes.toggleDrawerPaper}` : '')
        }
        onMouseLeave={() => {
          setHover(false);
        }}
        onMouseOver={() => {
          setHover(true);
        }}
        open={open}
        variant="permanent"
      >
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          {!open && hover && (
            <IconButton onClick={toggleDrawer}>
              <KeyboardDoubleArrowRight />
            </IconButton>
          )}
          {!open && !hover && (
            <NextLink href="/organize" passHref>
              <Avatar alt="icon" src={`/api/orgs/${orgId}/avatar`} />
            </NextLink>
          )}
        </Box>
        <Box>
          {open && (
            <ZUIFuture future={model.getOrganization(orgId)}>
              {(data) => {
                return (
                  <Box
                    sx={{
                      alignItems: 'center',
                      display: 'flex',
                      justifyContent: 'stretch',

                      marginLeft: 1,
                    }}
                  >
                    {hover ? (
                      <IconButton onClick={toggleDrawer}>
                        <KeyboardDoubleArrowLeft />
                      </IconButton>
                    ) : (
                      <Avatar alt="icon" src={`/api/orgs/${orgId}/avatar`} />
                    )}
                    <Typography ml={1} variant="h6">
                      {data.title}
                    </Typography>
                  </Box>
                );
              }}
            </ZUIFuture>
          )}
        </Box>
        <Divider />
        <Box>
          <List
            sx={{
              display: 'flex',
              flexFlow: 'column',
              justifyContent: 'center',
            }}
          >
            {menuItemsMap.map((item) => (
              <ListItem
                key={item.name}
                button
                sx={{
                  '&:hover': {
                    background: theme.palette.grey[100],
                    pointer: 'cursor',
                  },
                  backgroundColor: key.startsWith('/' + item.name)
                    ? theme.palette.grey[300]
                    : 'transparent',
                }}
              >
                <NextLink href={`/organize/${orgId}/${item.name}`} passHref>
                  <>
                    <ListItemIcon>{item.icon}</ListItemIcon>
                    {open && (
                      <ListItemText
                        primary={messages.organizeSidebar[item.name]()}
                        sx={{
                          color: key.startsWith('/' + item.name)
                            ? 'black'
                            : theme.palette.grey[500],
                          fontWeight: key.startsWith('/' + item.name)
                            ? 900
                            : 'normal',
                        }}
                      />
                    )}
                  </>
                </NextLink>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
    </Box>
  );
};

export default ZUIOrganizeSidebar;
