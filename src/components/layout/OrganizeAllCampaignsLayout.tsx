import { FormattedMessage as Msg } from 'react-intl';
import { useRouter } from 'next/router';
import { Box, Typography } from '@material-ui/core';
import { FunctionComponent, ReactText } from 'react';

import OrganizeCampaignTabs from '../OrganizeCampaignTabs';
import OrganizeLayout from './OrganizeLayout';

interface OrganizeAllCampaignsLayoutProps {
    orgId: string;
}

const OrganizeAllCampaignsLayout : FunctionComponent<OrganizeAllCampaignsLayoutProps> = ({ orgId, children }) => {
    const router = useRouter();

    const path =  router.pathname.split('/');
    let currentTab = path.pop();

    if (currentTab === 'campaigns') {
        currentTab = 'summary';
    }

    const onSelectTab = (key : ReactText) : void => {
        if (key === 'summary') {
            router.push(`/organize/${orgId}/campaigns`);
        }
        else {
            router.push(`/organize/${orgId}/campaigns/${key}`);
        }
    };

    return (
        <OrganizeLayout>
            <Box m={ 2 }>
                <Typography component="h1" variant="h4">
                    <Msg id="layout.organize.campaigns.allCampaigns"/>
                </Typography>
            </Box>
            <OrganizeCampaignTabs currentTab={ currentTab } onSelectTab={ onSelectTab }> { children }</OrganizeCampaignTabs>
        </OrganizeLayout>
    );
};

export default OrganizeAllCampaignsLayout;
