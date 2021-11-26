import { FunctionComponent } from 'react';
import { useIntl } from 'react-intl';
import { MenuItem, Select } from '@material-ui/core';

import { PersonFieldViewColumnConfig } from 'types/views';


interface PersonFieldColumnConfigFormProps {
    config?: PersonFieldViewColumnConfig;
    onChange: (config: PersonFieldViewColumnConfig) => void;
}

const PersonFieldColumnConfigForm: FunctionComponent<PersonFieldColumnConfigFormProps> = ({ config, onChange }) => {
    const intl = useIntl();

    const onFieldChange = (val: string) => {
        onChange({
            ...config,
            field: val,
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
            value={ config?.field || fields[0] }>
            { fields.map(fieldSlug => (
                <MenuItem key={ fieldSlug } value={ fieldSlug }>
                    { intl.formatMessage({ id: `misc.nativePersonFields.${fieldSlug}` }) }
                </MenuItem>
            )) }
        </Select>
    );
};

export default PersonFieldColumnConfigForm;
