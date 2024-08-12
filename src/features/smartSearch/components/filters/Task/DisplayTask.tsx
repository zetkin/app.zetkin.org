import DisplayTimeFrame from '../DisplayTimeFrame';
import { Msg } from 'core/i18n';
import messageIds from 'features/smartSearch/l10n/messageIds';
import UnderlinedCampaignTitle from '../CampaignParticipation/UnderlinedCampaignTitle';
import UnderlinedMsg from '../../UnderlinedMsg';
import UnderlinedTaskTitle from './UnderlinedTaskTitle';
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

const localMessageIds = messageIds.filters.task;

const DisplayTask = ({ filter }: DisplayTaskProps): JSX.Element => {
  const { orgId } = useNumericRouteParams();
  const { config } = filter;
  const op = filter.op || OPERATION.ADD;

  const tf = getTaskTimeFrameWithConfig(config);
  const timeFrame = getTimeFrameWithConfig(tf);

  const matching = getMatchingWithConfig(config?.matching);

  return (
    <Msg
      id={localMessageIds.inputString}
      values={{
        addRemoveSelect: <UnderlinedMsg id={messageIds.operators[op]} />,
        campaignSelect: config.task ? null : (
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
        taskSelect: config.task ? (
          <UnderlinedTaskTitle orgId={orgId} taskId={config.task} />
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
