import { getTimeFrameWithConfig } from '../../utils';
import {
  MostActiveFilterConfig,
  OPERATION,
  SmartSearchFilterWithId,
} from 'features/smartSearch/components/types';

import messageIds from 'features/smartSearch/l10n/messageIds';
import { Msg } from 'core/i18n';
const localMessageIds = messageIds.filters.mostActive;

interface DisplayMostActiveProps {
  filter: SmartSearchFilterWithId<MostActiveFilterConfig>;
}

const DisplayMostActive = ({ filter }: DisplayMostActiveProps): JSX.Element => {
  const { config } = filter;
  const op = filter.op || OPERATION.ADD;
  const { timeFrame, after, before, numDays } = getTimeFrameWithConfig({
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

export default DisplayMostActive;
