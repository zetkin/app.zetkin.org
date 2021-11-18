import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { AppBar, Box, Drawer, Hidden, IconButton, List, ListItem, Toolbar } from '@material-ui/core';
import { Event,  Home, Map, Menu, People } from '@material-ui/icons/';
import { makeStyles, useTheme } from '@material-ui/core/styles';

import ZetkinLogo from '../../icons/ZetkinLogo';

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
        height: '3rem',
        width: '3rem',
    },
    // necessary for content to be below app bar
    toolbar: theme.mixins.toolbar,
}));

const OrganizeSidebar = () : JSX.Element =>{
    const classes = useStyles();
    const theme = useTheme();
    const [mobileOpen, setMobileOpen] = useState(false);

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const router = useRouter();
    const { orgId } = router.query as {orgId: string};

    const key = orgId ? router.pathname.split('[orgId]')[1] : 'organize';

    const drawer = (
        <Box alignItems="center" display="flex" flexDirection="column" height="100%" justifyContent="space-between">
            <List disablePadding>
                <Box display="flex" flexDirection="column">
                    <ListItem disableGutters>
                        <NextLink href="/organize" passHref>
                            <IconButton aria-label="Home" className={ classes.roundButton } color={ key === 'organize' ?  'primary' : 'secondary' } data-test="logo-button" style={{ marginBottom:'2rem' }}>
                                <ZetkinLogo color="primary" size={ 40 } />
                            </IconButton>
                        </NextLink>
                    </ListItem>
                    <ListItem disableGutters>
                        <NextLink href={ `/organize/${orgId}` } passHref>
                            <IconButton aria-label="Home" className={ classes.roundButton } color={ key === '' ?  'primary' : 'secondary' } data-test="home-button">
                                <Home />
                            </IconButton>
                        </NextLink>
                    </ListItem>
                    <ListItem disableGutters>
                        <NextLink href={ `/organize/${orgId}/people/views` } passHref>
                            <IconButton aria-label="People" className={ classes.roundButton } color={ key.startsWith('/people') ?  'primary' : 'secondary' } data-test="people-button">
                                <People />
                            </IconButton>
                        </NextLink>
                    </ListItem>
                    <ListItem disableGutters>
                        <NextLink href={ `/organize/${orgId}/areas` } passHref>
                            <IconButton aria-label="Areas" className={ classes.roundButton } color={ key.startsWith('/areas') ?  'primary' : 'secondary' } data-test="area-button">
                                <Map />
                            </IconButton>
                        </NextLink>
                    </ListItem>
                    <ListItem disableGutters>
                        <NextLink href={ `/organize/${orgId}/campaigns` } passHref>
                            <IconButton aria-label="Campaigns" className={ classes.roundButton } color={ key.startsWith('/campaigns') ?  'primary' : 'secondary' } data-test="calendar-button">
                                <Event />
                            </IconButton>
                        </NextLink>
                    </ListItem>
                </Box>
            </List>
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
