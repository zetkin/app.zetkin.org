/* eslint-disable react-hooks/exhaustive-deps */
import { MenuItem } from '@material-ui/core';
import { FormattedMessage as Msg } from 'react-intl';
import { useQuery } from 'react-query';
import { useRouter } from 'next/router';
import { FormEvent, useEffect, useState } from 'react';

import FilterForm from '../../FilterForm';
import getAllCallAssignments from 'fetching/getAllCallAssignments';
import StyledSelect from '../../inputs/StyledSelect';
import { useGetStandaloneQueries } from 'fetching/getStandaloneQueries';
import useSmartSearchFilter from 'hooks/useSmartSearchFilter';
import {
    NewSmartSearchFilter,
    OPERATION,
    QUERY_TYPE,
    SmartSearchFilterWithId,
    SubQueryFilterConfig,
    ZetkinQuery,
    ZetkinSmartSearchFilter,
} from 'types/smartSearch';

const NO_QUERY_SELECTED = 'none';

interface SubQueryProps {
    filter:  SmartSearchFilterWithId<SubQueryFilterConfig> | NewSmartSearchFilter ;
    onSubmit: (
        filter: SmartSearchFilterWithId<SubQueryFilterConfig> |
        ZetkinSmartSearchFilter<SubQueryFilterConfig>
        ) => void;
    onCancel: () => void;
}

const SubQuery = (
    { onSubmit, onCancel, filter: initialFilter }: SubQueryProps,
): JSX.Element => {
    const { orgId } = useRouter().query;
    const standaloneQuery = useGetStandaloneQueries(orgId as string);
    const standaloneQueries = standaloneQuery?.data || [];
    const assignmentsQuery = useQuery(
        ['assignments', orgId], getAllCallAssignments(orgId as string));
    const assignments = assignmentsQuery?.data || [];

    const targetGroupQueriesWithTitles: ZetkinQuery[] = assignments.map(a => (
        { ...a.target, title: a.title }
    ));

    const purposeGroupQueriesWithTitles: ZetkinQuery[] = assignments.map(a => (
        { ...a.goal, title: a.title }
    ));

    const queries = [
        ...standaloneQueries,
        ...targetGroupQueriesWithTitles,
        ...purposeGroupQueriesWithTitles,
    ];

    const { filter, setOp } = useSmartSearchFilter<SubQueryFilterConfig>(
        initialFilter);

    const [selectedQuery, setSelectedQuery] = useState<ZetkinQuery>();

    useEffect(() => {
        if (queries.length) {
            setSelectedQuery(queries
                .find(q => q.id === filter.config.query_id) ||
                queries[0]);
        }
    }, [standaloneQueries, assignments]);

    const renderedOptions = queries.filter(q => q.type === selectedQuery?.type);

    const submittable = !!queries.length;

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (selectedQuery) {
            onSubmit({
                ...filter,
                config: {
                    query_id: selectedQuery.id,
                },
            });
        }
    };

    const handleTypeChange = (type: QUERY_TYPE) => {
        //try and find a title match first when switching between target and purpose types
        let newQuery = queries.find(q => q.type === type && selectedQuery?.title === q.title);
        if (!newQuery)
            newQuery = queries.find(q => q.type === type);
        setSelectedQuery(newQuery);
    };

    const handleOptionChange = (option: number) => {
        const newQuery = queries.find(q => q.id === option);
        setSelectedQuery(newQuery);
    };

    return (
        <FilterForm
            disableSubmit={ !submittable }
            onCancel={ onCancel }
            onSubmit={ e => handleSubmit(e) }
            renderExamples={ () => (
                <>
                    <Msg id="misc.smartSearch.sub_query.examples.one"/>
                    <br />
                    <Msg id="misc.smartSearch.sub_query.examples.two"/>
                </>
            ) }
            renderSentence={ () => (
                <Msg
                    id="misc.smartSearch.sub_query.inputString"
                    values={{
                        addRemoveSelect: (
                            <StyledSelect onChange={ e => setOp(e.target.value as OPERATION) }
                                value={ filter.op }>
                                { Object.values(OPERATION).map(o => (
                                    <MenuItem key={ o } value={ o }>
                                        <Msg id={ `misc.smartSearch.call_history.addRemoveSelect.${o}` }/>
                                    </MenuItem>
                                )) }
                            </StyledSelect>
                        ),
                        query: (
                            !selectedQuery ? (
                                <Msg
                                    id="misc.smartSearch.query.edit.none"
                                    values={{
                                        querySelect: (
                                            <StyledSelect
                                                SelectProps={{ renderValue: function getLabel() {
                                                    return (
                                                        <Msg
                                                            id="misc.smartSearch.query.querySelectLabel.none"
                                                        />);
                                                } }}
                                                value={ NO_QUERY_SELECTED }>
                                                <MenuItem
                                                    key={ NO_QUERY_SELECTED }
                                                    value={ NO_QUERY_SELECTED }>
                                                    <Msg
                                                        id="misc.smartSearch.query.querySelectOptions.none"
                                                    />
                                                </MenuItem>
                                            </StyledSelect>
                                        ),
                                    }}
                                />
                            ) :
                                <Msg
                                    id={ `misc.smartSearch.query.edit.${selectedQuery.type}` }
                                    values={{
                                        querySelect: (
                                            <StyledSelect
                                                onChange={ e => handleTypeChange(e.target.value as QUERY_TYPE) }
                                                SelectProps={{ renderValue: function getLabel(value) {
                                                    return (
                                                        <Msg
                                                            id={ `misc.smartSearch.query.querySelectLabel.${value}` }
                                                        />);
                                                } }}
                                                value={ selectedQuery.type }>
                                                { standaloneQueries.length && (
                                                    <MenuItem
                                                        key={ QUERY_TYPE.STANDALONE }
                                                        value={ QUERY_TYPE.STANDALONE }>
                                                        <Msg
                                                            id="misc.smartSearch.query.querySelectOptions.standalone"
                                                        />
                                                    </MenuItem>
                                                ) }
                                                { targetGroupQueriesWithTitles.length && (
                                                    <MenuItem
                                                        key={ QUERY_TYPE.TARGET }
                                                        value={ QUERY_TYPE.TARGET }>
                                                        <Msg
                                                            id="misc.smartSearch.query.querySelectOptions.callassignment_target"
                                                        />
                                                    </MenuItem>
                                                ) }
                                                { purposeGroupQueriesWithTitles.length && (
                                                    <MenuItem
                                                        key={ QUERY_TYPE.PURPOSE }
                                                        value={ QUERY_TYPE.PURPOSE }>
                                                        <Msg
                                                            id="misc.smartSearch.query.querySelectOptions.callassignment_goal"
                                                        />
                                                    </MenuItem>
                                                ) }
                                            </StyledSelect>
                                        ),
                                        titleSelect: (
                                            <StyledSelect
                                                onChange={ e => handleOptionChange(+e.target.value) }
                                                value={ selectedQuery.id }>
                                                { renderedOptions.map(o => (
                                                    <MenuItem key={ o.id } value={ o.id }>
                                                        { o.title }
                                                    </MenuItem>
                                                )) }
                                            </StyledSelect>
                                        ),
                                    }}
                                />
                        ),
                    }}
                />
            ) }
        />
    );
};

export default SubQuery;
