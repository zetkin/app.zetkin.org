import { GetServerSideProps } from 'next';
import { useQuery } from 'react-query';

import DefaultOrgLayout from '../../../../components/layout/DefaultOrgLayout';
import EventDetails from '../../../../components/EventDetails';
import getEvent from '../../../../fetching/getEvent';
import { PageWithLayout } from '../../../../types';
import { scaffold } from '../../../../utils/next';
import useEventResponses from '../../../../hooks/useEventResponses';
import { ZetkinEvent } from '../../../../types/zetkin';

const scaffoldOptions = {
    localeScope: [
        'misc.publicHeader',
        'misc.eventResponseButton',
        'misc.signupDialog',
    ],
};

export const getServerSideProps: GetServerSideProps = scaffold(
    async (context) => {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const { orgId, eventId } = context.params!;

        await context.queryClient.prefetchQuery(
            ['event', eventId],
            getEvent(orgId as string, eventId as string, context.apiFetch),
        );

        const eventState = context.queryClient.getQueryState(['event', eventId]);

        if (eventState?.status === 'success') {
            return {
                props: {
                    eventId,
                    orgId,
                },
            };
        }
        else {
            return {
                notFound: true,
            };
        }
    },
    scaffoldOptions,
);

type EventPageProps = {
    eventId: string;
    orgId: string;
};

const EventPage: PageWithLayout<EventPageProps> = (props) => {
    const { orgId, eventId } = props;
    const eventQuery = useQuery(['event', eventId], getEvent(orgId, eventId));
    const { onSignup, onUndoSignup } = useEventResponses('event');

    if (!eventQuery.data) {
        return null;
    }

    const event = eventQuery.data as ZetkinEvent;

    return (
        <EventDetails
            event={ event }
            onSignup={ onSignup }
            onUndoSignup={ onUndoSignup }
        />
    );
};

EventPage.getLayout = function getLayout(page, props) {
    return (
        <DefaultOrgLayout orgId={ props.orgId as string }>
            { page }
        </DefaultOrgLayout>
    );
};

export default EventPage;
