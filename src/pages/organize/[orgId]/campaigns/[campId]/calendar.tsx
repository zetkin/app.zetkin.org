import { GetServerSideProps } from 'next';
import { useState } from 'react';
import { ActionButton, Flex, Item, Picker, View } from '@adobe/react-spectrum';
import { FormattedDate, FormattedMessage as Msg } from 'react-intl';

import getCampaign from '../../../../../fetching/getCampaign';
import getCampaignEvents from '../../../../../fetching/getCampaignEvents';
import getOrg from '../../../../../fetching/getOrg';
import MonthCalendar from '../../../../../components/MonthCalendar';
import OrganizeCampaignLayout from '../../../../../components/layout/OrganizeCampaignLayout';
import { PageWithLayout } from '../../../../../types';
import { scaffold } from '../../../../../utils/next';
import { useFocusDate } from '../../../../../hooks';
import { useIntl } from 'react-intl';
import { useQuery } from 'react-query';
import WeekCalendar from '../../../../../components/Calendar';

const scaffoldOptions = {
    authLevelRequired: 2,
    localeScope: [
        'layout.organize', 'misc.breadcrumbs', 'misc.calendar',
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
    const events = eventsQuery.data || [];
    const intl = useIntl();
    const [calendarView, setCalendarView] = useState('week');
    const { goBackAMonth, goBackAWeek, goFwdAMonth, goFwdAWeek, selectedMonday, selectedMonth, selectedYear } = useFocusDate();

    const items = [
        { id: 'week', name: intl.formatMessage({ id: 'misc.calendar.week' }) },
        { id: 'month', name: intl.formatMessage({ id: 'misc.calendar.month' }) },
    ];

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
                <View position="absolute" right="15rem" top="-2.6rem">
                    <Flex alignItems="center">
                        <ActionButton onPress={ calendarView === 'month' ? goBackAMonth : goBackAWeek }>
                            <Msg id="misc.calendar.prev" />
                        </ActionButton>
                        <View padding="size-100">
                            { calendarView === 'month' ? <FormattedDate
                                month="long"
                                value={ new Date(selectedYear, selectedMonth + 1, 0) }
                                year="numeric"
                            /> : <FormattedDate
                                day="2-digit"
                                month="short"
                                value={ selectedMonday }
                            /> }
                        </View>
                        <ActionButton onPress={ calendarView === 'month' ? goFwdAMonth : goFwdAWeek }>
                            <Msg id="misc.calendar.next" />
                        </ActionButton>
                    </Flex>
                </View>

                { calendarView === 'month' && <MonthCalendar events={ events } month={ selectedMonth } year={ selectedYear } /> }
                { calendarView === 'week' && <WeekCalendar events={ events } focusMonday={ selectedMonday } /> }
            </View>
        </View>
    );
};

CampaignCalendarPage.getLayout = function getLayout(page, props) {
    return (
        <OrganizeCampaignLayout campId={ props.campId as string } orgId={ props.orgId as string }>
            { page }
        </OrganizeCampaignLayout>
    );
};

export default CampaignCalendarPage;
