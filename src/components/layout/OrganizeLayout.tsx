import { FunctionComponent } from 'react';
import { grey } from '@material-ui/core/colors';
import { Box, makeStyles } from '@material-ui/core';

import BreadcrumbTrail from '../BreadcrumbTrail';
import OrganizeSidebar from '../OrganizeSidebar';
import SearchDrawer from '../../components/SearchDrawer';

interface OrganizeLayoutProps {
    orgId: string;
}

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

const OrganizeLayout: FunctionComponent<OrganizeLayoutProps> = ({ children, orgId }) => {
    const classes = useStyles();
    return (
        <Box className={ classes.root } display="flex">
            <Box bgcolor={ grey[200] } height="100vh">
                <OrganizeSidebar orgId={ orgId }  />
            </Box>
            <Box display="flex" flexDirection="column" height="100vh" overflow="hidden" width={ 1 }>
                <Box display="flex" m={ 1 } mb={ 0 }>
                    <Box className={ classes.breadcrumbs } mt="0.5rem" width={ 1 }>
                        <BreadcrumbTrail/>
                    </Box>
                    <Box display="flex" justifyContent="end" position="absolute" right={ 0 } top={ 0 } width={ 0.5 } zIndex={ 10000 }>
                        <SearchDrawer />
                    </Box>
                </Box>
                { children as JSX.Element }
            </Box>
        </Box>
    );
};

export default OrganizeLayout;
