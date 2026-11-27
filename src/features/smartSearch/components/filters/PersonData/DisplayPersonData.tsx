import { canUseIsSet } from './utils';
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

  const getCriteriaString = () => {
    let existing;
    let criteriaString: JSX.Element | null = null;
    Object.values(DATA_FIELD).forEach((c) => {
      if (!(c in fields)) {
        return;
      }
      const field = fields[c];
      const fieldMsg = <UnderlinedMsg id={localMessageIds.fieldSelect[c]} />;

      // An empty value means "is set" (see ./utils.ts)
      if (field === '' && canUseIsSet(c)) {
        existing = (
          <Msg id={localMessageIds.fieldIsSet} values={{ field: fieldMsg }} />
        );
      } else if (field) {
        existing = (
          <Msg
            id={localMessageIds.fieldMatches}
            values={{
              field: fieldMsg,
              value: (
                <UnderlinedText
                  text={
                    c === DATA_FIELD.GENDER
                      ? messages.genders[(field as Gender) || 'unknown']()
                      : field
                  }
                />
              ),
            }}
          />
        );
      } else {
        return;
      }

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
