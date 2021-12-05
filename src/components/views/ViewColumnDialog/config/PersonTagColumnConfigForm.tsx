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

    return (
        <ZetkinQuery
            queries={{ tagsQuery }}>
            { ({ queries: { tagsQuery } }) => {
                const onTagChange = (selectedTagId: number) => {
                    onChange({
                        ...column,
                        config: {
                            tag_id: selectedTagId,
                        },
                        title: tagsQuery.data.find(tag => tag.id === selectedTagId)?.title || '',
                    });
                };
                return (
                    <Select
                        onChange={ ev => onTagChange(ev.target.value as number) }
                        value={ column.config?.tag_id || '' }>
                        { tagsQuery.data.map(tag => (
                            <MenuItem key={ tag.id } value={ tag.id }>
                                { tag.title }
                            </MenuItem>
                        )) }
                    </Select>
                );
            } }
        </ZetkinQuery>
    );
};

export default PersonTagColumnConfigForm;
