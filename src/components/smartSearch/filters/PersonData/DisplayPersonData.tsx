import { FormattedMessage as Msg } from 'react-intl';

import { DATA_FIELD, OPERATION, PersonDataFilterConfig, SmartSearchFilterWithId } from 'types/smartSearch';

interface DisplayPersonDataProps {
    filter: SmartSearchFilterWithId<PersonDataFilterConfig>;
}

const DisplayPersonData = ({ filter }: DisplayPersonDataProps) : JSX.Element => {
    const { config: { fields } } = filter;
    const op = filter.op || OPERATION.ADD;

    const criteria = Object.values(DATA_FIELD).filter(f => f in fields);

    const getCriteriaString = () => {
        let existing;
        let criteriaString: JSX.Element | null = null;
        criteria.forEach(c => {
            existing = (
                <Msg
                    id="misc.smartSearch.criteria.criterion"
                    values={{
                        field: (
                            <Msg id={ `misc.smartSearch.criteria.criteriaSelect.${c}` }/>
                        ),
                        value: fields[c],
                    }}
                />);
            if (criteriaString) {
                criteriaString = (<Msg
                    id="misc.smartSearch.criteria.tuple"
                    values={{
                        first: criteriaString,
                        second: existing,
                    }}
                />);
            }
            else {
                criteriaString = existing;
            }
        });
        return criteriaString;
    };

    return (
        <Msg
            id="misc.smartSearch.person_data.inputString"
            values={{
                addRemoveSelect: (
                    <Msg id={ `misc.smartSearch.person_data.addRemoveSelect.${op}` }/>
                ),
                criteria: getCriteriaString(),
            }}
        />
    );
};

export default DisplayPersonData;
