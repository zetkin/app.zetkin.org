import { FormattedMessage as Msg } from 'react-intl';

import { getTimeFrameWithConfig } from '../../utils';
import { MostActiveFilterConfig, OPERATION, SmartSearchFilterWithId } from 'types/smartSearch';

interface DisplayMostActiveProps {
    filter: SmartSearchFilterWithId<MostActiveFilterConfig>;
}

const DisplayMostActive = ({ filter }: DisplayMostActiveProps) : JSX.Element => {
    const { config } = filter;
    const op = filter.op || OPERATION.ADD;
    const { timeFrame, after, before, numDays } = getTimeFrameWithConfig({ after: config.after, before: config.before });

    return (
        <Msg
            id="misc.smartSearch.most_active.inputString"
            values={{
                addRemoveSelect: (
                    <Msg id={ `misc.smartSearch.most_active.addRemoveSelect.${op}` }/>
                ),
                numPeople: config.size,
                numPeopleSelect: config.size,
                timeFrame: (
                    <Msg
                        id={ `misc.smartSearch.timeFrame.preview.${timeFrame}` }
                        values={{
                            afterDate: (
                                after?.toISOString().slice(0,10)
                            ),
                            beforeDate: (
                                before?.toISOString().slice(0, 10)
                            ),
                            days: numDays,
                        }}
                    />
                ) }}
        />
    );
};

export default DisplayMostActive;
