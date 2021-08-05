import { FormattedMessage as Msg } from 'react-intl';
import { Box, Button, Divider, MenuItem, Typography } from '@material-ui/core';
import { FormEvent, useState } from 'react';

import StyledSelect from 'components/smartSearch/inputs/StyledSelect';
import useSmartSearchFilter from 'hooks/useSmartSearchFilter';
import { DefaultFilterConfig, NewSmartSearchFilter, SmartSearchFilterWithId,
    ZetkinSmartSearchFilter } from 'types/smartSearch';

interface AllProps {
    filter:  SmartSearchFilterWithId<DefaultFilterConfig> | NewSmartSearchFilter;
    onSubmit: (filter: ZetkinSmartSearchFilter<DefaultFilterConfig> |
        SmartSearchFilterWithId<DefaultFilterConfig>) => void;
    onDelete: (filter: SmartSearchFilterWithId<DefaultFilterConfig>) => void;
    onCancel: () => void;
}

const All = ({ onSubmit, onCancel, onDelete, filter: initialFilter }: AllProps): JSX.Element => {
    const isNewFilter = !('id' in initialFilter);
    const [startWithEveryone, setStartWithEveryone] = useState(!isNewFilter);
    const { filter } = useSmartSearchFilter<DefaultFilterConfig>(initialFilter);

    const handleSubmitFilter = (e: FormEvent) => {
        e.preventDefault();
        if (!isNewFilter === startWithEveryone) { // if there's no change
            onCancel();
        }
        if (!isNewFilter && !startWithEveryone) { // delete exisiting filter
            onDelete(filter as SmartSearchFilterWithId<DefaultFilterConfig>);
        }
        if (isNewFilter && startWithEveryone) { // create new filter
            onSubmit(filter as ZetkinSmartSearchFilter<DefaultFilterConfig>);
        }
    };

    return (
        <form onSubmit={ e => handleSubmitFilter(e) }>
            <Typography style={{ lineHeight: 'unset', marginBottom: '2rem' }} variant="h4">
                <Msg
                    id="misc.smartSearch.all.inputString"
                    values={{
                        startWithSelect: (
                            // convert numbers to boolean since MenuItem cannot take boolean as props
                            <StyledSelect onChange={ e => setStartWithEveryone(!!e.target.value) }
                                value={ +startWithEveryone }>
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

export default All;
