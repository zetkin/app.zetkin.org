/* eslint-disable react-hooks/exhaustive-deps */
import { FormattedMessage as Msg } from 'react-intl';
import { Box, Button, Divider, MenuItem, Typography } from '@material-ui/core';
import { FormEvent, useEffect, useState } from 'react';

import StyledSelect from '../../inputs/StyledSelect';
import StyledTextInput from '../../inputs/StyledTextInput';
import useSmartSearchFilter from 'hooks/useSmartSearchFilter';
import { DATA_FIELD , NewSmartSearchFilter, OPERATION, PersonDataFilterConfig, SmartSearchFilterWithId, ZetkinSmartSearchFilter } from 'types/smartSearch';

// set default select option
const REMOVE_FIELD = 'none';

interface PersonDataProps {
    filter:  SmartSearchFilterWithId<PersonDataFilterConfig> |  NewSmartSearchFilter ;
    onSubmit: (filter: SmartSearchFilterWithId<PersonDataFilterConfig> | ZetkinSmartSearchFilter<PersonDataFilterConfig>) => void;
    onCancel: () => void;
}

interface Criterion {
    field: DATA_FIELD;
    value: string;
}

const PersonData = ({ onSubmit, onCancel, filter: initialFilter }: PersonDataProps): JSX.Element => {
    const { filter, setConfig, setOp } = useSmartSearchFilter<PersonDataFilterConfig>(initialFilter, { fields: { first_name: '' } });

    const ALL_FIELDS = Object.values(DATA_FIELD);

    // check which fields are present in the filter config, and load their key-value pairs into an array
    const initialCriteria = ALL_FIELDS
        .filter(f => f in filter.config.fields)
        .map(f => ({ field: f, value: filter.config.fields[f] || '' }));

    const [criteria, setCriteria] = useState<Criterion[]>(initialCriteria);

    // check that there are no blank fields before submitting
    const isSubmittable = criteria.every(c => c.value.length);

    useEffect(() => {
        const fields = criteria.reduce((acc, c) => {
            return { ...acc, [c.field]: c.value };
        }, {});
        setConfig({
            ...filter.config,
            fields,
        });
    }, [criteria]);

    const addCriteria = (field: string) => {
        if (field !== REMOVE_FIELD) {
            setCriteria([...criteria, { field: field as DATA_FIELD, value: '' }]);
        }
    };

    // event handlers
    const handleAddFilter = (e: FormEvent) => {
        e.preventDefault();
        onSubmit(filter);
    };

    const handleValueChange = (value: string, c: Criterion) => {
        setCriteria(criteria.map(criterion => {
            return criterion.field === c.field ?
                { ...criterion, value } : criterion;
        }));
    };

    const handleSelectChange = (field: string, c: Criterion) => {
        if (field === REMOVE_FIELD) {
            setCriteria(criteria.filter(criterion => criterion.field !== c.field));
        }
        else {
            setCriteria(criteria.map((criterion => {
                return criterion.field === c.field ?
                    { ...criterion, field: field as DATA_FIELD } : criterion;
            })));
        }
    };

    // message components
    const addRemoveSelect = (
        <StyledSelect onChange={ e => setOp(e.target.value as OPERATION) }
            value={ filter.op }>
            <MenuItem key={ OPERATION.ADD } value={ OPERATION.ADD }>
                <Msg id="misc.smartSearch.person_data.addRemoveSelect.add"/>
            </MenuItem>
            <MenuItem key={ OPERATION.SUB } value={ OPERATION.SUB }>
                <Msg id="misc.smartSearch.person_data.addRemoveSelect.sub" />
            </MenuItem>
        </StyledSelect>
    );

    const getCriteriaString = () => {
        let existing;
        let criteriaString: JSX.Element | null = null;
        criteria.forEach(c => {
            const options = ALL_FIELDS.filter(f => f === c.field || !criteria.map(c => c.field).includes(f));
            existing = (<Msg
                id="misc.smartSearch.criteria.criterion"
                values={{
                    field: (
                        <StyledSelect
                            onChange={ e => handleSelectChange(e.target.value, c) }
                            value={ c.field }>
                            { criteria.length > 1 && (
                                <MenuItem key={ REMOVE_FIELD } value={ REMOVE_FIELD }>
                                    <Msg id="misc.smartSearch.criteria.criteriaSelect.remove" />
                                </MenuItem>
                            ) }
                            { options.map(o => (
                                <MenuItem key={ o } value={ o }>
                                    <Msg
                                        id={ `misc.smartSearch.criteria.criteriaSelect.${o}` }
                                    />
                                </MenuItem>
                            )) }
                        </StyledSelect>
                    ),
                    value: (
                        <StyledTextInput
                            inputString={ c.value } // for dynamic width
                            onChange={ e => handleValueChange(e.target.value, c) }
                            value={ c.value }
                        />
                    ),
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
        <form onSubmit={ e => handleAddFilter(e) }>
            <Typography style={{ lineHeight: 'unset', marginBottom: '2rem' }} variant="h4">
                <Msg id="misc.smartSearch.person_data.inputString" values={{
                    addRemoveSelect,
                    criteria: (
                        <>
                            { getCriteriaString() }
                            { criteria.length < ALL_FIELDS.length && (
                                <StyledSelect
                                    onChange={ e => addCriteria(e.target.value) }
                                    value={ REMOVE_FIELD }>
                                    <MenuItem
                                        key={ REMOVE_FIELD }
                                        value={ REMOVE_FIELD }>
                                        <Msg id="misc.smartSearch.person_data.ellipsis"/>
                                    </MenuItem>
                                    { ALL_FIELDS.filter(f => !criteria.map(c => c.field).includes(f)).map(o => (
                                        <MenuItem key={ o } value={ o }>
                                            <Msg
                                                id={ `misc.smartSearch.criteria.criteriaSelect.${o}` }
                                            />
                                        </MenuItem>
                                    )) }
                                </StyledSelect>
                            ) }
                        </>
                    ),
                }}
                />
            </Typography>
            <Divider />
            <Typography variant="h6">
                <Msg id="misc.smartSearch.headers.examples"/>
            </Typography>
            <Typography color="textSecondary">
                <Msg id="misc.smartSearch.person_data.examples.one"/>
                <br />
                <Msg id="misc.smartSearch.person_data.examples.two"/>
            </Typography>

            <Box display="flex" justifyContent="flex-end" m={ 1 } style={{ gap: '1rem' }}>
                <Button color="primary" onClick={ onCancel }>
                    <Msg id="misc.smartSearch.buttonLabels.cancel"/>
                </Button>
                <Button color="primary" disabled={ !isSubmittable } type="submit" variant="contained">
                    { ('id' in filter) ? <Msg id="misc.smartSearch.buttonLabels.edit"/>: <Msg id="misc.smartSearch.buttonLabels.add"/> }
                </Button>
            </Box>
        </form>
    );
};

export default PersonData;
