import { FormattedMessage as Msg } from 'react-intl';
import { useRouter } from 'next/router';

import { campaignResource } from 'api/campaigns';
import { taskResource } from 'api/tasks';

import { getMatchingWithConfig, getTaskStatus, getTaskTimeFrame, getTimeFrameWithConfig } from '../../utils';
import { OPERATION, SmartSearchFilterWithId, TaskFilterConfig } from 'types/smartSearch';

interface DisplayTaskProps {
    filter: SmartSearchFilterWithId<TaskFilterConfig>;
}

const DisplayTask = ({ filter }: DisplayTaskProps) : JSX.Element => {
    const { orgId } = useRouter().query;
    const { config } = filter;
    const { task: taskId } = config;
    const op = filter.op || OPERATION.ADD;

    const tf = getTaskTimeFrame(filter.config);
    const {
        after,
        before,
        numDays,
        timeFrame,
    } = getTimeFrameWithConfig(tf);

    const taskQuery = taskResource(orgId as string, taskId as string).useQuery();
    const taskTitle = taskQuery?.data?.title || null;

    let campaignTitle;
    if (filter.config.campaign && filter.config.task == undefined) {
        const campaignQuery = campaignResource(orgId as string, filter.config.campaign as string).useQuery();
        campaignTitle = campaignQuery?.data?.title || null;
    }

    const matching = getMatchingWithConfig(filter.config?.matching);

    // We don't want to show the campaign if a task has been specfied
    let campaignSelect = null;
    if (!taskTitle) {
        const label = campaignTitle ? "campaign" : "any"
            campaignSelect = (
                <>
                    <Msg id="misc.smartSearch.task.campaignSelect.in" />
                    <Msg id={ `misc.smartSearch.task.campaignSelect.${label}` }
                        values={{
                            campaign: campaignTitle,
                        }}
                    />
                </>
            );
    }

    return (
        <Msg
            id="misc.smartSearch.task.inputString"
            values={{
                addRemoveSelect: (
                    <Msg id={ `misc.smartSearch.task.addRemoveSelect.${op}` }/>
                ),
                campaignSelect: campaignSelect,
                haveSelect: (
                    <Msg id={ `misc.smartSearch.task.haveSelect.${filter.config.operator}` } />
                ),
                matchingSelect: (
                    <Msg id={ `misc.smartSearch.matching.preview.${matching.option}` } values={{
                        max: matching.config.max,
                        min: matching.config.min,
                    }}
                    />
                ),
                taskSelect: taskTitle ?
                    <Msg id="misc.smartSearch.task.taskSelect.task"
                        values={{
                            task: taskTitle,
                        }}
                    /> :
                    <Msg id="misc.smartSearch.task.taskSelect.any"/>,
                taskStatusSelect: (
                    <Msg id={ `misc.smartSearch.task.taskStatusSelect.${getTaskStatus(filter.config)}` } />
                ),
                timeFrame: (
                    <Msg
                        id={ `misc.smartSearch.timeFrame.preview.${timeFrame}` }
                        values={{
                            afterDate: (
                                after?.toISOString().slice(0,10)
                            ),
                            beforeDate: (
                                before?.toISOString().slice(0, 10)
                            ),
                            days: numDays,
                        }}
                    />
                ), 
            }}
        />
    );
};

export default DisplayTask;
