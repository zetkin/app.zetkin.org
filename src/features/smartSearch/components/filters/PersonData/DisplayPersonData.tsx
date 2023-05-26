import { Msg } from 'core/i18n';
import {
  DATA_FIELD,
  OPERATION,
  PersonDataFilterConfig,
  SmartSearchFilterWithId,
} from 'features/smartSearch/components/types';

import messageIds from 'features/smartSearch/l10n/messageIds';
import UnderlinedMsg from '../../UnderlinedMsg';
import UnderlinedText from '../../UnderlinedText';
const localMessageIds = messageIds.filters.personData;

interface DisplayPersonDataProps {
  filter: SmartSearchFilterWithId<PersonDataFilterConfig>;
}

const DisplayPersonData = ({ filter }: DisplayPersonDataProps): JSX.Element => {
  const {
    config: { fields },
  } = filter;
  const op = filter.op || OPERATION.ADD;

  const criteria = Object.values(DATA_FIELD).filter((f) => f in fields);

  const getCriteriaString = () => {
    let existing;
    let criteriaString: JSX.Element | null = null;
    criteria.forEach((c) => {
      existing = (
        <Msg
          id={localMessageIds.fieldMatches}
          values={{
            field: <UnderlinedMsg id={localMessageIds.fieldSelect[c]} />,
            value: <UnderlinedText text={fields[c] || ''} />,
          }}
        />
      );
      if (criteriaString) {
        criteriaString = (
          <UnderlinedMsg
            id={localMessageIds.fieldTuple}
            values={{
              first: criteriaString,
              second: existing,
            }}
          />
        );
      } else {
        criteriaString = existing;
      }
    });
    return criteriaString;
  };

  return (
    <Msg
      id={localMessageIds.inputString}
      values={{
        addRemoveSelect: (
          <UnderlinedMsg id={messageIds.addLimitRemoveSelect[op]} />
        ),
        criteria: getCriteriaString(),
      }}
    />
  );
};

export default DisplayPersonData;
