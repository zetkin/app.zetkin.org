import { GetServerSideProps } from 'next';
import { FormattedMessage as Msg } from 'react-intl';
import NextLink from 'next/link';
import { useQuery } from 'react-query';
import { Avatar, Box, Link, makeStyles, Typography } from '@material-ui/core';
import { Public, Settings, SupervisorAccount } from '@material-ui/icons';

import apiUrl from '../../../utils/apiUrl';
import DashboardCampaigns from '../../../components/DashboardCampaigns';
import DashboardPeople from '../../../components/DashboardPeople';
import DefaultLayout from '../../../components/layout/organize/DefaultLayout';
import getCampaigns from '../../../fetching/getCampaigns';
import getOrg from '../../../fetching/getOrg';
import { PageWithLayout } from '../../../types';
import { scaffold } from '../../../utils/next';

const scaffoldOptions = {
    authLevelRequired: 2,
    localeScope: [
        'layout.organize', 'misc.breadcrumbs', 'pages.organize',
    ],
};

export const getServerSideProps : GetServerSideProps = scaffold(async (context) => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const { orgId } = context.params!;

    await context.queryClient.prefetchQuery(['campaigns', orgId], getCampaigns(orgId as string, context.apiFetch));
    await context.queryClient.prefetchQuery(['org', orgId], getOrg(orgId as string, context.apiFetch));

    const campaignsState = context.queryClient.getQueryState(['campaigns', orgId]);
    const orgState = context.queryClient.getQueryState(['org', orgId]);

    if (campaignsState?.status === 'success' && orgState?.status === 'success') {
        return {
            props: {
                orgId,
            },
        };
    }
    else {
        return {
            notFound: true,
        };
    }
}, scaffoldOptions);

type OrganizePageProps = {
    orgId: string;
};

const useStyles = makeStyles((theme) => ({
    responsiveFlexBox: {
        display: 'flex',
        [theme.breakpoints.down('sm')]: {
            flexDirection: 'column',
        },
    },
}));

const OrganizePage: PageWithLayout<OrganizePageProps> = ({ orgId }) => {
    const orgQuery = useQuery(['org', orgId], getOrg(orgId));
    const classes = useStyles();
    return (
        <>
            <Box className={ classes.responsiveFlexBox } p={ 3 }>
                <Box p={ 2 }>
                    <Avatar src={ apiUrl(`/orgs/${orgId}/avatar`) } style={{ height: '100px', width: '100px' }}></Avatar>
                </Box>
                <Box display="flex" flexDirection="column" p={ 2 }>
                    <Typography component="h1" variant="h3">
                        { orgQuery.data?.title }
                    </Typography>
                    <Typography color="primary">
                        <Box className={ classes.responsiveFlexBox } p={ 0 }>
                            <Box display="flex" p={ 1 } pl={ 0 }>
                                <Public />
                                <NextLink href={ `/o/${orgId}` } passHref>
                                    <Link color="inherit">
                                        <Msg id="pages.organize.linkGroup.public"/>
                                    </Link>
                                </NextLink>
                            </Box>
                            <Box display="flex" p={ 1 }>
                                <SupervisorAccount />
                                <NextLink href={ `/organize/${orgId}/organization` } passHref>
                                    <Link color="inherit">
                                        <Msg id="pages.organize.linkGroup.manage"/>
                                    </Link>
                                </NextLink>
                            </Box>
                            <Box display="flex" p={ 1 }>
                                <Settings />
                                <NextLink href={ `/organize/${orgId}/settings` } passHref>
                                    <Link color="inherit">
                                        <Msg id="pages.organize.linkGroup.settings"/>
                                    </Link>
                                </NextLink>
                            </Box>
                        </Box>
                    </Typography>
                </Box>
            </Box>
            <Box className={ classes.responsiveFlexBox } p={ 2 }>
                <Box flex={ 1 } width="100%">
                    <DashboardCampaigns />
                    <DashboardPeople />
                    <Box border={ 1 } m={ 2 } p={ 2 }>Areas</Box>
                </Box>
                <Box border={ 1 } flex={ 1 } m={ 2 } p={ 2 } width="100%">inbox</Box>
            </Box>
        </>
    );
};

OrganizePage.getLayout = function getLayout(page) {
    return (
        <DefaultLayout>
            { page }
        </DefaultLayout>
    );
};

export default OrganizePage;
