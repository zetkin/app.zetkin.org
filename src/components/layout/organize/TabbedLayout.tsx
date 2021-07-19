import { FunctionComponent } from 'react';
import { useQuery } from 'react-query';
import { useRouter } from 'next/router';
import { Box, makeStyles, Tab, Tabs, Typography } from '@material-ui/core';
import { FormattedMessage as Msg, useIntl } from 'react-intl';

import BreadcrumbTrail from '../../BreadcrumbTrail';
import getCampaign from '../../../fetching/getCampaign';
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
}

const TabbedLayout: FunctionComponent<TabbedLayoutProps> = ({ children, fixedHeight }) => {
    const intl = useIntl();
    const classes = useStyles();
    const router = useRouter();
    const { campId, orgId } = router.query;

    const campQuery = useQuery(['campaign', orgId, campId ], getCampaign(orgId  as string, campId as string));

    const path =  router.pathname.split('/');
    let currentTab = path.pop();

    if (currentTab === '[campId]' || currentTab === 'campaigns') {
        currentTab = 'summary';
    }

    const selectTab = (key : string) : void => {
        if (key === 'summary') {
            campId ? router.push(`/organize/${orgId}/campaigns/${campId}`) :
                router.push(`/organize/${orgId}/campaigns/`);
        }
        else {
            campId ? router.push(`/organize/${orgId}/campaigns/${campId}/${key}`) :
                router.push(`/organize/${orgId}/campaigns/${key}`);
        }
    };

    const singleCampaignPageTabs = ['summary', 'calendar', 'insights'];
    const allCampaignPageTabs = ['summary', 'calendar', 'archive'];

    const tabs = campId ? singleCampaignPageTabs : allCampaignPageTabs;

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
                                { campQuery.data?.title || <Msg id="layout.organize.campaigns.allCampaigns"/> }
                            </Typography>
                        </Box>
                        <Tabs
                            aria-label="campaign tabs"
                            onChange={ (_, value) => selectTab(value) }
                            value={ currentTab }>
                            { tabs.map(tab => (
                                <Tab key={ tab } label={ intl.formatMessage({
                                    id: `layout.organize.campaigns.${tab}`,
                                }) } value={ tab }
                                />
                            )) }
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
