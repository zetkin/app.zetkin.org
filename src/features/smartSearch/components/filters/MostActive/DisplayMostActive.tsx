import { getTimeFrameWithConfig } from '../../utils';
import {
  MostActiveFilterConfig,
  OPERATION,
  SmartSearchFilterWithId,
} from 'features/smartSearch/components/types';

import DisplayTimeFrame from '../DisplayTimeFrame';
import { Msg } from 'core/i18n';

import messageIds from 'features/smartSearch/l10n/messageIds';
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
        addRemoveSelect: <Msg id={localMessageIds.addRemoveSelect[op]} />,
        numPeople: config.size,
        numPeopleSelect: config.size || 0,
        timeFrame: <DisplayTimeFrame config={timeFrame} />,
      }}
    />
  );
};

export default DisplayMostActive;
