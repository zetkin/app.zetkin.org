import { FormattedMessage as Msg } from 'react-intl';
import { Box, Typography } from '@material-ui/core';


interface DashboardPeopleProps {
    orgId: string;
}

const DashboardPeople = ({ orgId } : DashboardPeopleProps) : JSX.Element => {

    return (
        <Box border={ 1 } m={ 2 } p={ 2 }>
            <Typography component="h2" variant="body1">
                <Msg id="pages.organize.people.title"/>
            </Typography>
            { orgId }
        </Box>
    );
};

export default DashboardPeople;
