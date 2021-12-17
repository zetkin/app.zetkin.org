import { FunctionComponent } from 'react';
import { useIntl } from 'react-intl';
import { useRouter } from 'next/router';
import { MenuItem, TextField } from '@material-ui/core';

import { PersonQueryViewColumn } from 'types/views';
import { useGetStandaloneQueries } from 'fetching/getStandaloneQueries';
import ZetkinQuery from 'components/ZetkinQuery';


interface PersonQueryColumnConfigFormProps {
    column: PersonQueryViewColumn;
    onChange: (config: PersonQueryViewColumn) => void;
}

const PersonQueryColumnConfigForm: FunctionComponent<PersonQueryColumnConfigFormProps> = ({ column, onChange }) => {
    const intl = useIntl();
    const { orgId } = useRouter().query;

    return (
        <ZetkinQuery
            queries={{ standaloneQueriesQuery: useGetStandaloneQueries(orgId as string) }}>
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
                    <TextField
                        fullWidth
                        label={ intl.formatMessage({ id: 'misc.views.columnDialog.editor.fieldLabels.smartSearch' }) }
                        margin="normal"
                        onChange={ ev => onQueryChange(ev.target.value as unknown as number) }
                        select
                        value={ column.config?.query_id || '' }>
                        { standaloneQueriesQuery.data.map(query => (
                            <MenuItem key={ query.id } value={ query.id }>
                                { query.title }
                            </MenuItem>
                        )) }
                    </TextField>
                );
            } }

        </ZetkinQuery>
    );
};

export default PersonQueryColumnConfigForm;
