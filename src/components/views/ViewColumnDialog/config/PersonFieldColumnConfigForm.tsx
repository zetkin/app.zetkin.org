import { FunctionComponent } from 'react';
import { useIntl } from 'react-intl';
import { MenuItem, Select } from '@material-ui/core';

import { PersonFieldViewColumn } from 'types/views';


interface PersonFieldColumnConfigFormProps {
    column: PersonFieldViewColumn;
    onChange: (column: PersonFieldViewColumn) => void;
}

const PersonFieldColumnConfigForm: FunctionComponent<PersonFieldColumnConfigFormProps> = ({ column, onChange }) => {
    const intl = useIntl();

    const onFieldChange = (val: typeof fields[number]) => {
        onChange({
            ...column,
            config: {
                field: val,
            },
            title: column.config.field !== val ? // Change title if field changes
                intl.formatMessage({ id: `misc.nativePersonFields.${val}` }) :
                column.title,
        });
    };

    // TODO: Load custom fields and add to menu
    const fields = [
        'first_name',
        'last_name',
        'email',
        'phone',
        'alt_phone',
        'co_address',
        'street_address',
        'zip_code',
        'city',
        'country',
        'gender',
        'ext_id',
    ];

    return (
        <Select
            onChange={ ev => onFieldChange(ev.target.value as string) }
            value={ column.config?.field || fields[0] }>
            { fields.map(fieldSlug => (
                <MenuItem key={ fieldSlug } value={ fieldSlug }>
                    { intl.formatMessage({ id: `misc.nativePersonFields.${fieldSlug}` }) }
                </MenuItem>
            )) }
        </Select>
    );
};

export default PersonFieldColumnConfigForm;
