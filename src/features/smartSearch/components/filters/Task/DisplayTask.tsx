import DisplayTimeFrame from '../DisplayTimeFrame';
import { Msg } from 'core/i18n';
import { taskResource } from 'features/tasks/api/tasks';

import messageIds from 'features/smartSearch/l10n/messageIds';
const localMessageIds = messageIds.filters.task;

import UnderlinedCampaignTitle from '../CampaignParticipation/UnderlinedCampaignTitle';
import UnderlinedMsg from '../../UnderlinedMsg';
import UnderlinedText from '../../UnderlinedText';
import { useNumericRouteParams } from 'core/hooks';
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
  const { orgId } = useNumericRouteParams();
  const { config } = filter;
  const op = filter.op || OPERATION.ADD;

  const tf = getTaskTimeFrameWithConfig(config);
  const timeFrame = getTimeFrameWithConfig(tf);

  let taskTitle = null;
  if (config.task != undefined) {
    const taskQuery = taskResource(
      orgId.toString(),
      config.task as unknown as string
    ).useQuery();
    taskTitle = taskQuery?.data?.title || null;
  }

  const matching = getMatchingWithConfig(config?.matching);

  return (
    <Msg
      id={localMessageIds.inputString}
      values={{
        addRemoveSelect: <UnderlinedMsg id={messageIds.operators[op]} />,
        campaignSelect: taskTitle ? null : (
          <>
            <Msg id={localMessageIds.campaignSelect.in} />
            {config.campaign && !config.task ? (
              <UnderlinedCampaignTitle campId={config.campaign} orgId={orgId} />
            ) : (
              <UnderlinedMsg id={localMessageIds.campaignSelect.any} />
            )}
          </>
        ),
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
