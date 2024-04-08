import {
  DATA_FIELD,
  Gender,
  OPERATION,
  PersonDataFilterConfig,
  SmartSearchFilterWithId,
} from 'features/smartSearch/components/types';
import { Msg, useMessages } from 'core/i18n';

import messageIds from 'features/smartSearch/l10n/messageIds';
import UnderlinedMsg from '../../UnderlinedMsg';
import UnderlinedText from '../../UnderlinedText';
const localMessageIds = messageIds.filters.personData;

interface DisplayPersonDataProps {
  filter: SmartSearchFilterWithId<PersonDataFilterConfig>;
}

const DisplayPersonData = ({ filter }: DisplayPersonDataProps): JSX.Element => {
  const messages = useMessages(localMessageIds);
  const {
    config: { fields },
  } = filter;
  const op = filter.op || OPERATION.ADD;

  const criteria = Object.values(DATA_FIELD).filter((f) => f in fields);

  const getCriteriaString = () => {
    let existing;
    let criteriaString: JSX.Element | null = null;
    criteria.forEach((c) => {
      let text: string;
      const field = fields[c];

      if (!field) {
        text = '';
      } else if (c !== DATA_FIELD.GENDER) {
        text = field;
      } else {
        const gender = field as Gender;
        text = messages.genders[gender]();
      }

      existing = (
        <Msg
          id={localMessageIds.fieldMatches}
          values={{
            field: <UnderlinedMsg id={localMessageIds.fieldSelect[c]} />,
            value: <UnderlinedText text={text} />,
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
        addRemoveSelect: <UnderlinedMsg id={messageIds.operators[op]} />,
        criteria: getCriteriaString(),
      }}
    />
  );
};

export default DisplayPersonData;
