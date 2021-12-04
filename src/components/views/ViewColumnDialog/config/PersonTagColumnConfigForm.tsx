import { FunctionComponent } from 'react';
import { useQuery } from 'react-query';
import { useRouter } from 'next/router';
import { MenuItem, Select } from '@material-ui/core';

import getTags from 'fetching/getTags';
import { PersonTagViewColumn } from 'types/views';
import ZetkinQuery from 'components/ZetkinQuery';


interface PersonTagColumnConfigFormProps {
    column: PersonTagViewColumn;
    onChange: (config: PersonTagViewColumn) => void;
}

const PersonTagColumnConfigForm: FunctionComponent<PersonTagColumnConfigFormProps> = ({ column, onChange }) => {
    const { orgId } = useRouter().query;
    const tagsQuery = useQuery(['tags', orgId], getTags(orgId as string));
    const tags = tagsQuery?.data || [];

    const onTagChange = (value: number) => {
        onChange({
            ...column,
            config: {
                tag_id: value,
            },
            title: tags.find(tag => tag.id === value)?.title || '',
        });
    };

    return (
        <ZetkinQuery
            queries={{ tagsQuery }}>
            <Select
                onChange={ ev => onTagChange(ev.target.value as number) }
                value={ column.config?.tag_id || '' }>
                { tags.map(tag => (
                    <MenuItem key={ tag.id } value={ tag.id }>
                        { tag.title }
                    </MenuItem>
                )) }
            </Select>
        </ZetkinQuery>
    );
};

export default PersonTagColumnConfigForm;
