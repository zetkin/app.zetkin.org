/* eslint-disable react-hooks/exhaustive-deps */
import { FormattedMessage as Msg } from 'react-intl';
import { useQuery } from 'react-query';
import { useRouter } from 'next/router';
import { Box, Button, Divider, MenuItem, Typography } from '@material-ui/core';
import { FormEvent, useEffect, useState } from 'react';

import getTags from 'fetching/getTags';
import StyledNumberInput from '../../inputs/StyledNumberInput';
import StyledSelect from '../../inputs/StyledSelect';
import StyledTagSelect from 'components/smartSearch/inputs/StyledTagSelect';
import useSmartSearchFilter from 'hooks/useSmartSearchFilter';
import { ZetkinTag } from 'types/zetkin';
import { CONDITION_OPERATOR, NewSmartSearchFilter, OPERATION, PersonTagsFilterConfig,
    SmartSearchFilterWithId, ZetkinSmartSearchFilter } from 'types/smartSearch';

const MIN_MATCHING = 'min_matching';

interface PersonTagsProps {
    filter:  SmartSearchFilterWithId<PersonTagsFilterConfig> | NewSmartSearchFilter ;
    onSubmit: (
        filter: SmartSearchFilterWithId<PersonTagsFilterConfig> |
        ZetkinSmartSearchFilter<PersonTagsFilterConfig>
        ) => void;
    onCancel: () => void;
}

const PersonTags = (
    { onSubmit, onCancel, filter: initialFilter }: PersonTagsProps,
): JSX.Element => {
    const { orgId } = useRouter().query;
    const tagsQuery = useQuery(['tags', orgId], getTags(orgId as string));
    const tags = tagsQuery?.data || [];

    const { filter, setConfig, setOp } = useSmartSearchFilter<PersonTagsFilterConfig>(
        initialFilter, {
            condition: CONDITION_OPERATOR.ALL,
            tags: [],
        });

    //keep minMatching in state so last value is saved even when removed from config
    const [minMatching, setMinMatching] = useState(filter.config.min_matching || 1);

    useEffect(() => {
        if (filter.config.condition === CONDITION_OPERATOR.ANY)
            setConfig({ ...filter.config, min_matching: minMatching });
    }, [minMatching]);

    const availableTags = tags.filter(t => !filter.config.tags.includes(t.id));

    const selected = filter.config.min_matching ?
        MIN_MATCHING : filter.config.condition;

    // only submit if at least one tag has been added
    const submittable = !!filter.config.tags.length;

    // event handlers
    const handleAddFilter = (e: FormEvent) => {
        e.preventDefault();
        onSubmit(filter);
    };

    const handleConditionChange = (conditionValue: string) => {
        if (conditionValue === MIN_MATCHING) {
            setConfig({
                ...filter.config,
                condition: CONDITION_OPERATOR.ANY,
                min_matching: minMatching,
            });
        }
        else {
            setConfig({
                ...filter.config,
                condition: conditionValue as CONDITION_OPERATOR,
                min_matching: undefined,
            });
        }
    };

    const handleTagChange = (tags: ZetkinTag[]) => {
        setConfig({ ...filter.config, tags: tags.map(t => t.id) });
    };

    return (
        <form onSubmit={ e => handleAddFilter(e) }>
            <Typography style={{ lineHeight: 'unset', marginBottom: '2rem' }} variant="h4">
                <Msg id="misc.smartSearch.person_tags.inputString" values={{
                    addRemoveSelect: (
                        <StyledSelect onChange={ e => setOp(e.target.value as OPERATION) }
                            value={ filter.op }>
                            { Object.values(OPERATION).map(o => (
                                <MenuItem key={ o } value={ o }>
                                    <Msg id={ `misc.smartSearch.person_tags.addRemoveSelect.${o}` }/>
                                </MenuItem>
                            )) }
                        </StyledSelect>
                    ),
                    condition: (
                        <Msg
                            id={ `misc.smartSearch.condition.edit.${selected}` }
                            values={{
                                conditionSelect: (
                                    <StyledSelect
                                        onChange={ e => handleConditionChange(e.target.value) }
                                        value={ selected }>
                                        { Object.values(CONDITION_OPERATOR).map(o => (
                                            <MenuItem key={ o } value={ o }>
                                                <Msg
                                                    id={ `misc.smartSearch.condition.conditionSelect.${o}` }
                                                />
                                            </MenuItem>
                                        )) }
                                        <MenuItem key={ MIN_MATCHING } value={ MIN_MATCHING }>
                                            <Msg
                                                id="misc.smartSearch.condition.conditionSelect.min_matching"
                                            />
                                        </MenuItem>
                                    </StyledSelect>
                                ),
                                minMatchingInput: (
                                    <StyledNumberInput
                                        inputProps={{ max: filter.config.tags.length, min: '1' }}
                                        onChange={ (e) => setMinMatching(+e.target.value) }
                                        value={ minMatching }
                                    />
                                ),
                            }}
                        />
                    ),
                    tags: (
                        <StyledTagSelect
                            getOptionLabel={ t => t.title }
                            onChange={ (_, v) => handleTagChange(v) }
                            options={ availableTags }
                            value={ tags.filter(t => filter.config.tags.includes(t.id)) }
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
                <Msg id="misc.smartSearch.person_tags.examples.one"/>
                <br />
                <Msg id="misc.smartSearch.person_tags.examples.two"/>
            </Typography>

            <Box display="flex" justifyContent="flex-end" m={ 1 } style={{ gap: '1rem' }}>
                <Button color="primary" onClick={ onCancel }>
                    <Msg id="misc.smartSearch.buttonLabels.cancel"/>
                </Button>
                <Button color="primary" disabled={ !submittable } type="submit" variant="contained">
                    { ('id' in filter) ?
                        <Msg id="misc.smartSearch.buttonLabels.edit"/>:
                        <Msg id="misc.smartSearch.buttonLabels.add"/> }
                </Button>
            </Box>
        </form>
    );
};

export default PersonTags;
