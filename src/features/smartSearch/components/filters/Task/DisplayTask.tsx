import { useRouter } from 'next/router';

import { campaignResource } from 'features/campaigns/api/campaigns';
import DisplayTimeFrame from '../DisplayTimeFrame';
import { Msg } from 'core/i18n';

import messageIds from 'features/smartSearch/l10n/messageIds';
const localMessageIds = messageIds.filters.task;

import UnderlinedMsg from '../../UnderlinedMsg';
import UnderlinedText from '../../UnderlinedText';
import useTask from 'features/tasks/hooks/useTask';
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
  const timeFrame = getTimeFrameWithConfig(tf);

  let taskTitle = null;
  const taskQuery = useTask(parseInt(orgId as string), config.task);
  if (config.task != undefined) {
    taskTitle = taskQuery?.title || null;
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
          <UnderlinedMsg
            id={localMessageIds.campaignSelect.campaign}
            values={{
              campaign: <UnderlinedText text={campaignTitle} />,
            }}
          />
        ) : (
          <UnderlinedMsg id={localMessageIds.campaignSelect.any} />
        )}
      </>
    );
  }

  return (
    <Msg
      id={localMessageIds.inputString}
      values={{
        addRemoveSelect: <UnderlinedMsg id={messageIds.operators[op]} />,
        campaignSelect: campaignSelect,
        matchingSelect: (
          // TODO: Move this to reusable component
          <UnderlinedMsg
            id={messageIds.matching.preview[matching.option]}
            values={{
              max: matching.config?.max ?? 0,
              min: matching.config?.min ?? 0,
            }}
          />
        ),
        taskSelect: taskTitle ? (
          <UnderlinedMsg
            id={localMessageIds.taskSelect.task}
            values={{
              task: <UnderlinedText text={taskTitle} />,
            }}
          />
        ) : (
          <UnderlinedMsg id={localMessageIds.taskSelect.any} />
        ),
        taskStatusSelect: (
          <UnderlinedMsg
            id={localMessageIds.taskStatusSelect[getTaskStatus(config)]}
          />
        ),
        timeFrame: <DisplayTimeFrame config={timeFrame} />,
      }}
    />
  );
};

export default DisplayTask;
