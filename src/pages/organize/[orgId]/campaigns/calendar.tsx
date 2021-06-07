import { GetServerSideProps } from 'next';
import { useState } from 'react';
import { Flex, Item, Picker, View } from '@adobe/react-spectrum';

import getEvents from '../../../../fetching/getEvents';
import getOrg from '../../../../fetching/getOrg';
import MonthCalendar from '../../../../components/MonthCalendar';
import OrganizeAllCampaignsLayout from '../../../../components/layout/OrganizeAllCampaignsLayout';
import { PageWithLayout } from '../../../../types';
import { scaffold } from '../../../../utils/next';
import { useFocusDate } from '../../../../hooks';
import { useIntl } from 'react-intl';
import { useQuery } from 'react-query';
import WeekCalendar from '../../../../components/WeekCalendar';

const scaffoldOptions = {
    authLevelRequired: 2,
    localeScope: [
        'layout.organize', 'misc.breadcrumbs', 'misc.calendar',
    ],
};

export const getServerSideProps : GetServerSideProps = scaffold(async (ctx) => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const { orgId } = ctx.params!;

    await ctx.queryClient.prefetchQuery(['org', orgId], getOrg(orgId as string, ctx.apiFetch));
    const orgState = ctx.queryClient.getQueryState(['org', orgId]);

    await ctx.queryClient.prefetchQuery(['events', orgId], getEvents(orgId as string, ctx.apiFetch));
    const eventsState = ctx.queryClient.getQueryState(['events', orgId]);

    if (orgState?.status === 'success' && eventsState?.status === 'success') {
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

type AllCampaignsCalendarPageProps = {
    orgId: string;
};

const AllCampaignsCalendarPage : PageWithLayout<AllCampaignsCalendarPageProps> = ({ orgId }) => {
    const eventsQuery = useQuery(['events', orgId], getEvents(orgId));
    const events = eventsQuery.data || [];
    const intl = useIntl();
    const { focusDate, setFocusDate } = useFocusDate();

    const items = [
        { id: 'week', name: intl.formatMessage({ id: 'misc.calendar.week' }) },
        { id: 'month', name: intl.formatMessage({ id: 'misc.calendar.month' }) },
    ];

    const [calendarView, setCalendarView] = useState('month');

    return (
        <View position="relative">
            <Flex justifyContent="end" position="absolute" right="0px" top="-2.5rem">
                <Picker
                    aria-label={ intl.formatMessage(
                        { id: 'misc.calendar.label' }) }
                    items={ items }
                    onSelectionChange={ (selected) => setCalendarView(selected as string) }
                    selectedKey={ calendarView }>
                    { (item) => <Item key={ item.id }>{ item.name }</Item> }
                </Picker>
            </Flex>
            <View height="80vh">
                { calendarView === 'month' && <MonthCalendar events={ events } focusDate={ focusDate } onFocusDate={ date => setFocusDate(date) } /> }
                { calendarView === 'week' && <WeekCalendar events={ events } focusDate={ focusDate } onFocusDate={ date => setFocusDate(date) }/> }
            </View>
        </View>
    );
};

AllCampaignsCalendarPage.getLayout = function getLayout(page, props) {
    return (
        <OrganizeAllCampaignsLayout orgId={ props.orgId as string }>
            { page }
        </OrganizeAllCampaignsLayout>
    );
};

export default AllCampaignsCalendarPage;