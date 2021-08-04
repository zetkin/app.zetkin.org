import { FormattedMessage as Msg } from 'react-intl';

import { OPERATION, SmartSearchFilterWithId, UserFilterConfig } from 'types/smartSearch';

interface DisplayUserProps {
    filter: SmartSearchFilterWithId<UserFilterConfig>;
}

const DisplayUser = ({ filter }: DisplayUserProps) : JSX.Element => {
    const { config: { is_user } } = filter;
    const op = filter.op || OPERATION.ADD;

    return (
        <Msg
            id="misc.smartSearch.user.inputString"
            values={{
                addRemoveSelect: (
                    <Msg id={ `misc.smartSearch.user.addRemoveSelect.${op}` }/>
                ),
                connectedSelect: (
                    <Msg id={ `misc.smartSearch.user.connectedSelect.${is_user}` }/>
                ) }}
        />
    );
};

export default DisplayUser;
