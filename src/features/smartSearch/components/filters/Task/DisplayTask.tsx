import { useRouter } from 'next/router';

import { campaignResource } from 'features/campaigns/api/campaigns';
import { Msg } from 'core/i18n';
import { taskResource } from 'features/tasks/api/tasks';

import messageIds from 'features/smartSearch/l10n/messageIds';
const localMessageIds = messageIds.filters.task;

import {
  getMatchingWithConfig,
  getTaskStatus,
  getTaskTimeFrameWithConfig,
  getTimeFrameWithConfig,
} from '../../utils';
import {
  OPERATION,
  SmartSearchFilterWithId,
  TaskFilterConfig,
} from 'features/smartSearch/components/types';

interface DisplayTaskProps {
  filter: SmartSearchFilterWithId<TaskFilterConfig>;
}

const DisplayTask = ({ filter }: DisplayTaskProps): JSX.Element => {
  const { orgId } = useRouter().query;
  const { config } = filter;
  const op = filter.op || OPERATION.ADD;

  const tf = getTaskTimeFrameWithConfig(config);
  const { after, before, numDays, timeFrame } = getTimeFrameWithConfig(tf);

  let taskTitle = null;
  if (config.task != undefined) {
    const taskQuery = taskResource(
      orgId as string,
      config.task as unknown as string
    ).useQuery();
    taskTitle = taskQuery?.data?.title || null;
  }

  let campaignTitle;
  if (config.campaign && config.task == undefined) {
    const campaignQuery = campaignResource(
      orgId as string,
      config.campaign as unknown as string
    ).useQuery();
    campaignTitle = campaignQuery?.data?.title || null;
  }

  const matching = getMatchingWithConfig(config?.matching);

  // We don't want to show the campaign if a task has been specfied
  let campaignSelect = null;
  if (!taskTitle) {
    campaignSelect = (
      <>
        <Msg id={localMessageIds.campaignSelect.in} />
        {campaignTitle ? (
          <Msg
            id={localMessageIds.campaignSelect.campaign}
            values={{ campaign: campaignTitle }}
          />
        ) : (
          <Msg id={localMessageIds.campaignSelect.any} />
        )}
      </>
    );
  }

  return (
    <Msg
      id={localMessageIds.inputString}
      values={{
        addRemoveSelect: <Msg id={localMessageIds.addRemoveSelect[op]} />,
        campaignSelect: campaignSelect,
        matchingSelect: (
          // TODO: Move this to reusable component
          <Msg
            id={messageIds.matching.preview[matching.option]}
            values={{
              max: matching.config?.max ?? 0,
              min: matching.config?.min ?? 0,
            }}
          />
        ),
        taskSelect: taskTitle ? (
          <Msg
            id={localMessageIds.taskSelect.task}
            values={{
              task: taskTitle,
            }}
          />
        ) : (
          <Msg id={localMessageIds.taskSelect.any} />
        ),
        taskStatusSelect: (
          <Msg id={localMessageIds.taskStatusSelect[getTaskStatus(config)]} />
        ),
        timeFrame: (
          <Msg
            id={messageIds.timeFrame.preview[timeFrame]}
            values={{
              afterDate: after?.toISOString().slice(0, 10),
              beforeDate: before?.toISOString().slice(0, 10),
              days: numDays,
            }}
          />
        ),
      }}
    />
  );
};

export default DisplayTask;
