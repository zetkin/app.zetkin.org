import { FunctionComponent } from 'react';
import { useIntl } from 'react-intl';
import { useRouter } from 'next/router';
import { Box, makeStyles, Tab, Tabs, Typography } from '@material-ui/core';

import BreadcrumbTrail from '../../BreadcrumbTrail';
import OrganizeSidebar from '../../OrganizeSidebar';
import SearchDrawer from '../../SearchDrawer';

const useStyles = makeStyles((theme) => ({
    breadcrumbs: {
        [theme.breakpoints.down('xs')]: {
            width: '100%',
        },
    },
    root: {
        [theme.breakpoints.down('xs')]: {
            paddingTop: '4rem',
        },
    },
}));

interface TabbedLayoutProps {
    fixedHeight?: boolean;
    title?: string;
    subtitle?: string;
    baseHref: string;
    tabs: { defaultTab?:boolean; href: string; label: string}[];
}

const TabbedLayout: FunctionComponent<TabbedLayoutProps> = ({ children, fixedHeight, title, subtitle, tabs, baseHref }) => {
    const intl = useIntl();
    const classes = useStyles();
    const router = useRouter();

    let currentTab = router.pathname.split('/').pop();

    if (router.asPath === baseHref) {
        currentTab = tabs.find(tab => tab.defaultTab)?.label;
        if (!currentTab && process.env.NODE_ENV === 'development') {
            throw new Error('No default tab selected!');
        }
    }

    const selectTab = (selected: string) : void => {
        const href = tabs.find(tab => tab.label === selected)?.href;
        if (href) {
            router.push(baseHref + href);
        }
        else if (process.env.NODE_ENV === 'development') {
            throw new Error (`Tab with label ${selected} wasn't found`);
        }
    };

    return (
        <Box className={ classes.root } display="flex" height="100vh">
            <OrganizeSidebar />
            <Box display="flex" flexDirection="column" height="100vh" overflow="auto" position="relative" width={ 1 }>
                <Box display={ fixedHeight ? 'flex' :'block' } flexDirection="column" height={ fixedHeight ? 1 : 'auto' }>
                    <Box flexGrow={ 0 } flexShrink={ 0 }>
                        <Box display="flex" justifyContent="space-between">
                            <Box className={ classes.breadcrumbs } p={ 2 } pl={ 3 }>
                                <BreadcrumbTrail/>
                            </Box>
                            <Box display="flex" position="absolute" right={ 0 } top={ 0 } zIndex={ 10000 }>
                                <SearchDrawer />
                            </Box>
                        </Box>
                        <Box p={ 3 } pt={ 1 }>
                            <Typography component="h1" noWrap variant="h2">
                                { title }
                            </Typography>
                            <Typography component="h2" noWrap variant="h5">
                                { subtitle }
                            </Typography>
                        </Box>
                        <Tabs
                            aria-label="campaign tabs"
                            onChange={ (_, selected) => selectTab(selected) }
                            value={ currentTab }>
                            { tabs.map(tab => {
                                return (
                                    <Tab key={ tab.label } label={ intl.formatMessage({
                                        id: `layout.organize.campaigns.${tab.label}`,
                                    }) } value={ tab.label }
                                    />
                                );
                            }) }
                        </Tabs>
                    </Box>
                    <Box flexGrow={ 1 } minHeight={ 0 } position="relative" role="tabpanel">
                        { children }
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};

export default TabbedLayout;
