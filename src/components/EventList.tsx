import { Button, Flex, Text, View } from '@adobe/react-spectrum';

import { ZetkinEvent } from '../interfaces/ZetkinEvent';
import { ZetkinOrganization } from '../interfaces/ZetkinOrganization';

interface EventListProps {
    events: ZetkinEvent[] | undefined;
    org: ZetkinOrganization | undefined;
}

const EventList = ({ events, org } : EventListProps) : JSX.Element => {
    if (events === undefined) {
        return (
            <Text>
                Sorry, there are no planned events at the moment.
            </Text>
        );
    }

    return (
        <>
            <Flex data-test="event-list" direction="row" gap="100" wrap>
                { events?.map((e) => (
                    <Flex key={ e.id } data-test="event" direction="column" margin="size-200">
                        <View data-test="event-title">
                            { e.title ? e.title : e.activity.title }
                        </View>
                        <View data-test="org-title">{ org?.title }</View>
                        <View data-test="campaign-title">{ e.campaign.title }</View>
                        <View data-test="start-time">{ e.start_time }</View>
                        <View data-test="end-time">{ e.end_time }</View>
                        <View data-test="location-title">{ e.location.title }</View>
                        <Button data-test="sign-up-button" variant="cta">Sign-up</Button>
                    </Flex>
                )) }
            </Flex>
        </>
    );
};

export default EventList;