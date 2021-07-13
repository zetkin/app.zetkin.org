import { GetServerSideProps } from 'next';
import { useState } from 'react';
import { Box , FormControl, MenuItem, Select } from '@material-ui/core';

import getCampaigns from '../../../../../fetching/getCampaigns';
import getEvents from '../../../../../fetching/getEvents';
import getOrg from '../../../../../fetching/getOrg';
import MonthCalendar from '../../../../../components/calendar/MonthCalendar';
import OrganizeAllCampaignsLayout from '../../../../../components/layout/OrganizeAllCampaignsLayout';
import { PageWithLayout } from '../../../../../types';
import { scaffold } from '../../../../../utils/next';
import { useFocusDate } from '../../../../../hooks';
import { useIntl } from 'react-intl';
import { useQuery } from 'react-query';
import WeekCalendar from '../../../../../components/calendar/WeekCalendar';

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

    await ctx.queryClient.prefetchQuery(['campaigns', orgId], getCampaigns(orgId as string, ctx.apiFetch));
    const campaignsState = ctx.queryClient.getQueryState(['campaigns', orgId]);

    if (orgState?.status === 'success' && eventsState?.status === 'success' &&campaignsState?.status === 'success') {
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
    const campaignsQuery = useQuery(['campaigns', orgId], getCampaigns(orgId));
    const events = eventsQuery.data || [];
    const campaigns = campaignsQuery.data || [];
    const intl = useIntl();
    const { focusDate, setFocusDate } = useFocusDate();

    const items = [
        { id: 'week', name: intl.formatMessage({ id: 'misc.calendar.week' }) },
        { id: 'month', name: intl.formatMessage({ id: 'misc.calendar.month' }) },
    ];

    const [calendarView, setCalendarView] = useState('month');

    const handleChange = (event: React.ChangeEvent<{ name?: string; value: unknown}>) => {
        setCalendarView(event.target.value as string);
    };

    const sortedEvents = [...events].sort((a, b) => {
        return new Date(a.start_time).getTime() - new Date(b.start_time).getTime();
    });

    return (
        <Box p={ 2 } position="relative">
            <Box display="flex" justifyContent="flex-end" mr={ 4 } position="absolute" right={ 0 } top="1.2rem" zIndex={ 12 }>
                <FormControl
                    aria-label={ intl.formatMessage(
                        { id: 'misc.calendar.label' }) }
                    variant="outlined">
                    <Select id="demo-simple-select-outlined"
                        labelId="demo-simple-select-outlined-label"
                        onChange={ handleChange }
                        value={ calendarView }>
                        { items.map(item => (
                            <MenuItem key={ item.id } value={ item.id }>
                                { item.name }
                            </MenuItem>
                        )) }
                    </Select>
                </FormControl>
            </Box>
            <Box height="80vh" overflow="auto">
                { calendarView === 'month' &&
                    <MonthCalendar
                        baseHref={ `/organize/${orgId}/campaigns` }
                        campaigns={ campaigns }
                        events={ sortedEvents }
                        focusDate={ focusDate }
                        onFocusDate={ date => setFocusDate(date) }
                        orgId={ orgId }
                    /> }
                { calendarView === 'week' &&
                    <WeekCalendar
                        baseHref={ `/organize/${orgId}/campaigns` }
                        campaigns={ campaigns }
                        events={ sortedEvents }
                        focusDate={ focusDate }
                        onFocusDate={ date => setFocusDate(date) }
                        orgId={ orgId }
                    /> }
            </Box>
        </Box>
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
