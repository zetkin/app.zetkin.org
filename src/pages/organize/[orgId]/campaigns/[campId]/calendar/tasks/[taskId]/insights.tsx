import { FunctionComponent } from 'react';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { ResponsiveLine } from '@nivo/line';
import { useRouter } from 'next/router';
import { Box, Card, CardContent, Typography } from '@material-ui/core';
import { FormattedDate, useIntl } from 'react-intl';

import getOrg from 'fetching/getOrg';
import { PageWithLayout } from 'types';
import { scaffold } from 'utils/next';
import SingleTaskLayout from 'components/layout/organize/SingleTaskLayout';
import { taskResource } from 'api/tasks';
import { ZetkinAssignedTask } from 'types/tasks';
import ZetkinQuery from 'components/ZetkinQuery';

const scaffoldOptions = {
    authLevelRequired: 2,
    localeScope: ['layout.organize', 'pages.assignees', 'misc'],
};

export const getServerSideProps : GetServerSideProps = scaffold(async (ctx) => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const { campId, orgId, taskId } = ctx.params!;

    await ctx.queryClient.prefetchQuery(['org', orgId], getOrg(orgId as string, ctx.apiFetch));
    const orgState = ctx.queryClient.getQueryState(['org', orgId]);

    const { prefetch: prefetchTask } = taskResource(orgId as string, taskId as string);
    const { state: taskState, data: taskData } = await prefetchTask(ctx);

    if (orgState?.status === 'success' && taskState?.status === 'success') {
        if (campId && +campId === taskData?.campaign.id) {
            return {
                props: {
                    campId,
                    orgId,
                    taskId,
                },
            };
        }
    }
    return {
        notFound: true,
    };
}, scaffoldOptions);


interface ProgressChartProps {
    tasks: ZetkinAssignedTask[];
}

const ProgressChart: FunctionComponent<ProgressChartProps> = ({ tasks }) => {
    const minTs = Math.min.apply(null, tasks.map(t => (new Date(t.assigned)).getTime()));
    const maxTs = Math.max.apply(null, tasks.map(t => Math.max(new Date(t.completed || 0).getTime(), new Date(t.ignored || 0).getTime())));

    const allSeries = [];
    for (let ts = minTs; ts < maxTs; ts += 3 * 60 * 60 * 1000) {
        allSeries.push({
            assigned: tasks.filter(t => new Date(t.assigned).getTime() < ts).length,
            completed: tasks.filter(t => t.completed && new Date(t.completed).getTime() < ts).length,
            ignored: tasks.filter(t => t.ignored && new Date(t.ignored).getTime() < ts).length,
            ts: ts,
        });
    }

    const data = [
        {
            color: 'rgb(255, 128, 0)',
            data: allSeries.map(stats => ({
                x: stats.ts,
                y: stats.assigned,
            })),
            id: 'assigned',
        },
        {
            color: 'rgb(0, 255, 128)',
            data: allSeries.map(stats => ({
                x: stats.ts,
                y: stats.completed,
            })),
            id: 'completed',
        },
        {
            color: 'rgb(128, 0, 255)',
            data: allSeries.map(stats => ({
                x: stats.ts,
                y: stats.ignored,
            })),
            id: 'ignored',
        },
    ];

    return (
        <Box height={ 400 } maxWidth={ 1200 } width="100%">
            <ResponsiveLine
                axisBottom={{
                    format: val => new Date(val).toISOString().slice(0, 10),
                    legendOffset: 36,
                    legendPosition: 'middle',
                    tickPadding: 5,
                    tickRotation: -25,
                    tickSize: 5,
                }}
                axisLeft={{
                    legendOffset: -40,
                    legendPosition: 'middle',
                    tickPadding: 5,
                    tickRotation: 0,
                    tickSize: 5,
                }}
                curve="monotoneX"
                data={ data }
                enableArea={ true }
                enableGridX={ false }
                enablePoints={ false }
                enableSlices="x"
                isInteractive={ true }
                legends={ [
                    {
                        anchor: 'top-right',
                        direction: 'column',
                        itemHeight: 20,
                        itemWidth: 90,
                        itemsSpacing: 8,
                        translateX: 100,
                    },
                ] }
                margin={{
                    bottom: 50,
                    left: 60,
                    right: 100,
                    top: 0,
                }}
                sliceTooltip={ ({ slice }) => (
                    <Card>
                        <CardContent>
                            <Typography variant="h6">
                                <FormattedDate
                                    day="numeric"
                                    hour="numeric"
                                    month="numeric"
                                    value={ slice.points[0].data.x }
                                    year="numeric"
                                />
                            </Typography>
                            { slice.points.map(point => (
                                <Typography key={ point.id }>
                                    { point.serieId } { point.data.y }
                                </Typography>
                            )) }
                        </CardContent>
                    </Card>
                ) }
                xScale={{
                    min: minTs,
                    type: 'linear',
                }}
            />
        </Box>
    );
};


const TaskAssigneesPage: PageWithLayout = () => {
    const intl = useIntl();

    const { taskId, orgId } = useRouter().query;
    const { useQuery: useTaskQuery, useAssignedTasksQuery } = taskResource(orgId as string, taskId as string);
    const { data: task } = useTaskQuery();

    return (
        <>
            <Head>
                <title>{ `${task?.title} - ${intl.formatMessage({ id: 'layout.organize.tasks.tabs.insights' })}` }</title>
            </Head>
            <Typography variant="h4">Lifetime performance</Typography>
            <ZetkinQuery queries={{
                assignedTasksQuery: useAssignedTasksQuery(),
            }}>
                { ({ queries: { assignedTasksQuery } }) => {
                    return (
                        <Box mt={ 3 }>
                            <ProgressChart tasks={ assignedTasksQuery.data }/>
                        </Box>
                    );
                } }
            </ZetkinQuery>
        </>
    );
};

TaskAssigneesPage.getLayout = function getLayout(page) {
    return (
        <SingleTaskLayout>
            { page }
        </SingleTaskLayout>
    );
};

export default TaskAssigneesPage;
