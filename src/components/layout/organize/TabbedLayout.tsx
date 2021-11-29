import { useIntl } from 'react-intl';
import { useRouter } from 'next/router';
import { ArrowDownward, ArrowUpward } from '@material-ui/icons';
import { Box, Button, Collapse, makeStyles, Tab, Tabs, Theme, Typography } from '@material-ui/core';
import { FunctionComponent, ReactElement, useState } from 'react';

import BreadcrumbTrail from '../../BreadcrumbTrail';
import OrganizeSidebar from 'components/organize/OrganizeSidebar';

interface StyleProps {
    collapsed: boolean;
}

const useStyles = makeStyles<Theme, StyleProps>((theme) => ({
    root: {
        [theme.breakpoints.down('xs')]: {
            paddingTop: '3.5rem',
        },
    },
    title: {
        marginBottom: '8px',
        transition: 'all 0.3s ease',
    },
    titleGrid: {
        '& .hide-button': {
            gridColumnEnd: 'none',
        },
        alignItems: 'center',
        display: 'grid',
        gap: '1rem',
        gridTemplateColumns: () => '1fr auto',
        gridTemplateRows:'auto',
        transition: 'font-size 0.2s ease',
        width: '100%',
        [theme.breakpoints.down('sm')]: {
            gridTemplateColumns: '1fr',
        },

    },

}));

interface TabbedLayoutProps {
    actionButtons?: React.ReactElement | React.ReactElement[];
    fixedHeight?: boolean;
    title?: string;
    subtitle?: string | ReactElement;
    baseHref: string;
    defaultTab: string;
    tabs: {href: string; messageId: string}[];
}

const TabbedLayout: FunctionComponent<TabbedLayoutProps> = ({
    children,
    actionButtons,
    fixedHeight,
    title,
    subtitle,
    tabs,
    baseHref,
    defaultTab,
}) => {
    const intl = useIntl();
    const [collapsed, setCollapsed] = useState(false);
    const classes = useStyles({ collapsed });
    const router = useRouter();

    const currentTab = router.asPath === baseHref ? defaultTab :
        `/${router.pathname.split('/').pop()}`;

    const selectTab = (selected: string) : void => {
        const href = tabs.find(tab => tab.href === selected)?.href;
        if (href) {
            router.push(baseHref + href);
        }
        else if (process.env.NODE_ENV === 'development') {
            throw new Error (`Tab with label ${selected} wasn't found`);
        }
    };

    const toggleCollapse = () => setCollapsed(!collapsed);

    return (
        <Box className={ classes.root } display="flex" height="100vh">
            <OrganizeSidebar />
            <Box display="flex" flexDirection="column" height="100vh" overflow="auto" position="relative" width={ 1 }>
                <Box display={ fixedHeight ? 'flex' :'block' } flexDirection="column" height={ fixedHeight ? 1 : 'auto' }>
                    <Box component="header" flexGrow={ 0 } flexShrink={ 0 }>
                        <Box mb={ collapsed ? 0 : 2 } pt={ 3 } px={ 3 }>
                            <Box display="flex" flexDirection="row" justifyContent="space-between">
                                <BreadcrumbTrail highlight={ collapsed } />
                                <Box className="hide-button">
                                    <Button onClick={ toggleCollapse } size="small"
                                        startIcon={ collapsed ? <ArrowDownward /> : <ArrowUpward /> }>
                                        { collapsed ? 'expand' : 'collapse' } header
                                    </Button>
                                </Box>
                            </Box>
                            { /* Title, subtitle, and action buttons */ }
                            <Collapse in={ !collapsed }>
                                <Box className={ classes.titleGrid } mt={ 2 }>
                                    <Box overflow="hidden">
                                        <Typography className={ classes.title } component="h1" data-testid="page-title" noWrap variant="h3">
                                            { title }
                                        </Typography>
                                        <Typography component="h2" variant="h5">
                                            { subtitle }
                                        </Typography>
                                    </Box>
                                    <Box>
                                        { actionButtons }
                                    </Box>
                                </Box>
                            </Collapse>
                        </Box>
                        <Collapse in={ !collapsed }>
                            <Tabs
                                aria-label="campaign tabs"
                                onChange={ (_, selected) => selectTab(selected) }
                                value={ currentTab }>
                                { tabs.map(tab => {
                                    return (
                                        <Tab key={ tab.href } label={ intl.formatMessage({
                                            id: tab.messageId,
                                        }) } value={ tab.href }
                                        />
                                    );
                                }) }
                            </Tabs>
                        </Collapse>
                    </Box>
                    { /* Page Content */ }
                    <Box component="main" flexGrow={ 1 } minHeight={ 0 } p={ fixedHeight ? 0 : 3 } position="relative" role="tabpanel">
                        { children }
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};

export default TabbedLayout;
