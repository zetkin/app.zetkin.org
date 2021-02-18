import { Button, Flex, View } from '@adobe/react-spectrum';

interface EventListProps {
    events: {
        activity: { title: string },
        campaign: { title: string },
        end_time: string,
        id: number,
        location: { title: string },
        start_time: string,
        title: string
    }[],
    org: {
        id: number,
        title: string
    }
}

const EventList = ({ events, org } : EventListProps) : JSX.Element => {
    return (
        <>
            <Flex data-test="event-list" direction="row" gap="100" wrap>
                { events.map((e) => (
                    <Flex data-test="event" direction="column" margin="size-200" key={ e.id }>
                        <View data-test="event-title">
                            { e.title ? e.title : e.activity.title }
                        </View>
                        <View data-test="org-title">{ org.title }</View>
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