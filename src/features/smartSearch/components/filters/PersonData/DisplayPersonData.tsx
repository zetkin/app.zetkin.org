import { Msg } from 'core/i18n';
import {
  DATA_FIELD,
  OPERATION,
  PersonDataFilterConfig,
  SmartSearchFilterWithId,
} from 'features/smartSearch/components/types';

import messageIds from 'features/smartSearch/l10n/messageIds';
import StyledMsg from '../../StyledMsg';
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
            field: <StyledMsg id={localMessageIds.fieldSelect[c]} />,
            value: (
              <StyledMsg
                id={localMessageIds.styleMe}
                values={{ styleMe: fields[c] || '' }}
              />
            ),
          }}
        />
      );
      if (criteriaString) {
        criteriaString = (
          <StyledMsg
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
        addRemoveSelect: <StyledMsg id={localMessageIds.addRemoveSelect[op]} />,
        criteria: getCriteriaString(),
      }}
    />
  );
};

export default DisplayPersonData;
