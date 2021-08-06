import { FormattedMessage as Msg } from 'react-intl';
import { Box, Button, Divider, MenuItem, Typography } from '@material-ui/core';
import { FormEvent, useState } from 'react';

import StyledSelect from 'components/smartSearch/inputs/StyledSelect';

interface StartsWithProps {
    startsWithAll: boolean;
    onSubmit: (startsWithAll: boolean) => void;
    onCancel: () => void;
}

const StartsWith = ({ startsWithAll, onSubmit, onCancel }: StartsWithProps): JSX.Element => {
    const [shouldStartWithAll, setShouldStartWithAll] = useState(startsWithAll);

    const handleSubmitFilter = (e: FormEvent) => {
        e.preventDefault();
        onSubmit(shouldStartWithAll);
    };

    return (
        <form onSubmit={ e => handleSubmitFilter(e) }>
            <Typography style={{ lineHeight: 'unset', marginBottom: '2rem' }} variant="h4">
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
            </Typography>
            <Divider />
            <Box display="flex" justifyContent="flex-end" m={ 1 } style={{ gap: '1rem' }}>
                <Button color="primary" onClick={ onCancel }>
                    <Msg id="misc.smartSearch.buttonLabels.cancel"/>
                </Button>
                <Button color="primary" type="submit" variant="contained">
                    <Msg id="misc.smartSearch.buttonLabels.add"/>
                </Button>
            </Box>
        </form>
    );
};

export default StartsWith;
