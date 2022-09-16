import { getQuantityWithConfig } from 'features/smartSearch/components/utils';
import { FormattedMessage as Msg } from 'react-intl';

import {
  OPERATION,
  RandomFilterConfig,
  SmartSearchFilterWithId,
} from 'features/smartSearch/components/types';

interface DisplayRandomProps {
  filter: SmartSearchFilterWithId<RandomFilterConfig>;
}

const DisplayRandom = ({ filter }: DisplayRandomProps): JSX.Element => {
  const op = filter.op || OPERATION.ADD;
  const { quantity, size } = getQuantityWithConfig(filter.config.size);

  return (
    <Msg
      id="misc.smartSearch.random.inputString"
      values={{
        addRemoveSelect: (
          <Msg id={`misc.smartSearch.random.addRemoveSelect.${op}`} />
        ),
        quantity: (
          <Msg
            id={`misc.smartSearch.quantity.preview.${quantity}`}
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
