import { useRouter } from 'next/router';

import { campaignResource } from 'features/campaigns/api/campaigns';
import DisplayTimeFrame from '../DisplayTimeFrame';
import { Msg } from 'core/i18n';
import { taskResource } from 'features/tasks/api/tasks';

import messageIds from 'features/smartSearch/l10n/messageIds';
const localMessageIds = messageIds.filters.task;

import StyledMsg from '../../StyledMsg';
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
          <StyledMsg
            id={localMessageIds.campaignSelect.campaign}
            values={{
              campaign: (
                <StyledMsg
                  id={localMessageIds.styleMe}
                  values={{ styleMe: campaignTitle }}
                />
              ),
            }}
          />
        ) : (
          <StyledMsg id={localMessageIds.campaignSelect.any} />
        )}
      </>
    );
  }

  return (
    <Msg
      id={localMessageIds.inputString}
      values={{
        addRemoveSelect: <StyledMsg id={localMessageIds.addRemoveSelect[op]} />,
        campaignSelect: campaignSelect,
        matchingSelect: (
          // TODO: Move this to reusable component
          <StyledMsg
            id={messageIds.matching.preview[matching.option]}
            values={{
              max: matching.config?.max ?? 0,
              min: matching.config?.min ?? 0,
            }}
          />
        ),
        taskSelect: taskTitle ? (
          <StyledMsg
            id={localMessageIds.taskSelect.task}
            values={{
              task: (
                <StyledMsg
                  id={localMessageIds.styleMe}
                  values={{ styleMe: taskTitle }}
                />
              ),
            }}
          />
        ) : (
          <StyledMsg id={localMessageIds.taskSelect.any} />
        ),
        taskStatusSelect: (
          <StyledMsg
            id={localMessageIds.taskStatusSelect[getTaskStatus(config)]}
          />
        ),
        timeFrame: <DisplayTimeFrame config={timeFrame} />,
      }}
    />
  );
};

export default DisplayTask;
