import { FormattedMessage as Msg } from 'react-intl';
import { Heading, View } from '@adobe/react-spectrum';


interface DashboardPeopleProps {
    orgId: string;
}

const DashboardPeople = ({ orgId } : DashboardPeopleProps) : JSX.Element => {

    return (
        <View>
            <Heading level={ 2 }>
                <Msg id="pages.organize.people.title"/>
            </Heading>
            { orgId }
        </View>
    );
};

export default DashboardPeople;
