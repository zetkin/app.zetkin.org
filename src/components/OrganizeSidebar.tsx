import grey from '@material-ui/core/colors/grey';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { AppBar, Box, Button, Drawer, Hidden, IconButton, List, ListItem, Toolbar } from '@material-ui/core';
import { Event,  Home, Inbox, Map, Menu, People, Person } from '@material-ui/icons/';
import { makeStyles, useTheme } from '@material-ui/core/styles';

interface OrganizeSidebarProps {
    orgId: string;
}

const drawerWidth = '5rem';

const useStyles = makeStyles((theme) => ({
    appBar: {
        [theme.breakpoints.up('sm')]: {
            display: 'none',
        },
    },
    content: {
        flexGrow: 1,
        padding: theme.spacing(3),
    },
    drawer: {
        [theme.breakpoints.up('sm')]: {
            flexShrink: 0,
            width: drawerWidth,
        },
    },
    drawerPaper: {
        width: drawerWidth,
    },
    menuButton: {
        marginRight: theme.spacing(2),
        [theme.breakpoints.up('sm')]: {
            display: 'none',
        },

    },
    root: {
        display: 'flex',
    },
    roundButton: {
        background: 'white',
        borderRadius: '50%',
        height: '4rem',
    },
    // necessary for content to be below app bar
    toolbar: theme.mixins.toolbar,
}));

const OrganizeSidebar = ({ orgId  } : OrganizeSidebarProps) : JSX.Element =>{
    const classes = useStyles();
    const theme = useTheme();
    const [mobileOpen, setMobileOpen] = useState(false);

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const router = useRouter();
    const key = router.pathname.split('[orgId]')[1];

    const drawer = (
        <Box alignItems="center" bgcolor={ grey[100] } display="flex" flexDirection="column" height="100%" justifyContent="space-between">
            <List>
                <Box display="flex" flexDirection="column">
                    <ListItem>
                        <NextLink href={ `/organize/${orgId}` } passHref>
                            <Button aria-label="Home" className={ classes.roundButton } color={ key === '' ?  'primary' : 'secondary' } data-test="home-button">
                                <Home />
                            </Button>
                        </NextLink>
                    </ListItem>
                    <ListItem>
                        <NextLink href={ `/organize/${orgId}/people` } passHref>
                            <Button aria-label="People" className={ classes.roundButton } color={ key.startsWith('/people') ?  'primary' : 'secondary' } data-test="people-button">
                                <People />
                            </Button>
                        </NextLink>
                    </ListItem>
                    <ListItem>
                        <NextLink href={ `/organize/${orgId}/areas` } passHref>
                            <Button aria-label="Areas" className={ classes.roundButton } color={ key.startsWith('/areas') ?  'primary' : 'secondary' } data-test="area-button">
                                <Map />
                            </Button>
                        </NextLink>
                    </ListItem>
                    <ListItem>
                        <NextLink href={ `/organize/${orgId}/campaigns/calendar` } passHref>
                            <Button aria-label="Campaigns" className={ classes.roundButton } color={ key.startsWith('/campaigns') ?  'primary' : 'secondary' } data-test="calendar-button">
                                <Event />
                            </Button>
                        </NextLink>
                    </ListItem>
                </Box>
            </List>
            <Box display="flex" flexDirection="column">
                <List>
                    <ListItem>
                        <Button aria-label="Inbox" className={ classes.roundButton } color="secondary" data-test="inbox-button">
                            <Inbox />
                        </Button>
                    </ListItem>
                    <ListItem>
                        <Button aria-label="Organize" className={ classes.roundButton } color="secondary" data-test="user-button">
                            <Person />
                        </Button>
                    </ListItem>
                </List>
            </Box>
        </Box>
    );

    return (
        <div className={ classes.root }>
            <AppBar className={ classes.appBar } position="fixed">
                <Toolbar>
                    <IconButton
                        aria-label="open drawer"
                        className={ classes.menuButton }
                        color="inherit"
                        edge="start"
                        onClick={ handleDrawerToggle }>
                        <Menu data-test="menu-button"/>
                    </IconButton>
                </Toolbar>
            </AppBar>
            <nav aria-label="mailbox folders" className={ classes.drawer }>
                <Hidden implementation="css" smUp>
                    <Drawer
                        anchor={ theme.direction === 'rtl' ? 'right' : 'left' }
                        classes={{
                            paper: classes.drawerPaper,
                        }}
                        ModalProps={{
                            keepMounted: true, // Better open performance on mobile.
                        }}
                        onClose={ handleDrawerToggle }
                        open={ mobileOpen }
                        variant="temporary">
                        { drawer }
                    </Drawer>
                </Hidden>
                <Hidden implementation="css" xsDown>
                    <Drawer
                        classes={{
                            paper: classes.drawerPaper,
                        }}
                        open
                        variant="permanent">
                        { drawer }
                    </Drawer>
                </Hidden>
            </nav>
        </div>
    );
};

export default OrganizeSidebar;
