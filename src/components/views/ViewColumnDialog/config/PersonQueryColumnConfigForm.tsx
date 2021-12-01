import { FunctionComponent } from 'react';
import { useQuery } from 'react-query';
import { useRouter } from 'next/router';
import { MenuItem, Select } from '@material-ui/core';

import getStandaloneQueries from 'fetching/getStandaloneQueries';
import { PersonQueryViewColumn } from 'types/views';
import ZetkinQuery from 'components/ZetkinQuery';


interface PersonQueryColumnConfigFormProps {
    config?: PersonQueryViewColumn['config'];
    onChange: (config: PersonQueryViewColumn['config']) => void;
}

const PersonQueryColumnConfigForm: FunctionComponent<PersonQueryColumnConfigFormProps> = ({ config, onChange }) => {
    const { orgId } = useRouter().query;
    const standaloneQuery = useQuery(['standaloneQueries', orgId], getStandaloneQueries(orgId as string));
    const standaloneQueries = standaloneQuery?.data || [];

    const onQueryChange = (queryId: number) => {
        onChange({
            ...config,
            query_id: queryId,
        });
    };

    return (
        <ZetkinQuery
            queries={{ standaloneQuery }}>
            <Select
                onChange={ ev => onQueryChange(ev.target.value as number) }
                value={ config?.query_id || '' }>
                { standaloneQueries.map(query => (
                    <MenuItem key={ query.id } value={ query.id }>
                        { query.title }
                    </MenuItem>
                )) }
            </Select>
        </ZetkinQuery>
    );
};

export default PersonQueryColumnConfigForm;
