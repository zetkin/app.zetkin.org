import { getQuantityWithConfig } from 'features/smartSearch/components/utils';

import {
  OPERATION,
  RandomFilterConfig,
  SmartSearchFilterWithId,
} from 'features/smartSearch/components/types';

import messageIds from 'features/smartSearch/l10n/messageIds';
import { Msg } from 'core/i18n';
const localMessageIds = messageIds.filters.random;

interface DisplayRandomProps {
  filter: SmartSearchFilterWithId<RandomFilterConfig>;
}

const DisplayRandom = ({ filter }: DisplayRandomProps): JSX.Element => {
  const op = filter.op || OPERATION.ADD;
  const { quantity, size } = getQuantityWithConfig(filter.config.size);

  return (
    <Msg
      id={localMessageIds.inputString}
      values={{
        addRemoveSelect: <Msg id={localMessageIds.addRemoveSelect[op]} />,
        quantity: (
          <Msg
            id={messageIds.quantity.preview[quantity]}
            values={{
              people: size,
            }}
          />
        ),
      }}
    />
  );
};

export default DisplayRandom;
