import { GetServerSideProps } from 'next';
import { useState } from 'react';
import { Box, FormControl, MenuItem, Select } from '@material-ui/core';

import getCampaign from '../../../../../../fetching/getCampaign';
import getCampaignEvents from '../../../../../../fetching/getCampaignEvents';
import getOrg from '../../../../../../fetching/getOrg';
import MonthCalendar from '../../../../../../components/calendar/MonthCalendar';
import OrganizeTabbedLayout from '../../../../../../components/layout/OrganizeTabbedLayout';
import { PageWithLayout } from '../../../../../../types';
import { scaffold } from '../../../../../../utils/next';
import { useFocusDate } from '../../../../../../hooks';
import { useIntl } from 'react-intl';
import { useQuery } from 'react-query';

import WeekCalendar from '../../../../../../components/calendar/WeekCalendar';
import ZetkinSpeedDial, { ACTIONS } from '../../../../../../components/ZetkinSpeedDial';

const scaffoldOptions = {
    authLevelRequired: 2,
    localeScope: [
        'layout.organize', 'misc.breadcrumbs', 'misc.calendar', 'misc.formDialog', 'misc.speedDial',
    ],
};

export const getServerSideProps : GetServerSideProps = scaffold(async (ctx) => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const { orgId, campId } = ctx.params!;


    await ctx.queryClient.prefetchQuery(['org', orgId], getOrg(orgId as string, ctx.apiFetch));
    const orgState = ctx.queryClient.getQueryState(['org', orgId]);

    await ctx.queryClient.prefetchQuery(['campaignEvents', orgId, campId], getCampaignEvents(orgId as string, campId as string, ctx.apiFetch));
    const campaignEventsState = ctx.queryClient.getQueryState(['campaignEvents', orgId, campId]);

    await ctx.queryClient.prefetchQuery(['campaign', orgId, campId], getCampaign(orgId as string, campId as string, ctx.apiFetch));
    const campaignState = ctx.queryClient.getQueryState(['campaign', orgId, campId]);

    if (orgState?.status === 'success' && campaignEventsState?.status === 'success' && campaignState?.status === 'success' ) {
        return {
            props: {
                campId,
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

type OrganizeCalendarPageProps = {
    campId: string;
    orgId: string;
};

const CampaignCalendarPage : PageWithLayout<OrganizeCalendarPageProps> = ({ orgId, campId }) => {
    const eventsQuery = useQuery(['campaignEvents', orgId, campId], getCampaignEvents(orgId, campId));
    const campaignQuery = useQuery(['campaign', orgId, campId], getCampaign(orgId, campId));
    const events = eventsQuery.data || [];
    const campaigns = campaignQuery.data ? [campaignQuery.data] : [];
    const intl = useIntl();
    const [calendarView, setCalendarView] = useState('week');
    const { focusDate, setFocusDate } = useFocusDate();

    const items = [
        { id: 'week', name: intl.formatMessage({ id: 'misc.calendar.week' }) },
        { id: 'month', name: intl.formatMessage({ id: 'misc.calendar.month' }) },
    ];

    const handleChange = (event: React.ChangeEvent<{ name?: string; value: unknown}>) => {
        setCalendarView(event.target.value as string);
    };

    return (
        <>
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
                        baseHref={ `/organize/${orgId}/campaigns/${campId}` }
                        campaigns={ campaigns }
                        events={ events }
                        focusDate={ focusDate }
                        onFocusDate={ date => setFocusDate(date) }
                        orgId={ orgId }
                    /> }
                    { calendarView === 'week' &&
                    <WeekCalendar
                        baseHref={ `/organize/${orgId}/campaigns/${campId}` }
                        campaigns={ campaigns }
                        events={ events }
                        focusDate={ focusDate }
                        onFocusDate={ date => setFocusDate(date) }
                        orgId={ orgId }
                    /> }
                </Box>
            </Box>
            <ZetkinSpeedDial actions={ [ACTIONS.CREATE_EVENT] }/>
        </>
    );
};

CampaignCalendarPage.getLayout = function getLayout(page) {
    return (
        <OrganizeTabbedLayout fixedHeight>
            { page }
        </OrganizeTabbedLayout>
    );
};

export default CampaignCalendarPage;
