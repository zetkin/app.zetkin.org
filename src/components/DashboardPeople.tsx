import { FormattedMessage as Msg } from 'react-intl';
import { Box, Typography } from '@material-ui/core';

const DashboardPeople = () : JSX.Element => {

    return (
        <Box border={ 1 } m={ 2 } p={ 2 }>
            <Typography component="h2" variant="body1">
                <Msg id="pages.organize.people.title"/>
            </Typography>
        </Box>
    );
};

export default DashboardPeople;
