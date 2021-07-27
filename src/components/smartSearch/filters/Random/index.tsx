import { FormattedMessage as Msg } from 'react-intl';
import { Box, Button, Divider, MenuItem, Typography } from '@material-ui/core';
import { FormEvent, useEffect, useState } from 'react';

import { getQuantityWithConfig } from 'components/smartSearch/utils';
import StyledNumberInput from '../../inputs/StyledNumberInput';
import StyledSelect from '../../inputs/StyledSelect';
import useSmartSearchFilter from 'hooks/useSmartSearchFilter';
import { NewSmartSearchFilter , OPERATION, QUANTITY, RandomFilterConfig, SmartSearchFilterWithId, ZetkinSmartSearchFilter } from 'types/smartSearch';

const shouldGenerateSeed = (
    filter: ZetkinSmartSearchFilter<RandomFilterConfig>,
    initialFilter: SmartSearchFilterWithId<RandomFilterConfig>) => {
    const isInt = (num: number) => num % 1 === 0;
    const currentSize = filter.config.size;
    const initialSize = initialFilter.config.size;
    return (
        (isInt(currentSize) !== isInt(initialSize)) ||
        (isInt(currentSize) && isInt(initialSize) && currentSize > initialSize) ||
        (!isInt(currentSize) && !isInt(initialSize) && currentSize > initialSize)
    );
};

interface RandomProps {
    filter:  SmartSearchFilterWithId<RandomFilterConfig> |  NewSmartSearchFilter ;
    onSubmit: (filter: SmartSearchFilterWithId<RandomFilterConfig> | ZetkinSmartSearchFilter<RandomFilterConfig>) => void;
    onCancel: () => void;
}

const Random = ({ onSubmit, onCancel, filter: initialFilter }: RandomProps): JSX.Element => {
    const { filter, setConfig, setOp } = useSmartSearchFilter<RandomFilterConfig>(initialFilter, { seed: Math.random().toString(), size : 0.5 });
    const quantity = getQuantityWithConfig(filter.config.size);
    const [selected, setSelected] = useState(quantity.quantity);
    const [quantityDisplay, setQuantityDisplay] = useState(quantity.size);

    useEffect(() => {
        if (selected === QUANTITY.INT) {
            setConfig({
                ...filter.config,
                size: quantityDisplay,
            });
        }
        else {
            setConfig({
                ...filter.config,
                size: quantityDisplay / 100,
            });
        }
    }, [selected, quantityDisplay]); // eslint-disable-line react-hooks/exhaustive-deps

    const handleAddFilter = (e: FormEvent) => {
        e.preventDefault();
        const newSeed = 'config' in initialFilter && shouldGenerateSeed(filter, initialFilter) ?
            Math.random().toString() :
            filter.config.seed;
        onSubmit({ ...filter, config: { ...filter.config, seed: newSeed } } );
    };

    return (
        <form onSubmit={ e => handleAddFilter(e) }>
            <Typography style={{ lineHeight: 'unset', marginBottom: '2rem' }} variant="h4">
                <Msg id="misc.smartSearch.random.inputString" values={{
                    addRemoveSelect: (
                        <StyledSelect onChange={ e => setOp(e.target.value as OPERATION) }
                            value={ filter.op }>
                            <MenuItem key={ OPERATION.ADD } value={ OPERATION.ADD }>
                                <Msg id="misc.smartSearch.random.addRemoveSelect.add"/>
                            </MenuItem>
                            <MenuItem key={ OPERATION.SUB } value={ OPERATION.SUB }>
                                <Msg id="misc.smartSearch.random.addRemoveSelect.sub" />
                            </MenuItem>
                        </StyledSelect>
                    ),
                    numPeople: filter.config?.size,
                    quantity: (
                        <Msg
                            id={ `misc.smartSearch.quantity.edit.${selected}` }
                            values={{
                                numInput: (
                                    <StyledNumberInput
                                        inputProps={{
                                            min: '1', ...selected === QUANTITY.PERCENT && { max: '99' },
                                        }}
                                        onChange={ (e) => {
                                            if (selected === QUANTITY.PERCENT && +e.target.value > 99) {
                                                return;
                                            }
                                            setQuantityDisplay(+e.target.value);
                                        } }
                                        value={ quantityDisplay }
                                    />
                                ),
                                numPeople: filter.config.size,
                                quantitySelect: (
                                    <StyledSelect
                                        onChange={ e => {
                                            setSelected(e.target.value as QUANTITY);
                                        } }
                                        SelectProps={{ renderValue: function getLabel(value) {
                                            return (
                                                <Msg
                                                    id={ `misc.smartSearch.quantity.quantitySelectLabel.${value}` }
                                                    values={{
                                                        people: quantityDisplay,
                                                    }}
                                                />);
                                        } }}
                                        value={ selected }>
                                        { Object.values(QUANTITY).map(q => (
                                            <MenuItem key={ q } value={ q }>
                                                <Msg id={ `misc.smartSearch.quantity.quantitySelectOptions.${q}` }/>
                                            </MenuItem>
                                        )) }
                                    </StyledSelect>
                                ),
                            }}
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
                <Msg id="misc.smartSearch.random.examples.one"/>
                <br />
                <Msg id="misc.smartSearch.random.examples.two"/>
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

export default Random;
