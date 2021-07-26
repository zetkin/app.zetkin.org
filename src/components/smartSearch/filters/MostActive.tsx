import { FormEvent } from 'react';
import { FormattedMessage as Msg } from 'react-intl';
import { Box, Button, Divider, MenuItem, Typography } from '@material-ui/core';

import StyledNumberInput from '../inputs/StyledNumberInput';
import StyledSelect from '../inputs/StyledSelect';
import TimeFrame from './TimeFrame';
import useSmartSearchFilter from 'hooks/useSmartSearchFilter';
import { MostActiveFilterConfig, NewSmartSearchFilter, OPERATION, SmartSearchFilterWithId, ZetkinSmartSearchFilter } from 'types/smartSearch';

interface MostActiveProps {
    filter:  SmartSearchFilterWithId<MostActiveFilterConfig> |  NewSmartSearchFilter ;
    onSubmit: (filter: SmartSearchFilterWithId<MostActiveFilterConfig> | ZetkinSmartSearchFilter<MostActiveFilterConfig>) => void;
    onCancel: () => void;
}

const MostActive = ({ onSubmit, onCancel, filter: initialFilter }: MostActiveProps): JSX.Element => {
    const { filter, setConfig, setOp } = useSmartSearchFilter<MostActiveFilterConfig>(initialFilter);

    const handleAddFilter = (e: FormEvent) => {
        e.preventDefault();
        onSubmit(filter);
    };

    const handleTimeFrameChange = (range: {after?: string; before?: string}) => {
        // Add time frame to config
        setConfig({
            ...filter.config,
            ...range,
        });
    };

    return (
        <form onSubmit={ e => handleAddFilter(e) }>
            <Typography style={{ lineHeight: 'unset', marginBottom: '2rem' }} variant="h4">
                <Msg id="misc.smartSearch.most_active.inputString" values={{
                    addRemoveSelect: (
                        <StyledSelect onChange={ e => setOp(e.target.value as OPERATION) }
                            value={ filter.op }>
                            <MenuItem key={ OPERATION.ADD } value={ OPERATION.ADD }>
                                <Msg id="misc.smartSearch.most_active.addRemoveSelect.add"/>
                            </MenuItem>
                            <MenuItem key={ OPERATION.SUB } value={ OPERATION.SUB }>
                                <Msg id="misc.smartSearch.most_active.addRemoveSelect.sub" />
                            </MenuItem>
                        </StyledSelect>
                    ),
                    numPeople: filter.config?.size,
                    numPeopleSelect: (
                        <StyledNumberInput
                            defaultValue={ filter.config?.size }
                            onChange={ (e) => {
                                setConfig({
                                    ...filter.config,
                                    size: +e.target.value,
                                });
                            } }
                        />
                    ),
                    timeFrame: (
                        <TimeFrame filterConfig={{
                            ...(filter?.config?.after && { after: filter.config.after }),
                            ...(filter?.config?.before && { before: filter.config.before }) }} onChange={ handleTimeFrameChange }
                        />
                    ),
                }}
                />
            </Typography>
            <Divider />
            <Typography variant="h6">
                <Msg id="misc.smartSearch.headers.examples"/>
            </Typography>
            <Typography color="textSecondary">
                <Msg id="misc.smartSearch.most_active.examples.one"/>
                <br />
                <Msg id="misc.smartSearch.most_active.examples.two"/>
            </Typography>

            <Box display="flex" justifyContent="flex-end" m={ 1 } style={{ gap: '1rem' }}>
                <Button color="primary" onClick={ onCancel }>
                    <Msg id="misc.smartSearch.buttonLabels.cancel"/>
                </Button>
                <Button color="primary" type="submit" variant="contained">
                    { ('id' in filter) ? <Msg id="misc.smartSearch.buttonLabels.edit"/>: <Msg id="misc.smartSearch.buttonLabels.add"/> }
                </Button>
            </Box>
        </form>
    );
};

export default MostActive;
