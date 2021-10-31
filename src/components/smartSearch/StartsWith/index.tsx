import { MenuItem } from '@mui/material';
import { FormattedMessage as Msg } from 'react-intl';
import { FormEvent, useState } from 'react';

import FilterForm from '../FilterForm';
import StyledSelect from 'components/smartSearch/inputs/StyledSelect';

interface StartsWithProps {
    startsWithAll: boolean;
    onSubmit: (startsWithAll: boolean) => void;
    onCancel: () => void;
}

const StartsWith = ({ startsWithAll, onSubmit, onCancel }: StartsWithProps): JSX.Element => {
    const [shouldStartWithAll, setShouldStartWithAll] = useState(startsWithAll);

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        onSubmit(shouldStartWithAll);
    };

    return (
        <FilterForm
            onCancel={ onCancel }
            onSubmit={ e => handleSubmit(e) }
            renderSentence={ () => (
                <Msg
                    id="misc.smartSearch.all.inputString"
                    values={{
                        startWithSelect: (
                            // convert numbers to boolean since MenuItem cannot take boolean as props
                            <StyledSelect onChange={ e => setShouldStartWithAll(!!e.target.value) }
                                value={ +shouldStartWithAll }>
                                <MenuItem key={ 1 } value={ 1 }>
                                    <Msg id="misc.smartSearch.all.startWithSelect.true"/>
                                </MenuItem>
                                <MenuItem key={ 0 } value={ 0 }>
                                    <Msg id="misc.smartSearch.all.startWithSelect.false" />
                                </MenuItem>
                            </StyledSelect>
                        ),
                    }}
                />
            ) }
        />
    );
};

export default StartsWith;
