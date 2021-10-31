import { Box } from '@mui/material';
import { FunctionComponent } from 'react';
import { grey } from '@mui/material/colors';

import makeStyles from '@mui/styles/makeStyles';

import BreadcrumbTrail from '../../BreadcrumbTrail';
import OrganizeSidebar from 'components/organize/OrganizeSidebar';

const useStyles = makeStyles((theme) => ({
    breadcrumbs: {
        [theme.breakpoints.down('sm')]: {
            width: '100%',
        },
    },
    root: {
        [theme.breakpoints.down('sm')]: {
            paddingTop: '4rem',
        },
    },
}));

const DefaultLayout: FunctionComponent = ({ children }) => {
    const classes = useStyles();
    return (
        <Box className={ classes.root } display="flex">
            <Box bgcolor={ grey[200] } height="100vh">
                <OrganizeSidebar />
            </Box>
            <Box display="flex" flexDirection="column" width={ 1 }>
                <Box display="flex" m={ 1 } mb={ 0 }>
                    <Box className={ classes.breadcrumbs } mt="0.5rem" width={ 1 }>
                        <BreadcrumbTrail/>
                    </Box>
                </Box>
                { children as JSX.Element }
            </Box>
        </Box>
    );
};

export default DefaultLayout;
