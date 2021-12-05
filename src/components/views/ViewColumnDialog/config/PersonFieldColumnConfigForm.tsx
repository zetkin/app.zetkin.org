import { FunctionComponent } from 'react';
import { useIntl } from 'react-intl';
import { MenuItem, Select } from '@material-ui/core';

import { NATIVE_PERSON_FIELDS, PersonFieldViewColumn } from 'types/views';


interface PersonFieldColumnConfigFormProps {
    column: PersonFieldViewColumn;
    onChange: (column: PersonFieldViewColumn) => void;
}

const PersonFieldColumnConfigForm: FunctionComponent<PersonFieldColumnConfigFormProps> = ({ column, onChange }) => {
    const intl = useIntl();

    const onFieldChange = (val: NATIVE_PERSON_FIELDS ) => {
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

    return (
        <Select
            onChange={ ev => onFieldChange(ev.target.value as NATIVE_PERSON_FIELDS) }
            value={ column.config?.field || Object.values(NATIVE_PERSON_FIELDS)[0] }>
            { Object.values(NATIVE_PERSON_FIELDS).map(fieldSlug => (
                <MenuItem key={ fieldSlug } value={ fieldSlug }>
                    { intl.formatMessage({ id: `misc.nativePersonFields.${fieldSlug}` }) }
                </MenuItem>
            )) }
        </Select>
    );
};

export default PersonFieldColumnConfigForm;
