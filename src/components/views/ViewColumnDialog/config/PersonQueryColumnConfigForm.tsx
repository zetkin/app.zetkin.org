import { FunctionComponent } from 'react';
import { useQuery } from 'react-query';
import { useRouter } from 'next/router';
import { MenuItem, Select } from '@material-ui/core';

import getStandaloneQueries from 'fetching/getStandaloneQueries';
import { PersonQueryViewColumn } from 'types/views';
import ZetkinQuery from 'components/ZetkinQuery';


interface PersonQueryColumnConfigFormProps {
    column: PersonQueryViewColumn;
    onChange: (config: PersonQueryViewColumn) => void;
}

const PersonQueryColumnConfigForm: FunctionComponent<PersonQueryColumnConfigFormProps> = ({ column, onChange }) => {
    const { orgId } = useRouter().query;

    return (
        <ZetkinQuery
            queries={{ standaloneQueriesQuery:  useQuery(['standaloneQueries', orgId], getStandaloneQueries(orgId as string)) }}>
            { ({ queries: { standaloneQueriesQuery } }) => {
                const onQueryChange = (queryId: number) => {
                    onChange({
                        ...column,
                        config: {
                            query_id: queryId,
                        },
                        title: standaloneQueriesQuery.data.find(query => query.id === queryId)?.title || '',
                    });
                };
                return (
                    <Select
                        onChange={ ev => onQueryChange(ev.target.value as number) }
                        value={ column.config?.query_id || '' }>
                        { standaloneQueriesQuery.data.map(query => (
                            <MenuItem key={ query.id } value={ query.id }>
                                { query.title }
                            </MenuItem>
                        )) }
                    </Select>
                );
            } }

        </ZetkinQuery>
    );
};

export default PersonQueryColumnConfigForm;
