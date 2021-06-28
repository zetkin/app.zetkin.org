import { useQuery } from 'react-query';
import { useRouter } from 'next/router';
import { Box, Typography } from '@material-ui/core';
import { FunctionComponent, ReactText } from 'react';

import getCampaign from '../../fetching/getCampaign';
import OrganizeCampaignTabs from '../OrganizeCampaignTabs';
import OrganizeLayout from './OrganizeLayout';

interface OrganizeCampaignLayoutProps {
    campId: string;
    orgId: string;
}

const OrganizeCampaignLayout : FunctionComponent<OrganizeCampaignLayoutProps> = ({ orgId, campId, children }) => {
    const router = useRouter();

    const campQuery = useQuery(['campaign', orgId, campId], getCampaign(orgId, campId));

    const path =  router.pathname.split('/');
    let currentTab = path.pop();

    if (currentTab === '[campId]') {
        currentTab = 'summary';
    }

    const onSelectTab = (key : ReactText) : void => {
        if (key === 'summary') {
            router.push(`/organize/${orgId}/campaigns/${campId}`);
        }
        else {
            router.push(`/organize/${orgId}/campaigns/${campId}/${key}`);
        }
    };

    return (
        <OrganizeLayout orgId={ orgId }>
            <Box m={ 2 }>
                <Typography component="h1" variant="h4">
                    { campQuery.data?.title }
                </Typography>
            </Box>
            <OrganizeCampaignTabs currentTab={ currentTab } onSelectTab={ onSelectTab }> { children }</OrganizeCampaignTabs>
        </OrganizeLayout>
    );
};

export default OrganizeCampaignLayout;