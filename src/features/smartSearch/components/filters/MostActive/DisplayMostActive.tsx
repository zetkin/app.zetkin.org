import { getTimeFrameWithConfig } from '../../utils';
import {
  MostActiveFilterConfig,
  OPERATION,
  SmartSearchFilterWithId,
} from 'features/smartSearch/components/types';
import DisplayTimeFrame from '../DisplayTimeFrame';
import { Msg } from 'core/i18n';
import messageIds from 'features/smartSearch/l10n/messageIds';
import UnderlinedMsg from '../../UnderlinedMsg';
const localMessageIds = messageIds.filters.mostActive;

interface DisplayMostActiveProps {
  filter: SmartSearchFilterWithId<MostActiveFilterConfig>;
}

const DisplayMostActive = ({ filter }: DisplayMostActiveProps): JSX.Element => {
  const { config } = filter;
  const op = filter.op || OPERATION.ADD;
  const timeFrame = getTimeFrameWithConfig({
    after: config.after,
    before: config.before,
  });

  return (
    <Msg
      id={localMessageIds.inputString}
      values={{
        addRemoveSelect: <UnderlinedMsg id={messageIds.operators[op]} />,
        numPeople: (
          <UnderlinedMsg
            id={localMessageIds.numPeople}
            values={{ numPeople: config.size }}
          />
        ),
        numPeopleSelect: (
          <UnderlinedMsg
            id={localMessageIds.numPeopleSelect}
            values={{ numPeopleSelect: config.size || 0 }}
          />
        ),
        timeFrame: <DisplayTimeFrame config={timeFrame} />,
      }}
    />
  );
};

export default DisplayMostActive;
