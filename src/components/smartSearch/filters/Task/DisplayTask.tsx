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
    const { operator, task: taskId } = config;
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
    if(filter.config.campaign) {
        const campaignQuery = campaignResource(orgId as string, filter.config.campaign as string).useQuery();
        campaignTitle = campaignQuery?.data?.title || null;
    }

    const matching = getMatchingWithConfig(filter.config?.matching);

    return (
        <Msg
            id="misc.smartSearch.task.inputString"
            values={{
                addRemoveSelect: (
                    <Msg id={ `misc.smartSearch.task.addRemoveSelect.${op}` }/>
                ),
                taskSelect: taskTitle ?
                    <Msg id="misc.smartSearch.task.taskSelect.task"
                        values={{
                            taskTitle,
                        }}
                    /> :
                    <Msg id="misc.smartSearch.task.task.any"/>,
                campaignSelect: campaignTitle ?
                    <Msg id="misc.smartSearch.task.campaignSelect.campaign"
                        values={{
                            campaignTitle,
                        }}
                    /> :
                    <Msg id="misc.smartSearch.task.campaign.any"/>,
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
                taskStatusSelect: (
                    <Msg id={ `misc.smartSearch.task.taskStatusSelect.${getTaskStatus(filter.config)}` } />
                ),
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
            }}
        />
    );
};

export default DisplayTask;
