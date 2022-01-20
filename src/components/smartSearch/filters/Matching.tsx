import { FormattedMessage as Msg } from 'react-intl';
import { useEffect, useState } from 'react';
import { MenuItem, Typography } from '@material-ui/core';

import { getMatchingWithConfig } from '../utils';

import { MATCHING } from 'types/smartSearch';

import StyledNumberInput from '../inputs/StyledNumberInput';
import StyledSelect from '../inputs/StyledSelect';

interface MatchingProps {
    onChange: (range: {max?: number; min?: number}) => void;
    filterConfig: {max?: number; min?: number};
    options?: MATCHING[];
}

const DEFAULT_MIN = 1;
const DEFAULT_MAX = 5;

const Matching = ({ onChange, filterConfig, options = Object.values(MATCHING) }: MatchingProps): JSX.Element => {
    const matching = getMatchingWithConfig(filterConfig);

    const option = matching.option;
    const [max, setMax] = useState(matching.config?.max || null);
    const [min, setMin] = useState(matching.config?.min || null);

    useEffect(() => {
        if (option == MATCHING.MAX) {
            onChange({ max: max, min: undefined });
        }
        else if (option == MATCHING.MIN) {
            onChange({ max: undefined, min: min });
        }
    }, [min, max, onChange, option]);

    const setOption = (newOption : MATCHING) => {
        if (newOption == MATCHING.ONCE) {
            onChange({ max: undefined, min: undefined });
        }
        else if (newOption == MATCHING.MAX) {
            onChange({ max: DEFAULT_MAX, min: undefined });
        }
        else if (newOption == MATCHING.MIN) {
            onChange({ max: undefined, min: 1 });
        }
        else if (newOption == MATCHING.BETWEEN) {
            onChange({ max: DEFAULT_MAX, min: DEFAULT_MIN });
        }
    };

    return (
        <Typography display="inline" variant="h4">
            <Msg id={ `misc.smartSearch.matching.edit.${option}` } values={{
                matchingSelect: (
                    <StyledSelect
                        onChange={ e => setOption(e.target.value as MATCHING) }
                        value={ option }>
                        { options.map(value => (
                            <MenuItem key={ value } value={ value }>
                                <Msg id={ `misc.smartSearch.matching.matchingSelect.${value}` } />
                            </MenuItem>
                        )) }
                    </StyledSelect>
                ),
                max: max,
                maxInput: (
                    <StyledNumberInput
                        onChange={ (e) => setMax(+e.target.value) }
                        value={ max || DEFAULT_MAX }
                    />
                ),
                min: min,
                minInput: (
                    <StyledNumberInput
                        onChange={ (e) => setMin(+e.target.value) }
                        value={ min || DEFAULT_MIN}
                    />
                ),
            }}
            />
        </Typography>
    );
};

export default Matching;
